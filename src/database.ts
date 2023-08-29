import * as mongodb from "mongodb";
import { Rune } from "./rune";
 
export const collections: {
   runes?: mongodb.Collection<Rune>;
} = {};
 
export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("meanStackExample");
   await applySchemaValidation(db);
 
   const runesCollection = db.collection<Rune>("runes");
   collections.runes = runesCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["symbol", "name", "meaning"],
           additionalProperties: false,
           properties: {
               _id: {},
               symbol: {
                   bsonType: "string",
                   description: "'symbol' is required and is a string",
               },
               name: {
                   bsonType: "string",
                   description: "'name' is required and is a string",
                   minLength: 2,
               },
               meaning: {
                   bsonType: "string",
                   description: "'meaning' is required and is a string",
               },
           },
       },
   };
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "runes",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("runes", {validator: jsonSchema});
       }
   });
}