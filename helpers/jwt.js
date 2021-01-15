const jwt = require('jsonwebtoken');

module.exports.generarJWT = (uid, name) => {

    return new Promise(( resolve, reject ) => {
        const payload = { uid, name };
        jwt.sign(payload, process.env.SECRET_JWT_SEED,{
            expiresIn: '2'
        },(err, token)=>{
            if(err){
                console.log(err);
                reject('No se genero el token');
            }
            resolve( token );
        })
    })


}