import Message from "../models/message.model";
import User, { IUser } from "../models/user.model";
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
      if (err) reject(err);
      resolve( deletedMessage)
    })
  }) 
}


async function DeleteAllMessagesInRoomBy (email: IUser['email'], room_id: IMessage['room']) {
  return new Promise( (resolve, reject) => {
    Message.deleteMany({ room: room_id }, (err) => {
      if (err) reject(err);
      resolve();
    })
  }) 
}



async function GetMessagesInRoom( room_id:string ) {
  return new Promise( (resolve, reject) => {
    Message.find({ room: room_id })
              .select('_id text date user')
              .sort({ date: -1 })
              .limit(8)
              .populate({path: 'user', model: User})
              .exec( (err, messages) => {
                  if (err) reject(err);
                  messages = messages.reverse();
                  Message.countDocuments({room: room_id}, (err, total) => {
                    if (err) reject(err);
                    resolve({messages, total});
                  })
              })
  })
}


async function GetAllMessagesInRoom( room_id:string ) {
  return new Promise( (resolve, reject) => {
    Message.find({ room: room_id })
              .select('_id text date user')
              .sort({ date: -1 })
              .populate({path: 'user', model: User})
              .exec( (err, messages) => {
                  if (err) reject(err);
                  messages = messages.reverse();
                  resolve(messages)
              })
  })
}





//===============================================
//                  EXPORTS
//===============================================
export default {
  CreateMessage,
  DeleteMessage,
  GetMessagesInRoom,
  GetAllMessagesInRoom,
  DeleteAllMessagesInRoomBy
};