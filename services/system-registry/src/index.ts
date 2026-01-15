import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from './services/db';
import router from './routes';
import { bootstrap } from './bootstrap';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/registry', router);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'system-registry-service' });
});

// Initialization
async function start() {
    await checkDatabaseConnection();
    await bootstrap();

    app.listen(PORT, () => {
        console.log(`System Registry Service running on port ${PORT}`);
    });
}

start();
