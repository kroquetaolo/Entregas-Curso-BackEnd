import e, { Router } from "express";
import UserManager from "../../dao/managers/users.manager.js";

const router = Router()
const userService = new UserManager()

router.post('/register', async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body

    if (!first_name || !last_name || !email || !age || !password) return res.status(401).send({status: 'error', error: 'All parameters required'})
    const exist = await userService.getUserBy({email})
    // console.log(exist);
    if(exist) return res.status(401).send({status: 'error', erro: 'User already exists'})
    
    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password
    }
    const result = await userService.createUser(newUser)
    res.status(200).send({status: 'success', payload: result.message})
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) return res.status(401).send({status: 'error', error: 'All parameters required'})
    const validUser = await userService.getUserBy({email, password})

    if(!validUser) return res.status(401).send({status: 'error', error: 'The email or password is incorrect'})
    const { first_name, last_name, age, rol} = validUser
    req.session.user = {
        first_name,
        last_name,
        email,
        age,
        rol,
        isAdmin: rol === 'admin'
    }
    res.redirect('/')
})

router.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(err) {
            return res.send({status: 'error', error: err})
        }
        return res.redirect('/')
    }) 
}) 
export default router