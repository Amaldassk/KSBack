import express from 'express';
const router = express.Router();
import { getAUser } from '../controllers/user.controller.js';

router.get("/:id",getAUser);

export default router
