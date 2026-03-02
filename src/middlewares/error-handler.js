/**
 * Middleware para manejar errores en la aplicación.
 * Este middleware captura cualquier error que ocurra en las rutas o en otros middlewares,
 * y envía una respuesta JSON con el mensaje de error y el código de estado HTTP correspondiente.
 */

export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500; // Puede no llegar un status, por eso se asigna 500 por defecto
    res.status(status).json({ message: err.message });
};