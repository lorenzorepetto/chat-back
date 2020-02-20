"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = ({ db }) => {
    const connect = () => {
        mongoose_1.default
            .connect(db, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
            .then(() => {
            return console.info(`Base de datos ONLINE - ${db}`);
        })
            .catch(error => {
            console.error('Error al conectar con la base de datos: ', error);
            return process.exit(1);
        });
    };
    connect();
    mongoose_1.default.connection.on('disconnected', connect);
};
