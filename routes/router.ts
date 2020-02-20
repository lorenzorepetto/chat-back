import { Router, Request, Response } from 'express';
import Room from '../models/room.model';
import MessageController from '../controllers/message.controller';
import User from '../models/user.model';
import Server from '../classes/server';


const router: Router = Router();
const server = Server.instance;

//===============================================
//                  ROUTES
//===============================================


//===============================================
//                  GET
//===============================================
router.get('/data', async(req: Request, res: Response) => {
    
    const currentRoom = await Room.findOne({ name: 'PRINCIPAL' })
             .then( (room: any) => room )
             .catch( err => {
                 throw err;
             })

    if (!currentRoom) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No existe sala con ese ID'
            }
        })
    }

    MessageController.GetMessagesInRoom( currentRoom._id )
        .then( messages => {
            return res.json({
                ok:true,
                currentRoom,
                messages
            })
        })
        .catch( err => res.status(500).json({
            ok: false,
            err
        }))
})


router.get('/room', (req: Request, res: Response) => {
    
    Room.find({})
        .populate({ path: 'owner', model: User })
        .exec( (err, rooms) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                rooms
            })
        })
})


router.get('/room/:room_id', async(req: Request, res: Response) => {
    
    const currentRoom = await Room.findById(req.params.room_id)
             .populate({ path: 'owner', model: User })
             .then( (room: any) => room )
             .catch( err => {
                  throw err;
             })

    if (!currentRoom) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No existe sala con ese ID'
            }
        })
    }

    MessageController.GetMessagesInRoom( currentRoom._id )
        .then( messages => {
            return res.json({
                ok:true,
                currentRoom,
                messages
            })
        })
        .catch( err => res.status(500).json({
            ok: false,
            err
        }))
})


router.get('/room/:room_id/all', async(req: Request, res: Response) => {
    
    const currentRoom = await Room.findById(req.params.room_id)
             .then( (room: any) => room )
             .catch( err => {
                  throw err;
             })

    if (!currentRoom) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No existe sala con ese ID'
            }
        })
    }

    MessageController.GetAllMessagesInRoom( currentRoom._id )
        .then( messages => {
            return res.json({
                ok:true,
                messages
            })
        })
        .catch( err => res.status(500).json({
            ok: false,
            err
        }))
})

//===============================================
//                  POST
//===============================================
router.post('/room', async(req: Request, res: Response) => {
    let body =req.body;
    
    const user = await User.findOne({email: body.email})
                    .then( user => user)
                   
    if (!user) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No existe usuario con ese email'
            }
        }) 
    }

    const newRoom = new Room({
        name: body.name,
        description: body.description,
        owner: user._id
    })
    
    newRoom.save( (err, room) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }    
        res.json({
            ok: true,
            room  
        })
        
        Room.find({})
        .populate({ path: 'owner', model: User })
        .exec( (err, rooms) => {
            if (err) throw err
            server.io.emit('update-rooms', {rooms});
        })
    })
    
    
})


//===============================================
//                  DELETE
//===============================================
router.delete('/room/:room_id', (req: Request, res: Response) => {

    Room.findById(req.params.room_id, (err, room) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!room) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe sala con ese ID'
                }
            })
        }

        room.remove( (err, room) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok:true,
                room
            })
            Room.find({})
                .populate({ path: 'owner', model: User })
                .exec( (err, rooms) => {
                if (err) throw err
                server.io.emit('update-rooms', {rooms});
            })
        });
        
    })

})




//===============================================
//                  EXPORTS
//===============================================
export default router;