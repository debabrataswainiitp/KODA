import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
const isAuth=async (req,res,next)=>{
try {
    const token=req.cookies.token
    //IF NO TOKEN--
    if(!token){
        return res.status(400).json({message:"token not found"})
    }
    //IF TOKEN AVL--
     const decoded=jwt.verify(token,process.env.JWT_SECRET)
     req.user=await User.findById(decoded.id)
     next()
} catch (error) {
    return res.status(500).json({message:"invalid token"})
}
}

export default isAuth
// MOTIVE OF THIS FILE IS TO CHECK THAT IF USER IS AUTHENTICATED OR NOT