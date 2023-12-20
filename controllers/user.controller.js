import dayjs from 'dayjs';
import userModel from "../models/user.model.js";

const getAUser = async(req, res, next) => {
    try{
        const user = await userModel.findById(req.params.id).select("-password").lean();

        const createdAt = dayjs(user.createdAt);
        // console.log(createdAt);
        // const now = dayjs();
        // console.log(now);
        // const durationObj = dayjs.duration(now.diff(createdAt));
        // console.log(durationObj)
        // const durationMinutes = durationObj.asMinutes();
        // const durationHours = durationObj.asHours();
        // const durationDays = durationObj.asDays();

        user.duration = createdAt;

        // if (durationMinutes < 60) {
        //     user.duration = `${Math.floor(durationMinutes)} minutes`;
        //   } else if (durationHours < 24) {
        //     user.duration = `${Math.floor(durationHours)} hours`;
        //   } else if (durationDays < 365) {
        //     user.duration = `${Math.floor(durationDays)} days`;
        //   } else {
        //     const durationYears = Math.floor(durationDays / 365);
        //     user.duration = `${durationYears} years`;
        //   }

        res.status(200).json(user);
    } catch(err){
        next(err);
    }
}

export {getAUser};