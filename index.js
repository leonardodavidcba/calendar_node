const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
// crea el servidor de express
const app = express();


// base datos
 const mongoose = require('mongoose');
    
if (mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DATABASE}/${process.env.NAME_BD}`,
         {  useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        })) {
            console.log('DB on-line');
        }
       
// CORS

app.use(cors());

// directorio publico
app.use(express.static('public'));

// lectura y parceo del body
app.use( bodyParser.json() );

// rutas 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}` );
})