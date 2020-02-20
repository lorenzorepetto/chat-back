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
const uniqueValidator = require('mongoose-unique-validator');
//===============================================
//                  SCHEMA
//===============================================
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String, required: true }
});
// unique validator
UserSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});
//===============================================
//                  EXPORTS
//===============================================
exports.default = mongoose_1.default.model('User', UserSchema);
