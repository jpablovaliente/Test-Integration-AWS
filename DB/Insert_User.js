const generateUserID = require('../Crypto/UserIDGenerator');
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function insert_User(requestBody) {
    try {
        // Verificar si el evento tiene un cuerpo
        if (requestBody) {
          // Parsear el cuerpo del evento JSON
          const eventData = JSON.parse(requestBody);
          // Imprimir el contenido del evento JSON
          console.log("Contenido del evento JSON:", eventData);
    
          const User_ID = generateUserID(eventData.Names, eventData.Age)
    
          const dynamoDBData = {
            TableName: 'User',
            Item: {
              "User_ID": User_ID,
              "Names": eventData.Names,
              "LastNames": eventData.LastNames,
              "Age": parseInt(eventData.Age),
              "Gender": eventData.Gender,
              "Adress": eventData.Adress,
              "Cellphone": parseInt(eventData.Cellphone)
            }
          };
    
          await dynamoDB.put(dynamoDBData).promise();
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Datos Insertados exitosamente' })
          }
    
        } else {
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'The event body does not contain information.' })
          }
        }
    
      } catch (error) {
        console.error('Error en la función:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error interno del servidor excepcion controlada' })
        };
      }
}

module.exports = { insert_User };