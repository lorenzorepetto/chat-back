import { UserSocket, NO_NAME, UserSocketInput, validStates } from './user-socket';


export class UserList {
    
    private list: UserSocket[] = [];

    constructor() { }
    
    //===============================================
    //                  SET
    //===============================================
    public add( user: UserSocket ) {
        this.list.push(user);
        console.log('Agregando usuario');
        console.log(this.list);
        return user;
    }

    public setUser( id: string, user: UserSocketInput ) {
        for (let u of this.list) {
            if( u.id === id ) {
                u.email = user.email;
                u.picture = user.picture;
                u.name = user.name;
                u.room_id = user.room_id;
                break;
            }   
        }
        console.log('Actualizando usuario');
        console.log(this.list);
    }

    public setStatus( id: string, status: validStates ) {
        const user = this.getUser(id);
        if (user) {
            user.status = status;
        }
    }


    public setRoom( id: string, room_id: string) {
        for (let u of this.list) {
            if( u.id === id ) {
                u.room_id = room_id;
                break;
            }   
        }
    }

    //===============================================
    //                  GET
    //===============================================
    public getList() {
        return this.list.filter( user => user.name !== NO_NAME );
    }

    public getUser( id: string ) {
        return this.list.find( user => user.id === id );
    }
    
    public getUsersInRoom( room_id: string ) {
        return this.list.filter( user => user.room_id === room_id);
    }
    
    //===============================================
    //                  DELETE
    //===============================================
    public deleteUser( id: string ) {
        const tempUser = this.getUser(id);
        this.list = this.list.filter( user => user.id !== id );
        console.log(this.list);
        return tempUser;
    }
    

}