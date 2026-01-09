/**
 * Employee DTOs for MatrixGin v2.0 API
 */

import {
    IsString,
    IsUUID,
    IsEnum,
    IsOptional,
    IsNumber,
    IsDateString,
    IsInt,
    MinLength,
    MaxLength,
    Min,
    Max,
    Matches,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeStatus, EmployeeRank } from '../common/common.enums';
import { UUID, ISODate, ISODateTime, EmotionalTone } from '../common/common.types';
import { UserResponseDto } from '../auth/auth.dto';
import { DepartmentResponseDto } from '../departments/department.dto';

/**
 * Create employee request
 */
export class CreateEmployeeRequestDto {
    @IsUUID()
    userId: UUID;

    @IsUUID()
    departmentId: UUID;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    position: string;

    @IsDateString()
    hireDate: ISODate;

    @IsOptional()
    @IsNumber()
    @Min(0)
    salary?: number;

    @IsOptional()
    @IsString()
    @Matches(/^EMP-\d{6}$/, {
        message: 'Номер сотрудника должен быть в формате EMP-XXXXXX',
    })
    employeeNumber?: string;

    @IsOptional()
    @IsEnum(EmployeeStatus)
    status?: EmployeeStatus;

    @IsOptional()
    @IsEnum(EmployeeRank)
    rank?: EmployeeRank;
}

/**
 * Update employee request
 */
export class UpdateEmployeeRequestDto {
    @IsOptional()
    @IsUUID()
    departmentId?: UUID;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    position?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    salary?: number;

    @IsOptional()
    @IsEnum(EmployeeStatus)
    status?: EmployeeStatus;

    @IsOptional()
    @IsEnum(EmployeeRank)
    rank?: EmployeeRank;
}

/**
 * Update emotional tone request
 */
export class UpdateEmotionalToneDto {
    @IsNumber()
    @Min(0)
    @Max(4)
    tone: number;
}

/**
 * Employee response
 */
export class EmployeeResponseDto {
    @IsUUID()
    id: UUID;

    @IsUUID()
    userId: UUID;

    @IsOptional()
    @ValidateNested()
    @Type(() => UserResponseDto)
    user?: UserResponseDto;

    @IsUUID()
    departmentId: UUID;

    @IsOptional()
    @ValidateNested()
    @Type(() => DepartmentResponseDto)
    department?: DepartmentResponseDto;

    @IsString()
    position: string;

    @IsOptional()
    @IsString()
    employeeNumber?: string;

    @IsOptional()
    @IsNumber()
    salary?: number;

    @IsEnum(EmployeeStatus)
    status: EmployeeStatus;

    @IsEnum(EmployeeRank)
    rank: EmployeeRank;

    @IsDateString()
    hireDate: ISODate;

    @IsOptional()
    @IsDateString()
    terminationDate?: ISODate;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(4)
    emotionalTone?: EmotionalTone;

    @IsOptional()
    @IsNumber()
    mcBalance?: number;

    @IsOptional()
    @IsNumber()
    gmcBalance?: number;

    @IsDateString()
    createdAt: ISODateTime;

    @IsDateString()
    updatedAt: ISODateTime;
}

/**
 * Employee analytics response
 */
export class EmployeeAnalyticsResponseDto {
    @IsUUID()
    employeeId: UUID;

    @IsNumber()
    @Min(0)
    @Max(100)
    kpiScore: number;

    @IsInt()
    @Min(0)
    tasksCompleted: number;

    @IsNumber()
    @Min(0)
    averageTaskCompletionTime: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(4)
    emotionalToneAverage?: EmotionalTone;

    @IsNumber()
    @Min(0)
    @Max(1)
    burnoutRisk: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    engagementIndex: number;
}

/**
 * Employee filters for queries
 */
export class EmployeeFiltersDto {
    @IsOptional()
    @IsUUID()
    departmentId?: UUID;

    @IsOptional()
    @IsEnum(EmployeeStatus)
    status?: EmployeeStatus;

    @IsOptional()
    @IsEnum(EmployeeRank)
    rank?: EmployeeRank;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(4)
    @Type(() => Number)
    minEmotionalTone?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(4)
    @Type(() => Number)
    maxEmotionalTone?: number;

    @IsOptional()
    @IsString()
    search?: string;
}
