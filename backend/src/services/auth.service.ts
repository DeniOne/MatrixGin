import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterRequestDto, LoginRequestDto, AuthResponseDto, UserResponseDto } from '../dto/auth/auth.dto';
import { UserRole, UserStatus } from '../dto/common/common.enums';
import { prisma } from '../config/prisma';
import { logger } from '../config/logger';

export class AuthService {
    private readonly saltRounds = 10;
    private readonly jwtSecret = process.env.JWT_SECRET || 'super-secret-key';
    private readonly jwtExpiresIn = '1h';
    private readonly refreshTokenExpiresIn = '7d';

    async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new Error('User already exists');
        }
        // Hash password
        const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
        // Create user
        const user = await prisma.user.create({
            data: {
                email: dto.email,
                password_hash: passwordHash,
                first_name: dto.firstName,
                last_name: dto.lastName,
                middle_name: dto.middleName,
                phone_number: dto.phoneNumber,
                role: UserRole.EMPLOYEE as any, // Cast to Prisma enum type if needed, or ensure values match
                status: UserStatus.ACTIVE as any,
                personal_data_consent: dto.personalDataConsent,
                consent_date: dto.personalDataConsent ? new Date() : null,
            },
        });
        return this.generateAuthResponse(user);
    }

    async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
        logger.debug('Login attempt', { email: dto.email });
        const user = await prisma.user.findUnique({ where: { email: dto.email } });

        if (!user) {
            logger.debug('Login failed: user not found', { email: dto.email });
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);

        if (!isPasswordValid) {
            logger.debug('Login failed: invalid password', { email: dto.email });
            throw new Error('Invalid credentials');
        }

        // Update last login timestamp
        await prisma.user.update({
            where: { id: user.id },
            data: { last_login_at: new Date() },
        });

        logger.info('Login successful', { email: dto.email, userId: user.id });
        return this.generateAuthResponse(user);
    }

    async validateUser(payload: any): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        return user || null;
    }

    private generateAuthResponse(user: User): AuthResponseDto {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
        const refreshToken = jwt.sign(payload, this.jwtSecret, { expiresIn: this.refreshTokenExpiresIn });
        return {
            accessToken,
            refreshToken,
            expiresIn: 3600,
            user: this.mapToUserResponse(user),
        };
    }

    private mapToUserResponse(user: User): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            role: user.role as unknown as UserRole, // Cast Prisma enum to DTO enum
            status: user.status as unknown as UserStatus, // Cast Prisma enum to DTO enum
            firstName: user.first_name,
            lastName: user.last_name,
            middleName: user.middle_name || undefined, // Handle null
            phoneNumber: user.phone_number || undefined, // Handle null
            avatar: user.avatar || undefined, // Handle null
            departmentId: user.department_id || undefined, // Handle null
            lastLoginAt: user.last_login_at?.toISOString(),
            createdAt: user.created_at.toISOString(),

            updatedAt: user.updated_at.toISOString(),
            personalDataConsent: user.personal_data_consent,
        };
    }
}
