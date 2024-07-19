import winston from 'winston';
import config from '../config/config.js';

const { mode } = config

const custom_levels_options = {
    levels: { fatal: 0    , error: 1,        warning: 2,        info: 3,      http: 4,       debug: 5 },
    colors: { fatal: "bold red", error: "red", warning: "yellow", info: "blue", http: "white", debug: "gray" }
}

const date = new Date();
const formatted_time = date.toLocaleTimeString('es-ES', { hour12: false });

export const http_log_message = req => `[${formatted_time}] ${req.method} en ${req.url}`

export const logger = winston.createLogger({
    levels: custom_levels_options.levels,
    transports: [
        new winston.transports.Console({
            level: mode === 'development' ? 'debug' : 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: custom_levels_options.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './logs/errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    
    ]
})