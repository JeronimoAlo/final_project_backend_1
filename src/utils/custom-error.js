export class CustomError extends Error {
    constructor(message, status) {
        super(message); // Llama al constructor de la clase padre (Error) para establecer el mensaje de error.
        this.status = status; // Agrega una propiedad 'status' para almacenar el código de estado HTTP.
    }
}
