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
const message_model_1 = __importDefault(require("../models/message.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
//===============================================
//                  FUNCTIONS
//===============================================
function CreateMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        // Buscar usuario
        let user = yield user_model_1.default.findOne({ email: message.user.email }, (err, userDB) => {
            if (err)
                throw err;
            if (!userDB) {
                let newUser = new user_model_1.default({
                    email: message.user.email,
                    name: message.user.name,
                    picture: message.user.picture
                });
                newUser.save((err, userDB) => {
                    if (err)
                        throw err;
                    return userDB;
                });
            }
            else {
                return userDB;
            }
        });
        if (user) {
            // Crear Mensaje
            return yield message_model_1.default.create({
                text: message.text,
                date: new Date(),
                user: user._id,
                room: message.room
            })
                .then((messageDB) => __awaiter(this, void 0, void 0, function* () {
                let message = yield messageDB.populate({ path: 'user', model: user_model_1.default }).execPopulate();
                return message;
            }))
                .catch((error) => {
                throw error;
            });
        }
        else {
            return null;
        }
    });
}
function DeleteMessage(message_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            message_model_1.default.findByIdAndRemove(message_id, (err, deletedMessage) => {
                if (err)
                    reject(err);
                resolve(deletedMessage);
            });
        });
    });
}
function DeleteAllMessagesInRoomBy(email, room_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            message_model_1.default.deleteMany({ room: room_id }, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
    });
}
function GetMessagesInRoom(room_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            message_model_1.default.find({ room: room_id })
                .select('_id text date user')
                .sort({ date: -1 })
                .limit(8)
                .populate({ path: 'user', model: user_model_1.default })
                .exec((err, messages) => {
                if (err)
                    reject(err);
                messages = messages.reverse();
                message_model_1.default.countDocuments({ room: room_id }, (err, total) => {
                    if (err)
                        reject(err);
                    resolve({ messages, total });
                });
            });
        });
    });
}
function GetAllMessagesInRoom(room_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            message_model_1.default.find({ room: room_id })
                .select('_id text date user')
                .sort({ date: -1 })
                .populate({ path: 'user', model: user_model_1.default })
                .exec((err, messages) => {
                if (err)
                    reject(err);
                messages = messages.reverse();
                resolve(messages);
            });
        });
    });
}
//===============================================
//                  EXPORTS
//===============================================
exports.default = {
    CreateMessage,
    DeleteMessage,
    GetMessagesInRoom,
    GetAllMessagesInRoom,
    DeleteAllMessagesInRoomBy
};
