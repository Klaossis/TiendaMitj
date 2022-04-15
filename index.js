const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require("dotenv").config({ path: "variables.env"});

// Cors permite que un cliente se conecta a otro servidor para el intercambio de recursos

const cors = require('cors');

// conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
//mongoose.connect("mongodb://localhost/restapis", {

    useNewUrlParser: true
});

// crear el servidor
const app = express();

// habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Definir un dominio para recibir peticiones
const whitelist = [process.env.FRONTEND_URL];
//const whitelist = ["http://localhost:3000"];
const corsOptions = {
    origin: (origin, callback) => {
        //console.log(origin);
        // Revisar si la peticion viene de un servidor que esta en la whitelist
        const existe = whitelist.some(dominio => dominio === origin);
        if(existe){
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    }
}

// Habilitar cors
app.use(cors(corsOptions));
//app.use(cors());


// Rutas de la app
app.use('/', routes());

// carpeta publica
app.use(express.static('uploads'));

// puerto
//app.listen(5000);

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;

// Iniciar app
app.listen(port, host, () => {
    console.log("El servidor esta funcionando");
})