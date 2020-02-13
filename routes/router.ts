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
    
    const rooms = await Room.find({})
            .populate({ path: 'owner', model: User })
            .exec().then( (rooms: IRoom[]) => rooms )
                   .catch( err => {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                   })
    
    const room_id = await Room.findOne({ name: 'PRINCIPAL' })
             .then( (room: any) => room._id )
             .catch( err => {
                 return res.status(500).json({
                     ok: false,
                     err
                 })
             })

    Message.find({ room: room_id })
            .select('_id text date user')
            .sort({ date: 'asc' })
            .populate({path: 'user', model: User})
            .exec( (err, messages) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok:true,
                    rooms,
                    messages
                })
            })
})

// Get mensajes por RoomID
router.get('/messages/:room_id', async(req: Request, res: Response) => {

    Message.find({ room: req.params.room_id })
            .select('_id text date user')
            .sort({ date: 'asc' })
            .populate({path: 'user', model: User})
            .exec( (err, messages) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok:true,
                    messages
                })
            })
})




//===============================================
//                  PRUEBA
//===============================================
router.post('/messages',  async(req: Request, res: Response) => {
    
    const message = MessageController.CreateMessage({
        text: req.body.text,
        user: req.body.user,
        room: req.body.room
    })
    

    res.json({
        ok: true,
        message
    })

})


//===============================================
//                  EXPORTS
//===============================================
export default router;