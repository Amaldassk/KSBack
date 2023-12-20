import express from 'express'
const router = express.Router()
import { signinUser, registerUser, logout } from '../controllers/auth.controller.js'

router.post('/signin', signinUser)
router.post('/signup', registerUser)
router.post('/logout', logout)

export default router