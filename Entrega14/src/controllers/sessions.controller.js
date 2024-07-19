import { CustomError } from "../service/errors/custom.error.js"
import { EError } from "../service/errors/enums.js"
import { generateUserError } from "../service/errors/info.js"
import { usersService } from "../service/index.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js"
import { generateToken } from "../utils/jsonwebtoken.js"

class SessionsController {
    #userService
    constructor() {
        this.#userService = usersService
    }

    getGitHubCallback = async (req,res) =>{
        res.locals.user = req.user
        const token = generateToken({
            _id: req.user._id,
            first_name: req.user.first_name,
            email: req.user.email,
            cart: req.user.cart,
            rol: 'user'
        })
        res.cookie('token', token, { maxAge: 60*60*60*24, httpOnly: true }).redirect('/')
    }

    getRegister = async (req, res) => {
        
        const { first_name, last_name, email, age, password } = req.body
    
        if (!first_name || !last_name || !email || !age || !password) {
            CustomError.createError({
                name: 'Registration Failure',
                cause:  generateUserError( {first_name, last_name, email, age, password}),
                message: 'Error registering the user',
                code: EError.INVALID_TYPE_ERROR
            })
        }
        const exist = await this.#userService.getUserBy({email})
        if(exist) {
            CustomError.createError({
                name: 'Registration Failure',
                cause:  'User already exists',
                message: 'Error registering the user',
                code: EError.USER_ALREADY_EXIST_ERROR
            })
        }
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }

        const { result } = await this.#userService.createUser(newUser)
        const token = generateToken({
            _id: result._id,
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
        if(!email || !password) return res.render('errors/error', {error: 'All parameters required', type: 'Login'})
        const validUser = await this.#userService.getUserBy({email})
    
        if(!validUser) return res.render('errors/error', {error: 'User not found', type: 'Login'})
        if(!isValidPassword(password, validUser)) return res.render('errors/error', {error: 'Invalid password', type: 'Login'})
    
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
            result.cart = cart[0].cart
        }
        res.sendSuccess(result)
    }

}

export default SessionsController