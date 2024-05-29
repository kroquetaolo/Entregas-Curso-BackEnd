import passport from 'passport';
import UserManager from '../dao/managers/users.manager.js'
import GithubStrategy from 'passport-github2'

const userService = new UserManager();

export const initializePassport = () => {

    passport.use('github', new GithubStrategy({
        clientID: 'Iv23liRCZy4Da3YUcecb',
        clientSecret: 'e336e9c85f6eb890015841ffd35a4b76c750d80b',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userService.getUserBy({email: profile._json.email});
            if(!user) {
                const newUser = {
                    first_name: profile._json.login,
                    email: profile._json.email
                }
                const result = await userService.createUser(newUser);
                done(null, result.result);
            } else {
                done(null, user);
            }
        } catch (error) {
            console.log('error: ' + error.message);
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.getUserBy({_id: id});
            done(null, user)
        } catch (error) {
            done(error)
        }
    })

}