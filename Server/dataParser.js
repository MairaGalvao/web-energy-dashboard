const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf-parse');

async function extractAndPrintRelevantData(pdfPath) {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await PDFParser(dataBuffer);
        const textContent = pdfData.text;
        const keywords = [
            "Nº DO CLIENTE",
            "Referente a:",
            "Energia Elétrica",
            "Energia SCEEE s/ ICMS",
            "Energia Compensada GD I",
            "Contrib Ilum Publica Municipal",
        ];

        const extractedData = {};
        for (const keyword of keywords) {
            const startIndex = textContent.indexOf(keyword);
            if (startIndex !== -1) {
                const endIndex = textContent.indexOf("\n", startIndex);
                const value = textContent.substring(startIndex + keyword.length, endIndex).trim();
                extractedData[keyword] = value;
            }
        }
        console.table([
            {
                "No DO CLIENTE": extractedData["Nº DO CLIENTE"],
                "Mês de referência": extractedData["Referente a:"],
                "Energia Elétrica (Quantidade)": extractedData["Energia Elétrica"],
                "Energia Elétrica (Valor)": "",  // Placeholder for the next line
            },
        ]);
        console.log('\n');

    } catch (error) {
        console.error(`Error extracting and printing data from ${pdfPath}:`, error);
    }
}

const dataDirectory = path.join(__dirname, 'data');

const files = fs.readdirSync(dataDirectory);
const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
pdfFiles.forEach(pdfFile => {
    const pdfFilePath = path.join(dataDirectory, pdfFile);
    extractAndPrintRelevantData(pdfFilePath);
});
module.exports = extractAndPrintRelevantData;
