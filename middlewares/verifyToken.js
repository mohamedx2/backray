const jwt =require("jsonwebtoken");



//Verify Token 
function verifyToken(req,res ,next){
  const authToken=req.headers.authorization;
  if(authToken){
    const token =authToken.split(" ")[1];
    try {
      const decodedPayload =jwt.verify(token,process.env.JWT_SECRET);
      req.user=decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({message : "invalid token ,access denied "});

    }

  }else{
    return res.status(401).json({message :"no token provided , access denied"});
  }
}



//token update 
function verifyTokenAdminUser(req,res,next){
if(verifyTokenAndOnlyUser||verifyTokenAndAdmin){
  next();
} else{ return res.status(403).json({message: "not allowed ,only admin or user "});
}}



//verifyToken admin
function verifyTokenAndAdmin(req,res ,next){
  
    verifyToken(req,res,()=>{
      if (req.user.isAdmin){
        next();
      }else{
        return res.status(403).json({message: "not allowed ,only admin "});
      }
    })
  
}


//verifyToken only user
function verifyTokenAndOnlyUser(req,res ,next){
  
  verifyToken(req,res,()=>{
    if (req.user.id === req.params.id){
      next();
    }else{
      return res.status(403).json({message: "not allowed ,only user himself "});
    }
  })

}


//verifyToken only user or admin
function verifyTokenAndAuthorization(req,res ,next){
  
  verifyToken(req,res,()=>{
    if (req.user.id === req.params.id|| req.user.isAdmin){
      next();
    }else{
      return res.status(403).json({message: "not allowed ,only user himself or admin "});
    }
  })

}
module.exports={
  verifyTokenAdminUser,
  verifyToken, 
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization
}