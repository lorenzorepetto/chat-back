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
async function CreateMessage (message: ICreateMessageInput){
  
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

  

async function DeleteMessage (message_id: IMessage['_id']) {
  return new Promise( (resolve, reject) => {
    Message.findByIdAndRemove(message_id, (err, deletedMessage) => {
      if (err) throw err;
      console.log('Se borro: ', deletedMessage);
      resolve( deletedMessage)
    })
  }) 
}


async function GetMessagesInRoom( room_id:string ) {
  return new Promise( (resolve, reject) => {
    Message.find({ room: room_id })
              .select('_id text date user')
              .sort({ date: -1 })
              .limit(12)
              .populate({path: 'user', model: User})
              .exec( (err, messagesDB) => {
                  if (err) throw err;
                  messagesDB = messagesDB.reverse();
                  resolve(messagesDB);
              })
  })
}



//===============================================
//                  EXPORTS
//===============================================
export default {
  CreateMessage,
  DeleteMessage,
  GetMessagesInRoom
};