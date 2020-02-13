import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IRoom } from './room.model';

//===============================================
//                  INTERFACE
//===============================================
export interface IMessage extends Document {
    text: string,
    date: Date,
    user: IUser['_id'],
    room: IRoom['_id']
}

//===============================================
//                  SCHEMA
//===============================================
const MessageSchema: Schema = new Schema({
  text: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  room: { type: Schema.Types.ObjectId, required: true, ref: 'room' },
});


//===============================================
//                  EXPORTS
//===============================================
export default mongoose.model<IMessage>('Message', MessageSchema);