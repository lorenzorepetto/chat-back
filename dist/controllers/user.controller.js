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
const user_model_1 = __importDefault(require("../models/user.model"));
//===============================================
//                  FUNCTIONS
//===============================================
function CreateUser(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        // Buscar usuario
        return new Promise((resolve, reject) => {
            user_model_1.default.findOne({ email: userInput.email }, (err, userDB) => {
                if (err)
                    reject(err);
                if (!userDB) {
                    // No lo encuentró, crea uno
                    let newUser = new user_model_1.default({
                        email: userInput.email,
                        name: userInput.name,
                        picture: userInput.picture
                    });
                    newUser.save((err, userDB) => {
                        if (err)
                            reject(err);
                        resolve(userDB);
                    });
                }
                else {
                    //Lo encontró y se retorna
                    resolve(userDB);
                }
            });
        });
    });
}
//===============================================
//                  EXPORTS
//===============================================
exports.default = {
    CreateUser
};
