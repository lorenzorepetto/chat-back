import { Router, Request, Response } from 'express';
import Message from '../models/message.model';
import Room, { IRoom } from '../models/room.model';
import MessageController from '../controllers/message.controller';
import User from '../models/user.model';


const router: Router = Router();


//===============================================
//                  ROUTES
//===============================================

// Get Sala Principal y Salas
router.get('/data', async(req: Request, res: Response) => {
    
    const currentRoom = await Room.findOne({ name: 'PRINCIPAL' })
             .then( (room: any) => room )
             .catch( err => {
                 return res.status(500).json({
                     ok: false,
                     err
                 })
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


// Rooms
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
    })
})


router.delete('/room/:room_id', (req: Request, res: Response) => {

    Message.deleteMany({ room: req.params.room_id }, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
    })

    Room.findByIdAndRemove(req.params.room_id, (err, room) => {
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
    })

})


// Get mensajes por RoomID
router.get('/room/:room_id', async(req: Request, res: Response) => {
    
    const currentRoom = await Room.findById(req.params.room_id)
             .then( (room: any) => room )
             .catch( err => {
                 return res.status(500).json({
                     ok: false,
                     err
                 })
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



//===============================================
//                  EXPORTS
//===============================================
export default router;