import User, { IUser } from "../models/user.model";

//===============================================
//                  INTERFACE
//===============================================
export interface IUserInput {
    email: IUser['email'],
    name: IUser['name'],
    picture: IUser['picture']
}

//===============================================
//                  FUNCTIONS
//===============================================
async function CreateUser (userInput: IUserInput){
  
  // Buscar usuario
  return new Promise( (resolve, reject) => {
      User.findOne({ email: userInput.email }, (err, userDB) => {
        if (err) reject(err);
        if (!userDB) {
          // No lo encuentró, crea uno
          let newUser = new User({
            email: userInput.email,
            name: userInput.name,
            picture: userInput.picture
          })
          newUser.save( (err, userDB) => {
            if (err) reject(err);
            resolve(userDB)
          })
        } else {
          //Lo encontró y se retorna
          resolve(userDB);
        }
      })
  }) 
}

//===============================================
//                  EXPORTS
//===============================================
export default {
 CreateUser
};