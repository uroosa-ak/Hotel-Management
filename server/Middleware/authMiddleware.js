const jwt=require("jsonwebtoken")
const authMiddleware = async (req,res,next)=>{
    try {
        let token= req.cookies.token 
        if (token) {
            let decodeduser =  await jwt.verify(token,process.env.JWT_SECRET)
            req.user= decodeduser
            next()
        } else {
            res.json({
                message:"unauthorized user",status:false
            })
        }
    } catch (error) {
         res.json({
                message:error.message,
                status:false
            })
    }
}
module.exports= authMiddleware;