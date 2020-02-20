
//===============================================
//                  PORT
//===============================================
export const SERVER_PORT: number = Number(process.env.PORT) || 5000;


//===============================================
//                ENVIRONMENT
//===============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===============================================
//                BASE DE DATOS
//===============================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27018/chat'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
