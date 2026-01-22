import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { PersonalFileService } from '../services/personal-file.service';
import { CreatePersonalFileDto, UpdateStatusDto } from '../dto/request';
import { PersonalFileResponseDto } from '../dto/response';

@Controller('api/personnel/files')
export class PersonnelFilesController {
    constructor(private readonly personalFileService: PersonalFileService) { }

    /**
     * GET /api/personnel/files
     * Список личных дел
     * RBAC: HR_SPECIALIST+
     */
    @Get()
    async findAll(
        @Query('status') status?: string,
        @Query('departmentId') departmentId?: string,
    ): Promise<PersonalFileResponseDto[]> {
        // TODO: Implement filtering logic
        // TODO: Add RBAC guard
        throw new Error('Not implemented');
    }

    /**
     * GET /api/personnel/files/:id
     * Детали личного дела
     * RBAC: HR_SPECIALIST+
     */
    @Get(':id')
    async findById(@Param('id') id: string): Promise<PersonalFileResponseDto> {
        const file = await this.personalFileService.findById(id);
        return file as PersonalFileResponseDto;
    }

    /**
     * POST /api/personnel/files
     * Создание личного дела
     * RBAC: HR_MANAGER+
     */
    @Post()
    async create(
        @Body() dto: CreatePersonalFileDto,
        @Req() req: any,
    ): Promise<PersonalFileResponseDto> {
        // Extract actor info from request (from auth middleware)
        const actorId = req.user?.id || 'system';
        const actorRole = req.user?.role || 'HR_MANAGER';

        const file = await this.personalFileService.create(
            dto.employeeId,
            actorId,
            actorRole,
            dto.reason,
        );

        return file as PersonalFileResponseDto;
    }

    /**
     * PATCH /api/personnel/files/:id/status
     * Обновление статуса личного дела
     * RBAC: HR_MANAGER+
     */
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateStatusDto,
        @Req() req: any,
    ): Promise<PersonalFileResponseDto> {
        const actorId = req.user?.id || 'system';
        const actorRole = req.user?.role || 'HR_MANAGER';

        const file = await this.personalFileService.updateStatus(
            id,
            dto.newStatus,
            actorId,
            actorRole,
            dto.reason,
        );

        return file as PersonalFileResponseDto;
    }

    /**
     * POST /api/personnel/files/:id/archive
     * Передача личного дела в архив (Module 29)
     * RBAC: HR_MANAGER+
     */
    @Post(':id/archive')
    async archive(@Param('id') id: string): Promise<{ message: string }> {
        // TODO: Implement archive integration with Module 29
        throw new Error('Not implemented - requires Module 29 integration');
    }
}
