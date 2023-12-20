import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import Database from './config/dbConnect.js'
import userRoute from './routes/user.route.js'
import productRoute from './routes/product.route.js'
import emailRoute from './routes/email.route.js'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import { dirname } from 'path';

const PORT = process.env.PORT || 3500;
const __dirname = dirname(__filename);

const db = new Database(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

db.connect().catch((err)=>
    console.error("Error connecting to database:", err)
);

app.use(express.json());
app.use(cors());
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/product', productRoute);
app.use('/api/message', emailRoute);

app.get("/",(req, res)=>{
    return res.json({message:"listening"})
});

app.listen(PORT,()=>{
    console.log(`Server listening to port:${PORT}`);
});