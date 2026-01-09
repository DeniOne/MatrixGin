/**
 * Authentication Middleware
 * Handles JWT authentication using Passport
 */

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                error: info?.message || 'Unauthorized',
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};

/**
 * Optional authentication - doesn't block if no token provided
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};
