import * as mongodb from "mongodb";
 
export interface Rune {
   symbol: string;
   name: string;
   meaning: string;
   _id?: mongodb.ObjectId;
}