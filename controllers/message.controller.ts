import Message from "../models/message.model";
import { IUser } from "../models/user.model";
import { IRoom } from "../models/room.model";
import { IMessage } from '../models/message.model';

//===============================================
//                  INTERFACE
//===============================================
interface ICreateMessageInput {
    text: string,
    user: IUser['_id'],
    room: IRoom['_id']
}

//===============================================
//                  FUNCTIONS
//===============================================
async function CreateMessage (message: ICreateMessageInput): Promise<IMessage> {
    return await Message.create({
      text: message.text,
      date: new Date(),
      user: message.user,
      room: message.room
    })
      .then((data: IMessage) => {
        return data;
      })
      .catch((error: Error) => {
        throw error;
      });
  }
  
  export default {
    CreateMessage
  };