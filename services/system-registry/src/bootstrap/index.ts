import fs from 'fs';
import path from 'path';
import { EntityService } from '../services/entity.service';
import { EntityType, isValidEntityType } from '../dto/domain';
import { logger } from '../utils/logger';

interface SeedEntry {
    entity_type: string;
    code: string;
    name: string;
    description?: string;
}

export async function bootstrap() {
    logger.info('Starting System Registry Bootstrap...');

    const seedsDir = path.join(__dirname, '../../seeds');

    if (!fs.existsSync(seedsDir)) {
        logger.warn(`Seeds directory not found at ${seedsDir}. Skipping bootstrap.`);
        return;
    }

    const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.json'));

    // Sort files to respect dependency order?
    // Spec says: "Sort by Dependency Order (Level 0 -> 3)".
    // We can enforce naming convention like `00_system.json`, `01_org.json`.
    // Or simply read all files and assume the files themselves are structured or we load them into memory and sort.
    // Simplest: `seeds/00_types.json`, `seeds/01_roles.json` etc.

    files.sort(); // Lexicographical sort works if files are prefixed.

    for (const file of files) {
        logger.info(`Processing seed file: ${file}`);
        const filePath = path.join(seedsDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const seeds: SeedEntry[] = JSON.parse(content);

            for (const seed of seeds) {
                if (!isValidEntityType(seed.entity_type)) {
                    logger.warn(`Skipping invalid entity type in seed: ${seed.entity_type}`);
                    continue;
                }

                const service = new EntityService(seed.entity_type as EntityType);

                // Idempotency Check
                const existing = await service.getByCode(seed.code);
                if (existing) {
                    logger.debug(`Skipping existing entity: ${seed.entity_type}:${seed.code}`);
                    continue;
                }

                // Create
                await service.create({
                    code: seed.code,
                    name: seed.name,
                    description: seed.description
                }, 'system');

                logger.info(`Bootstrapped: ${seed.entity_type}:${seed.code}`);
            }

        } catch (err) {
            logger.error(`Failed to process seed file ${file}`, err);
            // Fail-fast? Spec says "Abort on error".
            throw err;
        }
    }

    logger.info('Bootstrap completed successfully.');
}
