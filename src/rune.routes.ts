import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
 
export const runeRouter = express.Router();
runeRouter.use(express.json());
 
/* runeRouter.get("/", async (_req, res) => {
    try {
        const runes = await collections.runes.find({}).toArray();
        res.status(200).send(runes);
    } catch (error) {
        res.status(500).send(error.message);
    }
 }); */

 runeRouter.get("/", async (_req, res) => {
    try {


        const runes = await collections.runes.aggregate([{ $sample: { size: 5 } }]).toArray();
        res.status(200).send(runes);



    } catch (error) {
        res.status(500).send(error.message);
    }
 });

runeRouter.get("/rune/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const rune = await collections.runes.findOne(query);
  
        if (rune) {
            res.status(200).send(rune);
        } else {
            res.status(404).send(`Failed to find an rune: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find an rune: ID ${req?.params?.id}`);
    }
 });

 runeRouter.post("/", async (req, res) => {
    try {
        const rune = req.body;
        const result = await collections.runes.insertOne(rune);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new rune: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new rune.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });

 runeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const rune = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.runes.updateOne(query, { $set: rune });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an rune: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an rune: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an rune: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });

 runeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.runes.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an rune: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an rune: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an rune: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });