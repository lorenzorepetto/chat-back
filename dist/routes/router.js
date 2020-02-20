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
const express_1 = require("express");
const room_model_1 = __importDefault(require("../models/room.model"));
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
const user_model_1 = __importDefault(require("../models/user.model"));
const server_1 = __importDefault(require("../classes/server"));
const router = express_1.Router();
const server = server_1.default.instance;
//===============================================
//                  ROUTES
//===============================================
//===============================================
//                  GET
//===============================================
router.get('/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentRoom = yield room_model_1.default.findOne({ name: 'PRINCIPAL' })
        .then((room) => room)
        .catch(err => {
        throw err;
    });
    if (!currentRoom) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No existe sala con ese ID'
            }
        });
    }
    message_controller_1.default.GetMessagesInRoom(currentRoom._id)
        .then(messages => {
        return res.json({
            ok: true,
            currentRoom,
            messages
        });
    })
        .catch(err => res.status(500).json({
        ok: false,
        err
    }));
}));
router.get('/room', (req, res) => {
    room_model_1.default.find({})
        .populate({ path: 'owner', model: user_model_1.default })
        .exec((err, rooms) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            rooms
        });
    });
});
router.get('/room/:room_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentRoom = yield room_model_1.default.findById(req.params.room_id)
        .populate({ path: 'owner', model: user_model_1.default })
        .then((room) => room)
        .catch(err => {
        throw err;
    });
    if (!currentRoom) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No existe sala con ese ID'
            }
        });
    }
    message_controller_1.default.GetMessagesInRoom(currentRoom._id)
        .then(messages => {
        return res.json({
            ok: true,
            currentRoom,
            messages
        });
    })
        .catch(err => res.status(500).json({
        ok: false,
        err
    }));
}));
router.get('/room/:room_id/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentRoom = yield room_model_1.default.findById(req.params.room_id)
        .then((room) => room)
        .catch(err => {
        throw err;
    });
    if (!currentRoom) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No existe sala con ese ID'
            }
        });
    }
    message_controller_1.default.GetAllMessagesInRoom(currentRoom._id)
        .then(messages => {
        return res.json({
            ok: true,
            messages
        });
    })
        .catch(err => res.status(500).json({
        ok: false,
        err
    }));
}));
//===============================================
//                  POST
//===============================================
router.post('/room', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    const user = yield user_model_1.default.findOne({ email: body.email })
        .then(user => user);
    if (!user) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No existe usuario con ese email'
            }
        });
    }
    const newRoom = new room_model_1.default({
        name: body.name,
        description: body.description,
        owner: user._id
    });
    newRoom.save((err, room) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            room
        });
        room_model_1.default.find({})
            .populate({ path: 'owner', model: user_model_1.default })
            .exec((err, rooms) => {
            if (err)
                throw err;
            server.io.emit('update-rooms', { rooms });
        });
    });
}));
//===============================================
//                  DELETE
//===============================================
router.delete('/room/:room_id', (req, res) => {
    room_model_1.default.findById(req.params.room_id, (err, room) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!room) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe sala con ese ID'
                }
            });
        }
        room.remove((err, room) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                room
            });
            room_model_1.default.find({})
                .populate({ path: 'owner', model: user_model_1.default })
                .exec((err, rooms) => {
                if (err)
                    throw err;
                server.io.emit('update-rooms', { rooms });
            });
        });
    });
});
//===============================================
//                  EXPORTS
//===============================================
exports.default = router;
