const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const generateUserID = require('../../Crypto/UserIDGenerator');

// Función para cargar el archivo JSON desde S3
async function fetchJSONFromS3(bucketName, fileName) {
    const params = {
        Bucket: bucketName,
        Key: fileName
    };

    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString());
}

async function bulkInsertToDynamoDB(data) {
  const tableName = 'User';

  const putRequest = data.map(item => ({
    PutRequest: {
      Item: {
        User_ID: generateUserID(item.Names, item.Age),
        Names: item.Names,
        LastNames: item.LastNames,
        Age: item.Age,
        Gender: item.Gender,
        Address: item.Adress,
        Cellphone: item.Cellphone
      }
    }
  }));

  const batches = [];
  while (putRequest.length > 0) {
    batches.push(putRequest.splice(0,25));
  }

  for (const batch of batches) {
    const params = {
      RequestItems: {
        [tableName]: batch
      }
    };
    await dynamoDB.batchWrite(params).promise();
  }
}

// Función principal para la API HTTP
async function BulkLoad_User() {
    try {
        const bucketName = 'test-integration-aws-serv-serverlessdeploymentbuck-ggc59vuvdqxs';
        const fileName = 'BulkLoad/BulkLoad_User.json';

        // Carga el JSON desde S3 utilizando la función separada
        const jsonData = await fetchJSONFromS3(bucketName, fileName);

        await bulkInsertToDynamoDB(jsonData);


        // Retorna el JSON como respuesta HTTP
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Carga masiva de datos completada correctamente' })
        };
    } catch (error) {
        console.error('Error en la función BulkLoad_User:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor, Excepcion generada' })
        };
    }
}

module.exports = { BulkLoad_User };
