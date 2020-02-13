import { UserSocket, NO_NAME } from './user-socket';


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

    public setUser( user: UserSocket ) {
        for (let u of this.list) {
            if( u.id === user.id ) {
                u.image = user.image;
                u.name = user.name;
                u.room_id = user.room_id;
                break;
            }   
        }
        console.log('Actualizando usuario');
        console.log(this.list);
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