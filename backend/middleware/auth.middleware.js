// auth
import jwt from "jsonwebtoken";

const verifyToken =(req,res,next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

    if(!token){
        return res.status(401).json({
            success: false,
             message: 'Không tìm thấy token xác thực!'
        })
    }


    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.userId
        next();
    }catch(err){
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn!'
            })
        }
        return res.status(403).json({
            success: false,
            message: 'Token không hợp lệ!'
        })
    }
}
export default verifyToken;