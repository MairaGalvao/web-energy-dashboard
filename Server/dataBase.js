const { Client } = require('pg');
const extractAndPrintRelevantData = require('./dataParser'); // Adjust the path accordingly
const path = require('path');
const fs = require('fs');

const client = new Client({
    user: 'mairagalvao',
    host: 'localhost',
    database: 'mairagalvao',
    password: 'peotanju',
    port: 5555,
});

async function main() {
    try {
        await client.connect();
        console.log("Connected!");

        const dataDirectory = path.join(__dirname, 'data');

        const files = fs.readdirSync(dataDirectory);
        const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

        for (const pdfFile of pdfFiles) {
            const pdfFilePath = path.join(dataDirectory, pdfFile);
            const extractedData = await extractAndPrintRelevantData(pdfFilePath);

            if (extractedData) {
                // Insert data into the PostgreSQL database table
                const query = `
                    INSERT INTO mairagalvao (no_do_cliente, mes_referencia, energia_quantidade, energia_valor)
                    VALUES ($1, $2, $3, $4)
                `;

                const values = [
                    extractedData["No DO CLIENTE"],
                    extractedData["Mês de referência"],
                    extractedData["Energia Elétrica (Quantidade)"],
                    extractedData["Energia Elétrica (Valor)"],
                ];

                try {
                    await client.query(query, values);
                    console.log(`Data from ${pdfFile} inserted into the mairagalvao table.`);
                } catch (error) {
                    console.error(`Error inserting data from ${pdfFile} into the mairagalvao table:`, error);
                }
            }
        }
    } catch (err) {
        console.error("Error connecting to the database:", err);
    } finally {
        await client.end();
        console.log("Connection closed.");
    }
}

main();
