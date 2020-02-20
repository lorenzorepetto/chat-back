"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
// socket
const socket = __importStar(require("../socket/socket"));
const environment_1 = require("../global/environment");
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = environment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.listen();
    }
    // Singleton
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start(callback) {
        this.httpServer.listen(this.port, callback());
    }
    //===============================================
    //                  Privados
    //===============================================
    listen() {
        console.log("Escuchando conexiones - sockets");
        this.io.on('connection', client => {
            // Conectar
            socket.connect(client);
            // Desconectar
            socket.disconnect(client, this.io);
            // Configurar
            socket.setUser(client, this.io);
            socket.setStatus(client, this.io);
            socket.changeRoom(client, this.io);
            // Mensajes
            socket.message(client, this.io);
            socket.deleteMessage(client, this.io);
            socket.deleteAllMessages(client, this.io);
        });
    }
}
exports.default = Server;
