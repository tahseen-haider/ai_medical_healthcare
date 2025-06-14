import { InferenceClient } from '@huggingface/inference';

import {
  Pinecone,
} from "@pinecone-database/pinecone";

const modelname = "mixedbread-ai/mxbai-embed-large-v1";
const hf = new InferenceClient(process.env.HUGGING_FACE_TOKEN);
const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
})


export async function queryPineconeVectorStore(
  query
){
  const apiOutput = await hf.featureExtraction({
    model: modelname,
    inputs: query,
  });
  console.log(apiOutput);

  const queryEmbedding = Array.from(apiOutput);

  const index = client.Index("index-1");
  
  const queryResponse = await index.namespace("ENCYCLOPEDIA_OF_MEDICINE_GALE").query({
    topK: 5,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: false,
  });


  if (queryResponse.matches.length > 0) {
    const concatenatedRetrievals = queryResponse.matches
      .map(
        (match, index) =>
          `\nClinical Finding ${index + 1}: \n ${match.metadata?.chunk}`
      )
      .join(". \n\n");
      console.log(concatenatedRetrievals)
    return concatenatedRetrievals;
  }
  else {
    return "<nomatches>"
  }
}
