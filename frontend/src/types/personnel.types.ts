/**
 * Personnel Module Types
 * REPLACING @prisma/client imports in frontend
 */

export enum HRStatus {
    ONBOARDING = 'ONBOARDING',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    TERMINATED = 'TERMINATED',
    ARCHIVED = 'ARCHIVED'
}

export enum OrderStatus {
    DRAFT = 'DRAFT',
    SIGNED = 'SIGNED',
    CANCELLED = 'CANCELLED'
}

export enum ContractStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    TERMINATED = 'TERMINATED'
}

export interface PersonalFile {
    id: string;
    employeeId: string;
    fileNumber: string;
    hrStatus: HRStatus;
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
}

export interface PersonnelOrder {
    id: string;
    personalFileId: string;
    orderNumber: string;
    orderType: string;
    status: OrderStatus;
    title: string;
    content: string;
    basis: string;
    orderDate: string;
    effectiveDate: string;
    signedAt?: string;
    cancelledAt?: string;
}

export interface LaborContract {
    id: string;
    personalFileId: string;
    contractNumber: string;
    contractType: string;
    status: ContractStatus;
    contractDate: string;
    startDate: string;
    endDate?: string;
    positionId: string;
    departmentId: string;
    salary: number;
    salaryType: string;
    terminationDate?: string;
    reason?: string;
}

export interface PersonnelDocument {
    id: string;
    personalFileId: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
}
