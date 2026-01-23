
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/src/prisma.service';
import { FoundationAuditLog } from '@prisma/client';

export interface CreateFoundationAuditDto {
  userId: string;
  acceptedBy: string; // 'SYSTEM' or Admin ID
  basisCourses: string[]; // Array of Course IDs
  constitutionVersion?: string;
  codexVersion?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class FoundationAuditService {
  private readonly logger = new Logger(FoundationAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createAuditLog(dto: CreateFoundationAuditDto): Promise<FoundationAuditLog> {
    const { userId, acceptedBy, basisCourses, constitutionVersion, codexVersion, metadata } = dto;

    this.logger.log(`Creating Foundation Audit Log for user ${userId} by ${acceptedBy}`);

    return this.prisma.foundationAuditLog.create({
      data: {
        user_id: userId,
        accepted_by: acceptedBy,
        basis_courses: JSON.stringify(basisCourses), // Store as JSON
        constitution_version: constitutionVersion,
        codex_version: codexVersion,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });
  }

  async getAuditLog(userId: string): Promise<FoundationAuditLog | null> {
    return this.prisma.foundationAuditLog.findFirst({
      where: { user_id: userId },
      orderBy: { accepted_at: 'desc' },
    });
  }
}
