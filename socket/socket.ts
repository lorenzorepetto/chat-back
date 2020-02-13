import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UserList } from '../classes/user-list';
import { UserSocket } from '../classes/user-socket';

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
    client.on('disconnect', ( room_id: string ) => {
        console.log('Cliente desconectado');
        
        users.deleteUser(client.id);
        
        io.to(room_id).emit('active-users', users.getUsersInRoom(room_id));
    })
}

// Configurar usuario
export const setUser = ( client: Socket, io: socketIO.Server ) => {

    client.on('set-user', (payload: UserSocket, callback: Function) => {
        
        users.setUser(payload);
        io.to(payload.room_id).emit('active-users', users.getUsersInRoom(payload.room_id));
        
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.name } configurado`
        })
    })
}

// Obtener usuarios
export const getUserList = ( client: Socket, io: socketIO.Server ) => {
    
    client.on('get-users', (room_id: string) => {
        io.to(client.id).emit('active-users', users.getUsersInRoom(room_id))
    })

}


//===============================================
//                  MENSAJES
//===============================================
// Escuchar mensajes
export const message = ( client: Socket, io: socketIO.Server ) => {
    
    client.on('mensaje', (payload: { to: string, body: string }) => {
        console.log('Mensaje recibido: ', payload);
        
        io.emit('mensaje-nuevo', payload);
    })
}

