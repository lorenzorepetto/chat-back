export type validStates = 'ONLINE' | 'BUSY';
export const NO_NAME = 'No name';
export const NO_ROOM = 'No room';
export const NO_IMAGE = 'No image';

export class UserSocket {
    
    public id: string;
    public name: string;
    public picture: string;
    public room_id: string;
    public status: validStates;

    constructor( id: string ) {
        this.id = id;
        this.name = NO_NAME;
        this.room_id = NO_ROOM;
        this.picture = NO_IMAGE;
        this.status = 'ONLINE';
    }
}


export interface UserSocketInput {
    name: string;
    picture: string;
    room_id: string;
}