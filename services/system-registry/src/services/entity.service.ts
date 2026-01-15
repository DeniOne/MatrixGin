import { RegistryRepository } from '../repositories/registry.repository';
import { AuditService } from './audit.service';
import {
    RegistryEntityDTO, CreateRegistryEntityDTO, UpdateRegistryEntityDTO, LifecycleTransitionDTO
} from '../dto/registry.dto';
import { EntityType } from '../dto/domain';
import { logger } from '../utils/logger';

export class EntityService {
    private repo: RegistryRepository;
    private audit: AuditService;
    private entityType: EntityType;

    constructor(entityType: EntityType) {
        this.entityType = entityType;
        this.repo = new RegistryRepository(entityType);
        this.audit = new AuditService();
    }

    async list(page: number, limit: number): Promise<{ items: RegistryEntityDTO[]; total: number }> {
        const offset = (page - 1) * limit;
        return this.repo.findAll(limit, offset);
    }

    async getById(id: string): Promise<RegistryEntityDTO | null> {
        return this.repo.findById(id);
    }

    async getByCode(code: string): Promise<RegistryEntityDTO | null> {
        return this.repo.findByCode(code);
    }

    async create(dto: CreateRegistryEntityDTO, actorId: string): Promise<RegistryEntityDTO> {
        // 1. Check uniqueness/existence - handled by DB constraints usually, but "Idempotent" check in repository?
        // The requirement says "code unique". Repo will throw if duplicate.
        // Service just calls repo.

        // Explicitly existing check for clearer error
        const existing = await this.repo.findByCode(dto.code);
        if (existing) {
            throw new Error(`Entity with code '${dto.code}' already exists`);
        }

        const entity = await this.repo.create(dto.code, dto.name, dto.description, actorId);

        // Audit
        await this.audit.log('CREATE', this.entityType, entity.code, actorId);

        return entity;
    }

    async update(id: string, dto: UpdateRegistryEntityDTO, actorId: string): Promise<RegistryEntityDTO> {
        const current = await this.repo.findById(id);
        if (!current) throw new Error('Entity not found');

        // Perform Update
        const updated = await this.repo.update(id, dto.name, dto.description);

        // Audit changes
        if (dto.name && dto.name !== current.name) {
            await this.audit.log('UPDATE_META', this.entityType, current.code, actorId, { field: 'name', old: current.name, new: dto.name });
        }
        if (dto.description !== undefined && dto.description !== current.description) {
            // Handle nulls
            const oldD = current.description || '';
            const newD = dto.description || '';
            if (oldD !== newD) {
                await this.audit.log('UPDATE_META', this.entityType, current.code, actorId, { field: 'description', old: oldD, new: newD });
            }
        }

        return updated;
    }

    async transition(id: string, dto: LifecycleTransitionDTO, actorId: string): Promise<RegistryEntityDTO> {
        const current = await this.repo.findById(id);
        if (!current) throw new Error('Entity not found');

        const resultStatus = this.validateTransition(current.lifecycle_status, dto.transition);

        const updated = await this.repo.updateLifecycle(id, resultStatus);

        // Audit
        await this.audit.log('UPDATE_LIFECYCLE', this.entityType, current.code, actorId, {
            field: 'lifecycle_status',
            old: current.lifecycle_status,
            new: resultStatus
        });

        return updated;
    }

    async getAuditHistory(id: string): Promise<any[]> {
        const current = await this.repo.findById(id);
        if (!current) return []; // Or throw Not Found
        return this.audit.getHistory(this.entityType, current.code);
    }

    private validateTransition(currentStatus: string, action: 'activate' | 'archive'): string {
        // FSM Rules
        // draft -> active
        // active -> archived

        if (action === 'activate') {
            if (currentStatus === 'draft') return 'active';
            if (currentStatus === 'active') throw new Error('Conflict: Entity is already active');
            if (currentStatus === 'archived') throw new Error('Conflict: Cannot reactivate archived entity');
        }

        if (action === 'archive') {
            if (currentStatus === 'active') return 'archived';
            if (currentStatus === 'draft') return 'archived'; // Maybe allowed? Spec says "draft -> active -> archived". 
            // Spec Table: "draft -> active" OK. "active -> archived" OK.
            // Implicitly draft can be archived (abandoned)? Spec FSM table didn't explicitly forbid draft->archived, but "Forward only".
            // Let's assume draft->archived is OK (discarding a draft). 
            // But the strict table said:
            // draft->active OK
            // active->archived OK
            // nothing else.

            // Let's stick strictly to spec table.
            if (currentStatus === 'draft') throw new Error('Conflict: Draft must be activated before archiving (or just delete/ignore? Spec says NO DELETE)');
            if (currentStatus === 'archived') throw new Error('Conflict: Entity is already archived');
        }

        throw new Error(`Conflict: Invalid transition from ${currentStatus} via ${action}`);
    }
}
