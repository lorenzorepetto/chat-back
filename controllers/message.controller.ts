import Message from "../models/message.model";
import User, { IUser } from "../models/user.model";
import { IRoom } from "../models/room.model";
import { IMessage } from '../models/message.model';

//===============================================
//                  INTERFACE
//===============================================
export interface ICreateMessageInput {
    text: string,
    user: IUser,
    room: string
}

//===============================================
//                  FUNCTIONS
//===============================================
async function CreateMessage (message: ICreateMessageInput) {
  
  // Buscar usuario
  let user = await User.findOne({ email: message.user.email }, (err, userDB) => {
    if (err) throw err;
    if (!userDB) {
      let newUser = new User({
        email: message.user.email,
        name: message.user.name,
        picture: message.user.picture
      })
      newUser.save( (err, userDB) => {
        if (err) throw err;
        return  userDB;
      })
    } else {
      return userDB
    }
  })

  if (user) {
    // Crear Mensaje
    return await Message.create({
        text: message.text,
        date: new Date(),
        user: user._id,
        room: message.room
      })
        .then(async(messageDB: IMessage) => {
          let message = await messageDB.populate({path: 'user', model: User}).execPopulate();
          return message;
        })
        .catch((error: Error) => {
          throw error;
        });    
  }
  else {
    return null;
  }
  
}

  
//===============================================
//                  EXPORTS
//===============================================
export default {
  CreateMessage
};