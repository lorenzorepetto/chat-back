"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_socket_1 = require("./user-socket");
class UserList {
    constructor() {
        this.list = [];
    }
    //===============================================
    //                  SET
    //===============================================
    add(user) {
        this.list.push(user);
        return user;
    }
    setUser(id, user) {
        for (let u of this.list) {
            if (u.id === id) {
                u.email = user.email;
                u.picture = user.picture;
                u.name = user.name;
                u.room_id = user.room_id;
                break;
            }
        }
    }
    setStatus(id, status) {
        const user = this.getUser(id);
        if (user) {
            user.status = status;
        }
    }
    setRoom(id, room_id) {
        for (let u of this.list) {
            if (u.id === id) {
                u.room_id = room_id;
                break;
            }
        }
    }
    //===============================================
    //                  GET
    //===============================================
    getList() {
        return this.list.filter(user => user.name !== user_socket_1.NO_NAME);
    }
    getUser(id) {
        return this.list.find(user => user.id === id);
    }
    getUsersInRoom(room_id) {
        return this.list.filter(user => user.room_id === room_id);
    }
    //===============================================
    //                  DELETE
    //===============================================
    deleteUser(id) {
        const tempUser = this.getUser(id);
        this.list = this.list.filter(user => user.id !== id);
        return tempUser;
    }
}
exports.UserList = UserList;
