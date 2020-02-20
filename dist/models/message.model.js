"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
//===============================================
//                  SCHEMA
//===============================================
const MessageSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    date: { type: Date, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'user' },
    room: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'room' },
});
//===============================================
//                  EXPORTS
//===============================================
exports.default = mongoose_1.default.model('Message', MessageSchema);
