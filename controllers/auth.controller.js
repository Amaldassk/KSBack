import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';
import saveLogInfo from '../middlewares/logger/loginfo.js';


const LOG_TYPE = {
    SIGN_IN: "sign in",
    LOGOUT: "logout",
};

const LEVEL = {
    INFO: "info",
    ERROR: "error",
    WARB: "warn",
}

const MESSAGE = {
    SIGN_IN_ATTEMPT: "User attempting to sign in",
    SIGN_IN_ERROR: "Error occurred while signing in user: ",
    INCORRECT_EMAIL: "Incorrect email",
    INCORRECT_PASSWORD: "Incorrect password",
    DEVICE_BLOCKED: "Sign in attempt from blocked device",
    CONTEXT_DATA_VERIFY_ERROR: "Context data verification failed",
    MULTIPLE_ATTEMPT_WITHOUT_VERIFY:
      "Multiple sign in attempts detected without verifying identity.",
    LOGOUT_SUCCESS: "User has logged out successfully",
  };

const signinUser = async(req, res, next) => {
    try{
        const { email,password } = req.body;
        const existingUser = await userModel.findOne({
            email: {$eq: email},
        });
        
        if(!existingUser){
            await saveLogInfo(
                req,
                MESSAGE.INCORRECT_EMAIL,
                LOG_TYPE.SIGN_IN,
                LEVEL.ERROR
              );

            return res.status(400).json({
                message:"Invalid credentials",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if(!isPasswordCorrect){
            await saveLogInfo(
                req,
                MESSAGE.INCORRECT_PASSWORD,
                LOG_TYPE.SIGN_IN,
                LEVEL.ERROR
              );

            return res.status(400).json({
                message:"Invalid credentials",
            });
        }

        const payload = {
            id: existingUser.id,
            email: existingUser.email,
        }

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '6h',
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7h',
        });

        // const newRefreshToken = new Token({
        //     user: existingUser._id,
        //     accessToken,
        //     refreshToken,
        // });
        // await newRefreshToken.save();
        // console.log(newRefreshToken)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72*60*60*1000,
        });

        res.status(200).json({
            accessToken,
            refreshToken,
            accessTokenUpdatedAt: new Date().toLocaleString(),
            user:{
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                avatar: existingUser.avatar,
            },
        });
    } catch(err){
        await saveLogInfo(
            req,
            MESSAGE.SIGN_IN_ERROR + err.message,
            LOG_TYPE.SIGN_IN,
            LEVEL.ERROR
          );

        res.status(500).json({
            message:"Something went wrong",
        });
    }
}

const registerUser = async(req, res, next) => {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const isConsentGiven = JSON.parse(req.body.isConsentGiven);

    const defaultAvatar = 'https://raw.githubusercontent.com/Amaldassk/public_files/main/dp.jpg';
    const avatarUrl = req.file?.[0]?.filename ? `${req.protocol}://${req.get("host")}/assets/userAvatars/${req.file[0].filename}`:defaultAvatar;

    const emailDomain = req.body.email.split('@')[1];
    const role = emailDomain == 'amaldas.tech'?'moderator':'general';

    newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: role,
        avatar: avatarUrl,
    });

    try{
        await newUser.save();
        if(newUser.isNew){
            throw new Error('Failed to add user');
        }

        if(isConsentGiven === false){
            res.status(201).json({
                message:'User added successfully'
            });
        } else {
            next();
        }

    } catch(err){
        res.status(400).json({
            message: 'Failed to add a user',
        });
    }
};

const logout = async(req, res) => {
    try{
        await saveLogInfo(
            req,
            MESSAGE.LOGOUT_SUCCESS,
            LOG_TYPE.LOGOUT,
            LEVEL.INFO
        );
        const accessToken = req.headers.authorization?.split(' ')[1] ?? null;
        if(accessToken){
            await saveLogInfo(
                null,
                MESSAGE.LOGOUT_SUCCESS,
                LOG_TYPE.LOGOUT,
                LEVEL.INFO
            );
        }

        res.status(200).json({
            message:"Logout successful",
        });
    } catch(err){
        await saveLogInfo(null, err.message, LOG_TYPE.LOGOUT, LEVEL.ERROR);
        res.status(500).json({
            message: "Internal server error. Please try again later.",
          });
    }
}

export {signinUser, registerUser, logout};