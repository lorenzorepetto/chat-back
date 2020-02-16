import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UserList } from '../classes/user-list';
import { UserSocket, UserSocketInput, validStates } from '../classes/user-socket';
import MessageController, { ICreateMessageInput } from '../controllers/message.controller';

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
        console.log('Cliente desconectado');
        
        const user = users.deleteUser(client.id);
        
        if(user) {
            io.to(user.room_id).emit('active-users', users.getUsersInRoom(user.room_id));
            console.log(users.getUsersInRoom(user.room_id));
        }
        
        
    })
}


// Configurar usuario
export const setUser = ( client: Socket, io: socketIO.Server ) => {

    client.on('set-user', (payload: UserSocketInput) => {
        
        users.setUser(client.id, payload);
        // unirse a la sala
        client.join(payload.room_id);

        io.to(payload.room_id).emit('active-users', users.getUsersInRoom(payload.room_id));
        
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
 


// Obtener usuarios
export const getUserList = ( client: Socket, io: socketIO.Server ) => {
    
    client.on('get-users', (room_id: string) => {
        // unirse a la sala
        client.join(room_id);
        io.to(room_id).emit('active-users', users.getUsersInRoom(room_id))
    })

}


//===============================================
//                  MENSAJES
//===============================================
// Escuchar mensajes
export const message = ( client: Socket, io: socketIO.Server ) => {
    
    client.on('message', (payload: ICreateMessageInput) => {
        console.log('Mensaje recibido: ', payload);
        
        // unirse a la sala
        client.join(payload.room);
        
        // Guardar mensaje en BD
        const promiseMessage = MessageController.CreateMessage(payload);
        promiseMessage.then( message => {
            io.to(payload.room).emit('new-message', message);
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
            .then( (message) => {
                io.to(payload.room_id).emit('update-messages', message);
            })
    })
}

