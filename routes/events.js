const { Router } = require('express');
const router = Router();
const { validarJWT } = require('../middlewares/validarToken');
const { response } = require('express');
const { hasRequired, MyError, errorResponse } = require('../libs/common');

// router.use( validarJWT );


const Evento = require('../models/evento');

//mostararEvento
router.route('/')
    .get( async(req, res = response) => {
    
    try {
            const eventos = await Evento.find().populate('user','name');
            

            
            return res.status(200).json({ok: true, eventos });
        } catch (err) {
            if (err.code && err.code === 11000) err = { status: 412, error: 'Precondition failed' };
            return errorResponse(err, res);
        } 
    });



//crearEvento
router.route('/crear')
    .post( async(req, res = response) => {
    
        const evento = new Evento(req.body);

        try {
            evento.user = req.uid;
            const ev = await evento.save();

            return res.status(200).json({ok: true, evento: ev });
        } catch (err) {
            if (err.code && err.code === 11000) err = { status: 412, error: 'Precondition failed' };
            return errorResponse(err, res);
        } 
    });

//actualizarEvento
router.route('/:id')
    .put( async(req, res = response) => {
        const evId = req.params.id;
        const uid = req.uid;
        try {
            const evento = await Evento.findById(evId);
            if ( !evento ){
                return res.status(404).json({
                    ok:false,
                    msg: "id invalido"
                });
            } 

            // valido que otro usuario no edite 
            if ( evento.user.toString() !== uid ){
                return res.status(404).json({
                    ok:false,
                    msg: "No tiene privilegio de editar este evento"
                });
            }

            const nuevoEvento = {
                ...req.body,
                user: uid
            }

            const eventoActualizado = await Evento.findByIdAndUpdate( evId, nuevoEvento, { new : true } );

            
            return res.status(200).json({ok: true, evento: eventoActualizado});
        } catch (err) {
            if (err.code && err.code === 11000) err = { status: 412, error: 'Precondition failed' };
            return errorResponse(err, res);
        } 
    })

//borrarEvento
router.route('/:id')
    .delete( async(req, res = response) => {
        const evId = req.params.id;
        const uid = req.uid;
        try {
            const evento = await Evento.findById(evId);
            if ( !evento ){
                return res.status(404).json({
                    ok:false,
                    msg: "id invalido"
                });
            } 

            // valido que otro usuario no edite 
            if ( evento.user.toString() !== uid ){
                return res.status(404).json({
                    ok:false,
                    msg: "No tiene privilegio de eliminar este evento"
                });
            }

            const eventoEliminado = await Evento.findOneAndDelete( evId );

            return res.status(200).json({ok: true, evento: eventoEliminado});
        } catch (err) {
            if (err.code && err.code === 11000) err = { status: 412, error: 'Precondition failed' };
            return errorResponse(err, res);
        } 
    })


    module.exports = router;