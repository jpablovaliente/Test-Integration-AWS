// Importa la lógica de tus APIs HTTP
const { insert_User } = require('./DB/Insert_User');
const { BulkLoad_User } = require('./DB/BulkLoad/BulkLoad_User');
const { Console } = require('console');

// Función principal que se ejecutará cuando la lambda se invoque
exports.handler = async (event, context) => {
    try {
        console.log("El evento que se recibe: ", event);
        let response;        
        if (event.requestContext.http.path === '/Insert_User') {
            const requestBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf-8') : event.body;
            console.log("El body del evento ", requestBody);
            response = await insert_User(requestBody);
        } else if (event.requestContext.http.path === '/BulkLoad_Users') {
            response = await BulkLoad_User();
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Ruta no encontrada entro al else' })
            };
        }
        return response;
    } catch (error) {
        console.error('Error en la función:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor, Excepcion controlada.' })
        };
    }
};
