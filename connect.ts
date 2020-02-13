import mongoose from 'mongoose';

type TInput = {
  db: string;
}
export default ({db}: TInput) => {
  
  const connect = () => {
    mongoose
      .connect(
        db,
        {   
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true 
        },
      )
      .then(() => {
        return console.info(`Base de datos ONLINE - ${db}`);
      })
      .catch(error => {
        console.error('Error al conectar con la base de datos: ', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};