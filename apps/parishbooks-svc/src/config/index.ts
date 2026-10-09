import appConfig from './app';
import databaseConfig from './database';
import iamConfig from './iam';
import smtpConfig from './smtp';
import throttleConfig from './throttle';

export const config = [appConfig, iamConfig, databaseConfig, smtpConfig, throttleConfig];
