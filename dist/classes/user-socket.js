"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_NAME = 'No name';
exports.NO_ROOM = 'No room';
exports.NO_IMAGE = 'No image';
exports.NO_EMAIL = 'No email';
class UserSocket {
    constructor(id) {
        this.id = id;
        this.email = exports.NO_EMAIL;
        this.name = exports.NO_NAME;
        this.room_id = exports.NO_ROOM;
        this.picture = exports.NO_IMAGE;
        this.status = 'ONLINE';
    }
}
exports.UserSocket = UserSocket;
