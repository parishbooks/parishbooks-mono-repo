import axios from 'axios';

const host = process.env.HOST ?? 'localhost';
const port = process.env.APP_SVC_PORT ?? process.env.PORT ?? '8000';
axios.defaults.baseURL = `http://${host}:${port}`;
