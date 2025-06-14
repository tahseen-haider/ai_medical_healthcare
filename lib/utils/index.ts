// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
// import { Document } from "langchain/document";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { batchsize } from "@/lib/utils/config";

// let callback: (
//   filename: string,
//   totalChunks: number,
//   chunksUpserted: number,
//   isComplete: boolean
// ) => void;
// let totalDocumentChunks: number;
// let totalDocumentChunksUpseted: number = 0;
// const modelname = "mixedbread-ai/mxbai-embed-large-v1";

// export async function updateVectorDB(
//   client: Pinecone,
//   indexname: string,
//   namespace: string,
//   docs: Document[],
//   progressCallback: (
//     filename: string,
//     totalChunks: number,
//     chunksUpserted: number,
//     isComplete: boolean
//   ) => void
// ) {
//   callback = progressCallback;
//   totalDocumentChunks = 0;
//   totalDocumentChunksUpseted = 0;
//   const extractor = await pipeline("feature-extraction", modelname, {
//     quantized: true,
//     progress_callback: (progress: any) =>
//       console.log("Loading progress:", progress),
//   });
//   console.log(extractor);
//   for (const doc of docs) {
//     await processDocument(client, indexname, namespace, doc, extractor);
//   }
//   if (callback !== undefined) {
//     callback("filename", totalDocumentChunks, totalDocumentChunksUpseted, true);
//   }
// }

// async function processDocument(
//   client: Pinecone,
//   indexname: string,
//   namespace: string,
//   doc: Document<Record<string, any>>,
//   extractor: FeatureExtractionPipeline
// ) {
//   const splitter = new RecursiveCharacterTextSplitter();
//   const documentChunks = await splitter.splitText(doc.pageContent);
//   totalDocumentChunks = documentChunks.length;
//   totalDocumentChunksUpseted = 0;
//   console.log(doc.metadata.source);
//   const filename = getFilename(doc.metadata.source);

//   console.log(documentChunks.length);
//   let chunkBatchIndex = 0;
//   while (documentChunks.length > 0) {
//     chunkBatchIndex++;
//     const chunkBatch = documentChunks.splice(0, batchsize);
//     await processOneBatch(
//       client,
//       indexname,
//       namespace,
//       extractor,
//       chunkBatch,
//       chunkBatchIndex,
//       filename
//     );
//   }
// }

// function getFilename(filename: string): string {
//   const docname = filename.substring(filename.lastIndexOf("\\") + 1);
//   return docname.substring(0, docname.lastIndexOf(".")) || docname;
// }

// function cleanText(text: string) {
//   return text
//     .replace(/\n+/g, " ") // Remove line breaks
//     .replace(/\s+/g, " ") // Collapse multiple spaces
//     .replace(/\.\s*\./g, ".") // Fix double periods
//     .trim(); // Trim spaces at ends
// }

// async function processOneBatch(
//   client: Pinecone,
//   indexname: string,
//   namespace: string,
//   extractor: FeatureExtractionPipeline,
//   chunkBatch: string[],
//   chunkBatchIndex: number,
//   filename: string
// ) {
//   const cleanedChunks = chunkBatch.map((str) => cleanText(str));
//   const output = await extractor(cleanedChunks, {
//     pooling: "cls",
//   });
//   const embeddingsBatch = output.tolist();
//   let vectorBatch: PineconeRecord<RecordMetadata>[] = [];
//   for (let i = 0; i < chunkBatch.length; i++) {
//     const chunk = cleanedChunks[i];
//     const embedding = embeddingsBatch[i];

//     const vector: PineconeRecord<RecordMetadata> = {
//       id: `${filename}-${chunkBatchIndex}-${i}`,
//       values: embedding,
//       metadata: {
//         chunk,
//       },
//     };
//     vectorBatch.push(vector);
//   }
//   const index = client.Index(indexname).namespace(namespace);
//   await index.upsert(vectorBatch);
//   totalDocumentChunksUpseted += vectorBatch.length;
//   if (callback !== undefined) {
//     callback(filename, totalDocumentChunks, totalDocumentChunksUpseted, false);
//   }
//   vectorBatch = [];
// }
