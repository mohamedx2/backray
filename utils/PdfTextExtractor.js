const pdfjs = require('pdfjs-dist/build/pdf');

async function extractTextFromPdf(src){
    const doc = await pdfjs.getDocument(src).promise
    const numPages = doc.numPages
    let text = ''
    for(let i = 1; i <= numPages; i++) {
        const page = await doc.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(item => item.str).join('\n')
    }
    return text
}

module.exports ={
    extractTextFromPdf
}