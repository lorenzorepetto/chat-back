import mongoose, { Schema, Document } from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator')

//===============================================
//                  INTERFACE
//===============================================
export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
}

//===============================================
//                  SCHEMA
//===============================================
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: false }
});


// unique validator
UserSchema.plugin( uniqueValidator, {
    message: '{PATH} debe ser único'
})

//===============================================
//                  EXPORTS
//===============================================
export default mongoose.model<IUser>('User', UserSchema);