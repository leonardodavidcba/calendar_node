const { Schema, model } = require('mongoose');


const UsuarioSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UsuarioSchema.index({'name': 1 }, );
UsuarioSchema.index({'email': 1 }, { unique: true } );
UsuarioSchema.index({'password': 1 });

module.exports = model('Usuario', UsuarioSchema);

