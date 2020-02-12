import Server from "./classes/server";
import router from "./routes/router";

import bodyParser from 'body-parser';
import cors from 'cors';

import connect from './connect';

const server = Server.instance;

//===============================================
//                MIDDLEWARES
//===============================================
// Body Parser
server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use( bodyParser.json() );

// CORS
server.app.use( cors({ origin: true, credentials: true }));

// Router
server.app.use('/', router);



//===============================================
//                  START
//===============================================
server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
    
    const db = String(process.env.URLDB);
    connect({db});

})
