import { usersService } from "../service/index.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js"
import { generateToken } from "../utils/jsonwebtoken.js"

class SessionsController {
    #userService
    constructor() {
        this.#userService = usersService
    }

    getGitHubCallback = (req,res) =>{
        res.locals.user = req.user
        const token = generateToken({
            _id: req.user._id,
            first_name: req.user.first_name,
            email: req.user.email,
            rol: 'user'
        })
        res.cookie('token', token, { maxAge: 60*60*60*24, httpOnly: true }).redirect('/')
    }

    getRegister = async (req, res) => {
        
        const { first_name, last_name, email, age, password } = req.body
    
        if (!first_name || !last_name || !email || !age || !password) return res.sendUserError('All parameters required')
        const exist = await this.#userService.getUserBy({email})
        if(exist) return res.sendUserError('User already exists')
        
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }

        const { result } = await this.#userService.createUser(newUser)
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
    }

    getLogin = async (req, res) => {
        const { email, password } = req.body
        if(!email || !password) return res.render('error', {error: 'All parameters required', type: 'Login'})
        const validUser = await this.#userService.getUserBy({email})
    
        if(!validUser) return res.render('error', {error: 'User not found', type: 'Login'})
        if(!isValidPassword(password, validUser)) res.render('error', {error: 'Invalid password', type: 'Login'})
    
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
    }

    getLogout = async (req, res) => {
        res.cookie('token', null, { expires: new Date(0) });
        res.redirect('/')
    }

    getCurrent = async (req, res) => {
        let result = { }
        if(res.locals.user) {
            result.user = res.locals.user 
            const cart = await this.#userService.getUserPopulate(res.locals.user._id)
            result.cart = cart
        }
        res.sendSuccess(result)
    }

}

export default SessionsController