export type validStates = 'ONLINE' | 'BUSY';
export const NO_NAME = 'No name';
export const NO_ROOM = 'No room';
export const NO_IMAGE = 'No image';
export const NO_EMAIL = 'No email';

export class UserSocket {
    
    public id: string;
    public email: string;
    public name: string;
    public picture: string;
    public room_id: string;
    public status: validStates;

    constructor( id: string ) {
        this.id = id;
        this.email = NO_EMAIL;
        this.name = NO_NAME;
        this.room_id = NO_ROOM;
        this.picture = NO_IMAGE;
        this.status = 'ONLINE';
    }
}


export interface UserSocketInput {
    name: string;
    email: string;
    picture: string;
    room_id: string;
}