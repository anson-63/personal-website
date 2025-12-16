import * as functions from "firebase-functions/v2/https";
import express from "express";
const app = express();

app.post("/login", async (req, res) => { /* custom auth logic if needed */ res.json({ ok: true }); });
export const api = functions.region("asia-east1").onRequest(app);