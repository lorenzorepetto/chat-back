import { Router, Request, Response } from 'express';
import User, { IUser } from '../models/user.model';

const router: Router = Router();


//===============================================
//                  ROUTES
//===============================================
//===============================================
//                  USER
//===============================================

router.post('/login', (req: Request, res: Response) => {
    
    const email = req.body.email;
    const name = req.body.name;
      
    User.find( { email }, (err, userDB: IUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (userDB) {
            return res.status(400).json({
                ok: true,
                userDB
            }) 
        }
    })

    // Crear usuario
    const user = new User({ email, name });
    user.save( (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })  
        }
        return res.json({
            ok: true,
            userDB
        })
    })
});





router.get('/mensajes', (req: Request, res: Response) => {
    
    res.json({
        ok:true,
        mensaje:'hola'
    })

})


router.post('/mensajes/:id', (req: Request, res: Response) => {
    
    const id = req.params.id;
    const body = req.body.body;

    res.json({
        ok:true,
        body,
        id
    })

})


//===============================================
//                  EXPORTS
//===============================================
export default router;