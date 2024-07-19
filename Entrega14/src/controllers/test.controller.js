export default class TestsController {
    constructor() {

    }

    getSimpleTest = (req, res) =>{
        let sum = 0
        for (let i = 0; i < 5e6; i++) {
            sum += i
        }

        res.sendSuccess({restul: 'coso es ' + sum})
    }

    getLoggerTest = (req, res) => {
        req.logger.fatal('testing')
        req.logger.error('testing')
        req.logger.warning('testing')
        req.logger.info('testing')
        req.logger.http('testing')
        req.logger.debug('testing')

        res.render('errors/error', {type: 'error', error: 'this endpoint is for console development only ;D'})

    }

}