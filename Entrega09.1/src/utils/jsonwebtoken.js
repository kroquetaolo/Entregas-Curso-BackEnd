import jwt from 'jsonwebtoken';

export const PRIVATE_KEY = 'SuperDuperSecretKey';

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'})
    return token
}