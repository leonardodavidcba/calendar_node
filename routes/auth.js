const { Router } = require('express');
const router = Router();

const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validarToken');


router.post('/crear', crearUsuario);

router.get('/token', validarJWT, revalidarToken)
    

router.post('/login',loginUsuario);



module.exports = router;
