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

    handlePolicies(policies) {
        return (req, res, next) => {
            if(policies[0] === 'PUBLIC') return next();
            if(!req.user) return res.status(400).send({status: 'error', error: 'Not authorized'});
            if(!policies.includes(req.user.rol.toUpperCase())) return res.status(400).send({status: 'error', error: 'No permission'});
            next()
        }
    }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                params[1].status(500).send({ status: 'error', error})
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
        this.router.get(path,this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }
    post(path, policies, ...callbacks) {
        this.router.post(path,this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }
    put(path, policies, ...callbacks) {
        this.router.put(path,this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }
    delete(path, policies, ...callbacks) {
        this.router.delete(path,this.authenticateUser, this.handlePolicies(policies), this.customResponse, this.applyCallbacks(callbacks))
    }

    init() {}

}