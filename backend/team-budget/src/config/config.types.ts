import { AppConfig } from './app.config';
import * as Joi from 'joi';

export interface ConfigType {
    app: AppConfig;
}

export const appConfigSchema = Joi.object({
    APP_MESSAGE_PREFIX: Joi.string().default('Hello du penner'),
    DB_HOST: Joi.string().default('127.0.0.1'),
    DB_PORT: Joi.number().default(5433),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_SYNC: Joi.number().required(),
});
