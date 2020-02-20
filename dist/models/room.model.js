"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const message_model_1 = __importDefault(require("./message.model"));
const uniqueValidator = require('mongoose-unique-validator');
//===============================================
//                  SCHEMA
//===============================================
const RoomSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    owner: { type: mongoose_1.Schema.Types.ObjectId, required: false, ref: 'owner' }
});
// unique validator
RoomSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});
//===============================================
//                  MIDDLEWARES
//===============================================
RoomSchema.pre('remove', function (next) {
    message_model_1.default.remove({ room: this._id }).exec();
    next();
});
//===============================================
//                  EXPORTS
//===============================================
exports.default = mongoose_1.default.model('Room', RoomSchema);
