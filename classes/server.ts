import express from 'express';
import socketIO from 'socket.io';
import http from 'http';

// socket
import * as socket from '../socket/socket';

import { SERVER_PORT } from '../global/environment';

export default class Server {
    // Singleton
    private static _instance: Server;

    public app: express.Application;
    public port: number; 

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT; 
        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );
        this.escucharSockets();
    }

    // Singleton
    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }


    start( callback: Function ) {
        this.httpServer.listen( this.port, callback() );
    }


    //===============================================
    //                  Privados
    //===============================================
    private escucharSockets() {
        console.log("Escuchando conexiones - sockets");
        this.io.on('connection', client => {
            console.log('Cliente conectado');
            
            // Desconectar
            socket.desconectar(client);

            // Mensajes
            socket.mensaje(client, this.io);

        })
    }

}