import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UserList } from '../classes/user-list';
import { UserSocket, UserSocketInput, validStates } from '../classes/user-socket';
import MessageController, { ICreateMessageInput } from '../controllers/message.controller';
import UserController from '../controllers/user.controller';

// Lista
export const users: UserList = new UserList();

//===============================================
//                  OPERACIONES
//===============================================

//===============================================
//                  USUARIOS
//===============================================

// Conectar
export const connect = ( client: Socket ) => {
    const user = new UserSocket(client.id);
    users.add(user);
}

// Desconectar
export const disconnect = ( client: Socket, io: socketIO.Server ) => {
    client.on('disconnect', () => {
        const user = users.deleteUser(client.id);
        
        if(user) {
            io.to(user.room_id).emit('active-users', users.getUsersInRoom(user.room_id));
        }
        
        
    })
}


// Configurar usuario
export const setUser = ( client: Socket, io: socketIO.Server ) => {

    client.on('set-user', (payload: UserSocketInput) => {
        
        // Setear usuario
        users.setUser(client.id, payload);
        // Crearlo en la db
        UserController.CreateUser(payload)
            .then( () => {
                // unirse a la sala
                client.join(payload.room_id);
                io.to(payload.room_id).emit('active-users', users.getUsersInRoom(payload.room_id));
            })
            .catch( err => {
                console.log(err);
                io.to(client.id).emit('set-user-callback', {error: err})
            })        
    })
}

// Cambiar estado
export const setStatus = ( client: Socket, io: socketIO.Server ) => {

    client.on('set-status', (payload: {status: validStates, room_id: string}) => {
        
        users.setStatus(client.id, payload.status);
        // unirse a la sala
        client.join(payload.room_id);

        io.to(payload.room_id).emit('active-users', users.getUsersInRoom(payload.room_id));
        
    })
}
 

// Cambiar de sala
export const changeRoom = ( client: Socket, io: socketIO.Server ) => {

    client.on('change-room', (payload: { room_id: string }) => {
        
        let user = users.getUser( client.id );
        if( !user ) return;
        
        // Dejar sala anterior
        client.leave(user.room_id);
        
        // Setear sala
        let old_room = user.room_id;
        users.setRoom(client.id, payload.room_id);
        
        // Unirse a nueva sala
        client.join(payload.room_id);
        
        io.to(old_room).emit('active-users', users.getUsersInRoom(old_room));
        io.to(payload.room_id).emit('active-users', users.getUsersInRoom(payload.room_id));

    })

}

//===============================================
//                  MENSAJES
//===============================================
// Escuchar mensajes
export const message = ( client: Socket, io: socketIO.Server ) => {
    
    client.on('message', (payload: ICreateMessageInput) => {
        
        // unirse a la sala
        client.join(payload.room);
        
        // Guardar mensaje en BD
        MessageController.CreateMessage(payload)
            .then( () => {
                MessageController.GetMessagesInRoom(payload.room)
                    .then( (messages) => {
                        io.to(payload.room).emit('update-messages', messages);
                    })
            })
    })
}


// Eliminar mensaje
export const deleteMessage = ( client: Socket, io: socketIO.Server ) => {
    
    client.on('delete-message', async(payload: { message_id: string, room_id: string}) => {
        
        // unirse a la sala
        client.join(payload.room_id);
        // Eliminar mensaje en BD
        MessageController.DeleteMessage(payload.message_id)
            .then( () => {
                MessageController.GetMessagesInRoom(payload.room_id)
                    .then( (messages) => {
                        io.to(payload.room_id).emit('update-messages', messages);
                    })
            })
    })
}

// Eliminar todos los mensajes en sala
export const deleteAllMessages = ( client: Socket, io: socketIO.Server ) => {
    
    client.on('delete-all-messages', async(payload: { email: string, room_id: string}) => {
        
        // unirse a la sala
        client.join(payload.room_id);
        // Eliminar mensaje en BD
        MessageController.DeleteAllMessagesInRoomBy(payload.email, payload.room_id)
            .then( () => {
                MessageController.GetMessagesInRoom(payload.room_id)
                    .then( (messages) => {
                        io.to(payload.room_id).emit('update-messages', messages);
                    })
            })
    })
}

