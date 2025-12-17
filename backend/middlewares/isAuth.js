import jwt from 'jsonwebtoken';

const isAuth = async(req,res,next) =>{
    try{
        let {token} = req.cookies;
        if(!token){
            return res.status(401).json({message:"Unauthorized! No token provided"});
        }

        let verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!verifyToken){
            return res.status(401).json({message:"Unauthorized! Invalid token"});
        }
        req.userId = verifyToken.userId;
        next();
    } catch(err){
        console.log("Error in isAuth middleware:", err);
        return res.status(500).json({message:"Internal Server Error", error: err.message});
    }   
}

export default isAuth;