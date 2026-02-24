// Vector Store Service using FAISS and Xenova Transformers (local embeddings)
import { pipeline } from '@xenova/transformers';
import faiss from "faiss-node";

const { IndexFlatL2 } = faiss;
import { processAllPDFs } from './pdfService.js';

// In-memory storage for documents and vector store
let documents = [];
let vectorStore = null;
let isInitialized = false;
let embeddingPipeline = null;

/**
 * Initialize the embedding pipeline (lazy loading)
 */
async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    console.log('🔄 Loading embedding model (first time may take a moment)...');
    // Use a lightweight embedding model that runs locally
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('✅ Embedding model loaded');
  }
  return embeddingPipeline;
}

/**
 * Generate embeddings using local transformer model
 */
async function generateEmbedding(text) {
  try {
    const extractor = await getEmbeddingPipeline();
    
    // Generate embeddings
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    
    // Convert to array
    return Array.from(output.data);
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    throw error;
  }
}

/**
 * Initialize vector store with documents
 */
export async function initializeVectorStore() {
  try {
    if (isInitialized) {
      console.log('ℹ️  Vector store already initialized');
      return { success: true, message: 'Vector store already initialized' };
    }
    
    console.log('🚀 Initializing vector store...');
    
    // Process PDFs to get documents
    documents = await processAllPDFs();
    console.log(`📄 Loaded ${documents.length} document chunks`);
    
    // Generate embeddings for all documents
    console.log('🔢 Generating embeddings...');
    const embeddings = [];
    
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      console.log(`  Embedding ${i + 1}/${documents.length}: ${doc.metadata.source}`);
      
      const embedding = await generateEmbedding(doc.content);
      embeddings.push(embedding);
      
      // Small delay to avoid rate limiting
      if (i < documents.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('✅ All embeddings generated');
    
    // Create FAISS index
    const dimension = embeddings[0].length;
    console.log(`📊 Creating FAISS index with dimension ${dimension}`);
    vectorStore = new IndexFlatL2(dimension);
    
    // Add embeddings to index
    for (const embedding of embeddings) {
      vectorStore.add(embedding);
    }
    
    console.log('✅ Vector store initialized successfully');
    isInitialized = true;
    
    return {
      success: true,
      message: 'Vector store initialized',
      documentsCount: documents.length,
      dimension: dimension,
    };
  } catch (error) {
    console.error('❌ Error initializing vector store:', error.message);
    throw error;
  }
}

/**
 * Calculate relevance score from distance
 * Uses inverse distance formula: score = 1 / (1 + distance)
 * This converts L2 distance to a 0-1 similarity score
 * where 0 = completely different, 1 = identical
 */
function calculateRelevanceScore(distance) {
  return 1 / (1 + distance);
}

/**
 * Search for similar documents
 */
export async function searchDocuments(query, topK = 5) {
  try {
    if (!isInitialized || !vectorStore) {
      throw new Error('Vector store not initialized. Please initialize first.');
    }
    
    console.log(`🔍 Searching for: "${query}"`);
    
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    
    // Search in FAISS
    const results = vectorStore.search(queryEmbedding, topK);
    
    // Get document details
    const searchResults = results.labels.map((label, index) => {
      const doc = documents[label];
      return {
        content: doc.content,
        metadata: doc.metadata,
        distance: results.distances[index],
        relevanceScore: calculateRelevanceScore(results.distances[index]),
      };
    });
    
    console.log(`✅ Found ${searchResults.length} relevant documents`);
    
    return searchResults;
  } catch (error) {
    console.error('❌ Error searching documents:', error.message);
    throw error;
  }
}

/**
 * Get vector store status
 */
export function getVectorStoreStatus() {
  return {
    initialized: isInitialized,
    documentsCount: documents.length,
    hasFAISSIndex: vectorStore !== null,
  };
}

/**
 * Reset vector store
 */
export function resetVectorStore() {
  documents = [];
  vectorStore = null;
  isInitialized = false;
  console.log('🔄 Vector store reset');
}
