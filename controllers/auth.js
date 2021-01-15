const { response } = require('express');
const bcrypt = require('bcryptjs');
const { hasRequired, MyError, errorResponse } = require('../libs/common');
const { generarJWT } = require('../helpers/jwt');


const Usuario = require('../models/usuario');
      

const crearUsuario = async(req, res = response) => {
    const data = req.body;
    const { email, password } = data;
    try {

        console.log(email);
        
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) return res.status(412).json({msg:'email registrado'});

        if (!hasRequired(['name','email','password'], data, true)) throw new MyError(400, 'Bad request');
    
        const usuario_data = {
            name: data.name,
            email: data.email,
            password: data.password
        };

        usuario = new Usuario(usuario_data);

        // encriptar
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        const saved = await usuario.save();

        

        const token = await generarJWT( usuario.id , usuario.name );
        
        return res.status(200).json({usuario: saved, token: token});
    } catch (err) {
        if (err.code && err.code === 11000) err = { status: 412, error: 'Precondition failed' };
        return errorResponse(err, res);
    }  
}

const loginUsuario = async(req, res) => {
    const { email, password } = req.body;
    try {
        let usr = await Usuario.findOne({ email });

        if ( !usr ) return res.status(412).json({msg:'credenciales incorrectas'});


        const validPassword = bcrypt.compareSync( password, usr.password );
       

        if ( !validPassword ) {
            return res.status(400).json({
                msg:'Password incorrecto'
            });
        }

        const token = await generarJWT( usuario.id , usuario.name );

        return res.status(200).json({usuario: 'Logeado', token: token});


    } catch (err) {
        if (err.code && err.code === 11000) err = { status: 412, error: 'Precondition failed' };
        return errorResponse(err, res);
    }


}


const revalidarToken = ((req, res = response) => {

    const uid = req.uid;
    const name = req.name;

console.log(name);

    res.json({
        token:true,
        uid: uid,
        name: name
    })
})


module.exports = {
    crearUsuario, loginUsuario, revalidarToken
}