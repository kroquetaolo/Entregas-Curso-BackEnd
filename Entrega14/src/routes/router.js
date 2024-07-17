import { Router } from 'express'
import passport from 'passport'

export default class CustomRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }
    authenticateUser = (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (user) {
                req.user = user.user;
                res.locals.user = user.user;
            }
            next();
        })(req, res, next);
    };

    setRequestUrls = (req, res, next) => {
        res.locals.url = req.get('host');
        res.locals.current_url = req.originalUrl.split('?')[0];;
        next()
    }

    handlePolicies(policies) {
        return (req, res, next) => {
            if(policies[0] === 'PUBLIC') return next();
            if(!req.user) return res.render('errors/error', {type: 'error', error: 'Not authorized'})
            if(!policies.includes(req.user.rol.toUpperCase())) return res.render('errors/error', {type: 'error', error: 'No permission'})
            next()
        }
    }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                const error_message = error.cause || error;
                params[1].render('errors/error', { type: 'error', error: error_message });
            }
        })
    }

    customResponse(req, res, next) {
        res.sendSuccess = payload => res.send({status: 'success', payload})
        res.sendServerError = error => res.status(500).send({status: 'error', error})
        res.sendUserError = error => res.status(400).send({status: 'error', error})
        next()
    } 

    get(path, policies, ...callbacks) {
        this.router.get(path,this.setRequestUrls, this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }
    post(path, policies, ...callbacks) {
        this.router.post(path,this.setRequestUrls, this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }
    put(path, policies, ...callbacks) {
        this.router.put(path,this.setRequestUrls, this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }
    delete(path, policies, ...callbacks) {
        this.router.delete(path,this.setRequestUrls, this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }

    init() {}

}