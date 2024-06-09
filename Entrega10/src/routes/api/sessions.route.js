import UserManager from "../../dao/managers/users.manager.js";
import { createHash, isValidPassword } from "../../utils/bcrypt.js";
import passport from "passport";
import CustomRouter from "../router.js";
import { generateToken } from "../../utils/jsonwebtoken.js";

export default class ProductsRouter extends CustomRouter {

    init() {
        const userService = new UserManager()
        
        this.get('/github', ['PUBLIC'], passport.authenticate('github', {scope: 'user:email'}), async (req, res)=>{})
        
        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', {failureRedirect: '/failed'}), (req,res) =>{
            res.locals.user = req.user
            const token = generateToken({
                _id: req.user._id,
                first_name: req.user.first_name,
                email: req.user.email,
                rol: 'user'
            })
            res.cookie('token', token, { maxAge: 60*60*60*24, httpOnly: true }).redirect('/')
        })
        
        this.post('/register', ['PUBLIC'], async (req, res) => {
        
            const { first_name, last_name, email, age, password } = req.body
        
            if (!first_name || !last_name || !email || !age || !password) return res.sendUserError('All parameters required')
            const exist = await userService.getUserBy({email})
            if(exist) return res.sendUserError('User already exists')
            
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            const { result } = await userService.createUser(newUser)
            const token = generateToken({
                _id,
                first_name,
                last_name,
                email,
                age,
                cart: result.cart,
                rol: 'user'
            })
            res.cookie('token', token, { maxAge: 60*60*60*24, httpOnly: true }).redirect('/')
        })
        
        this.post('/login', ['PUBLIC'], async (req, res) => {
            const { email, password } = req.body
            if(!email || !password) return res.sendUserError('All parameters required')
            const validUser = await userService.getUserBy({email})
        
            if(!validUser) return res.sendUserError('User not found')
            if(!isValidPassword(password, validUser)) res.sendUserError('invalid password')
        
            const { _id, first_name, last_name,cart, age, rol } = validUser
            const token = generateToken({
                _id,
                first_name,
                last_name,
                email,
                age,
                cart,
                rol
            })
            res.cookie('token', token, { maxAge: 60*60*60*24, httpOnly: true }).redirect('/')
        })
        
        this.get('/logout', ['PUBLIC'], async (req, res) => {
            res.cookie('token', null, { expires: new Date(0) });
            res.redirect('/')
        })
        
        this.get('/current', ['USER', 'ADMIN'], async (req, res) => {
            let result = { }
            if(res.locals.user) {
                result.user = res.locals.user 
                const cart = await userService.getUserPopulate(res.locals.user._id)
                result.cart = cart
            }
            res.sendSuccess(result)
        })
    }

}