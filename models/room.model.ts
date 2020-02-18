import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
const uniqueValidator = require('mongoose-unique-validator')

//===============================================
//                  INTERFACE
//===============================================
export interface IRoom extends Document {
  name: string,
  owner: IUser['_id'],
  description?: string
}

//===============================================
//                  SCHEMA
//===============================================
const RoomSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  owner: { type: Schema.Types.ObjectId, required: false, ref: 'owner' }
});


// unique validator
RoomSchema.plugin( uniqueValidator, {
    message: '{PATH} debe ser único'
})

//===============================================
//                  EXPORTS
//===============================================
export default mongoose.model<IRoom>('Room', RoomSchema);