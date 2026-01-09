import 'reflect-metadata'; // Required for class-transformer/validator
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { jwtStrategy } from './config/passport';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import employeeRegistrationRoutes from './routes/employee-registration.routes';
import departmentRoutes from './routes/department.routes';
import ofsRoutes from './routes/ofs.routes';
import taskRoutes from './routes/task.routes';
import economyRoutes from './routes/economy.routes';
import analyticsRoutes from './routes/analytics.routes';
import telegramRoutes from './routes/telegram.routes';
import telegramService from './services/telegram.service';
import { auditLogMiddleware } from './middleware/audit-log.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './config/logger';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import storeRoutes from './routes/store.routes';
import gamificationRoutes from './routes/gamification.routes';
import universityRoutes from './routes/university.routes';
import { cache } from './config/cache';


// Handle BigInt serialization
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.'
});

app.use(limiter);
app.use(auditLogMiddleware);

// Middleware
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);

// Routes
// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MatrixGin API Docs',
}));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/registration', employeeRegistrationRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/ofs', ofsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/economy', economyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/telegram', telegramRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/university', universityRoutes);

app.get('/', (req, res) => {
    res.send('MatrixGin v2.0 API');
});

// Error Handling (must be after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Telegram Bot
telegramService.initializeBot().catch(error => {
    logger.error('Failed to initialize Telegram bot', { error: error.message });
});

// Initialize Redis cache
cache.connect().catch(error => {
    logger.warn('Redis not available, caching disabled', { error: error.message });
});

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});

