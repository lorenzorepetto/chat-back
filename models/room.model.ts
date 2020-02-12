import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
const uniqueValidator = require('mongoose-unique-validator')

//===============================================
//                  INTERFACE
//===============================================
export interface IRoom extends Document {
  name: string,
  owner: IUser['_id']
}

//===============================================
//                  SCHEMA
//===============================================
const RoomSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  owner: { type: Schema.Types.ObjectId, required: true }
});


// unique validator
RoomSchema.plugin( uniqueValidator, {
    message: '{PATH} debe ser único'
})

//===============================================
//                  EXPORTS
//===============================================
export default mongoose.model<IRoom>('Room', RoomSchema);