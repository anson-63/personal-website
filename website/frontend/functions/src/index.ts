import * as functions from "firebase-functions/v2/https";
import express from "express";

const app = express();
app.use(express.json());

app.post("/login", async (req, res) => {
res.json({ ok: true });
});
// add chat endpoints, e.g. app.post("/messages"), etc.

export const api = functions.region("asia-east1").onRequest(app);