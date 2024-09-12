function checkAdmin (req,res,next){
    if(req.user.id.role!='admin'){
        res.status(403).send({message:'You are not authorized to access this resource.'});

    }
next();

}
 module.exports= checkAdmin;