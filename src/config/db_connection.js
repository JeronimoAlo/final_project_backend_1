import { connect } from 'mongoose';

export const initMongoDB = async () => {
    try {
        // Nos conectamos a la base de datos MongoDB utilizando la URL de conexión.
        await connect(process.env.MONGO_URL);
    } catch (error) {
        throw new Error(`Error al conectar a MongoDB: ${error.message}`);
    }
};
