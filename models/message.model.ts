import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IRoom } from './room.model';

//===============================================
//                  INTERFACE
//===============================================
export interface IMessage extends Document {
    text: string,
    owner: IUser['_id'],
    room: IRoom['_id']
}

//===============================================
//                  SCHEMA
//===============================================
const MessageSchema: Schema = new Schema({
  text: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true },
  room: { type: Schema.Types.ObjectId, required: true },
});


//===============================================
//                  EXPORTS
//===============================================
export default mongoose.model<IMessage>('Message', MessageSchema);