import 'dotenv/config';
import express from "express";
import cors from 'cors';

import workerRoutes from "./routes/workerRoutes.js";
import authRoutes, { getSecret } from "./routes/authRoutes.js";

let corsOptions = {
    origin: 'http://localhost:5173'
};

getSecret();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/worker', workerRoutes);

try {
    const port = 3000;
    app.listen(port, () => {
        console.log(`listening to port ${port}...`);
    });
} catch(e) {
    console.log(e);
}