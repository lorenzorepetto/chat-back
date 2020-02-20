"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_list_1 = require("../classes/user-list");
const user_socket_1 = require("../classes/user-socket");
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
// Lista
exports.users = new user_list_1.UserList();
//===============================================
//                  OPERACIONES
//===============================================
//===============================================
//                  USUARIOS
//===============================================
// Conectar
exports.connect = (client) => {
    const user = new user_socket_1.UserSocket(client.id);
    exports.users.add(user);
};
// Desconectar
exports.disconnect = (client, io) => {
    client.on('disconnect', () => {
        const user = exports.users.deleteUser(client.id);
        if (user) {
            io.to(user.room_id).emit('active-users', exports.users.getUsersInRoom(user.room_id));
        }
    });
};
// Configurar usuario
exports.setUser = (client, io) => {
    client.on('set-user', (payload) => {
        exports.users.setUser(client.id, payload);
        // unirse a la sala
        client.join(payload.room_id);
        io.to(payload.room_id).emit('active-users', exports.users.getUsersInRoom(payload.room_id));
    });
};
// Cambiar estado
exports.setStatus = (client, io) => {
    client.on('set-status', (payload) => {
        exports.users.setStatus(client.id, payload.status);
        // unirse a la sala
        client.join(payload.room_id);
        io.to(payload.room_id).emit('active-users', exports.users.getUsersInRoom(payload.room_id));
    });
};
// Cambiar de sala
exports.changeRoom = (client, io) => {
    client.on('change-room', (payload) => {
        let user = exports.users.getUser(client.id);
        if (!user)
            return;
        // Dejar sala anterior
        client.leave(user.room_id);
        // Setear sala
        let old_room = user.room_id;
        exports.users.setRoom(client.id, payload.room_id);
        // Unirse a nueva sala
        client.join(payload.room_id);
        io.to(old_room).emit('active-users', exports.users.getUsersInRoom(old_room));
        io.to(payload.room_id).emit('active-users', exports.users.getUsersInRoom(payload.room_id));
    });
};
//===============================================
//                  MENSAJES
//===============================================
// Escuchar mensajes
exports.message = (client, io) => {
    client.on('message', (payload) => {
        // unirse a la sala
        client.join(payload.room);
        // Guardar mensaje en BD
        message_controller_1.default.CreateMessage(payload)
            .then(() => {
            message_controller_1.default.GetMessagesInRoom(payload.room)
                .then((messages) => {
                io.to(payload.room).emit('update-messages', messages);
            });
        });
    });
};
// Eliminar mensaje
exports.deleteMessage = (client, io) => {
    client.on('delete-message', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        // unirse a la sala
        client.join(payload.room_id);
        // Eliminar mensaje en BD
        message_controller_1.default.DeleteMessage(payload.message_id)
            .then(() => {
            message_controller_1.default.GetMessagesInRoom(payload.room_id)
                .then((messages) => {
                io.to(payload.room_id).emit('update-messages', messages);
            });
        });
    }));
};
// Eliminar todos los mensajes en sala
exports.deleteAllMessages = (client, io) => {
    client.on('delete-all-messages', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        // unirse a la sala
        client.join(payload.room_id);
        // Eliminar mensaje en BD
        message_controller_1.default.DeleteAllMessagesInRoomBy(payload.email, payload.room_id)
            .then(() => {
            message_controller_1.default.GetMessagesInRoom(payload.room_id)
                .then((messages) => {
                io.to(payload.room_id).emit('update-messages', messages);
            });
        });
    }));
};
