import express from "express"
import { registerUser,loginuser } from "../controller/auth.controller.js"
const router=express.Router()
router.post("/register",registerUser)
router.post("/login",loginuser)
export default router