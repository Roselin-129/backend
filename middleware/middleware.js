const jwt=require('jsonwebtoken');
function authmiddleware(req,res,next){
    const authorization = req.headers.authorization;
    const{schema,token}=authorization?authorization.split(' '):{};
    if(schema!=='Bearer'||!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    const secretKey=process.env.JWT_SECRET;

    if(!secretKey){
        return next(new Error('JWT_SECRET is not defined'))
    }
    try{
        req.user=jwt.verify(token,secretKey);
        return next();
    }
    catch(error){
        return res.status(401).json({message:"The token is expired or invalid!"});
    }
    
}
module.exports=authmiddleware;