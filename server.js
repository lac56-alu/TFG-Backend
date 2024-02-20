'use strict';
console.log('¡BIENVENIDO A ELEMENT GYM BACKEND!');

// Declaracion e inicializacion dependencias
const express = require('express')
const cors = require('cors')
const sequelize = require('./models')
const swaggerUi = require('swagger-ui-express')
const https = require('https')
const oas3Tools = require('oas3-tools');
const path = require('path');
const YAML = require('yamljs');
const http = require('http');
const router = require('./router/index');
const morgan = require('morgan');

// Configuracion puertos
const port = process.env.PORT || 8082;

// Configuracion inicial de la API
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    req._originalBody = {...req.body };
    next();
});

// Configuracion enrutamiento
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'))

// Configuracion endpoints
app.use('/tfg', router)
app.use('/', express.static('public'));

app.get('*', function(request, response, next) {
    response.sendFile(path.resolve(__dirname, '../public/index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Abierta conexion: http://localhost:${port}`);
    });
} else {
    https.createServer(app).listen(port, function() {
        console.log(`App escuchando en: https://localhost:${port}`);
    });
}

/*
// Configuracion documentacion
const swaggerFile = process.env.NODE_ENV !== 'production' ? './swagger.yaml' : './swagger.prod.yaml';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(YAML.load(path.resolve(__dirname, swaggerFile))));
*/

