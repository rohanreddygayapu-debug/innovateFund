// PDF Processing Service
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PDF file paths
const PDF_FILES = [
  {
    name: 'Startup India Seed Fund Scheme',
    path: path.join(__dirname, '../../../assets/Guidelines_for_Startup_India_Seed_Fund_Scheme.pdf'),
  },
  {
    name: 'ECMS Guidelines',
    path: path.join(__dirname, '../../../assets/ECMS Guidelines_26.04.2025.pdf'),
  },
];

/**
 * Extract text from a PDF file
 */
async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error(`❌ Error extracting text from PDF: ${pdfPath}`, error.message);
    throw error;
  }
}

/**
 * Split text into chunks
 */
function splitTextIntoChunks(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

/**
 * Process all PDFs and return document chunks
 */
export async function processAllPDFs() {
  try {
    console.log('📄 Processing PDFs...');
    const documents = [];
    
    for (const pdf of PDF_FILES) {
      console.log(`  Processing: ${pdf.name}`);
      
      // Extract text from PDF
      const text = await extractTextFromPDF(pdf.path);
      console.log(`  ✅ Extracted ${text.length} characters from ${pdf.name}`);
      
      // Split into chunks
      const chunks = splitTextIntoChunks(text, 500, 50);
      console.log(`  ✅ Split into ${chunks.length} chunks`);
      
      // Add chunks to documents with metadata
      chunks.forEach((chunk, index) => {
        documents.push({
          content: chunk,
          metadata: {
            source: pdf.name,
            chunkIndex: index,
            totalChunks: chunks.length,
          },
        });
      });
    }
    
    console.log(`✅ Total documents processed: ${documents.length}`);
    return documents;
  } catch (error) {
    console.error('❌ Error processing PDFs:', error.message);
    throw error;
  }
}

/**
 * Get document by index
 */
export function getDocument(documents, index) {
  if (index >= 0 && index < documents.length) {
    return documents[index];
  }
  return null;
}
