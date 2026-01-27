/**
 * Foundation Immersion Blocks
 * CANON v2.2: Mandatory Admission Scope
 * 
 * These are NOT courses. They are fundamental distinct implementation units.
 * Users must "view" (audit log) all blocks before they can Accept the Foundation.
 */

export const FOUNDATION_VERSION = 'v2.2-canon';

export enum FoundationBlockType {
    CONSTITUTION = 'CONSTITUTION',
    CODEX = 'CODEX',
    GOLDEN_STANDARD = 'GOLDEN_STANDARD',
    ROLE_MODEL = 'ROLE_MODEL',
    MOTIVATION = 'MOTIVATION'
}

export enum FoundationStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    ACCEPTED = 'ACCEPTED',
    NOT_ACCEPTED = 'NOT_ACCEPTED',
    VERSION_MISMATCH = 'VERSION_MISMATCH'
}

export interface FoundationBlock {
    id: FoundationBlockType;
    materialId: string;
    title: string;
    description: string;
    order: number;
    mandatory: boolean; // Always true for this set
}

export const FOUNDATION_BLOCKS: FoundationBlock[] = [
    {
        id: FoundationBlockType.CONSTITUTION,
        materialId: 'foundation-block-1',
        title: 'Внутренняя Конституция',
        description: 'Высший Устав Компании. Права, Иерархия и Власть.',
        order: 1,
        mandatory: true
    },
    {
        id: FoundationBlockType.CODEX,
        materialId: 'foundation-block-2',
        title: 'Код поведения и антифрод',
        description: 'Кодекс Чести, борьба с мошенничеством и этические границы.',
        order: 2,
        mandatory: true
    },
    {
        id: FoundationBlockType.GOLDEN_STANDARD,
        materialId: 'foundation-block-3',
        title: 'Золотой Стандарт Фотоматрицы',
        description: 'Ценности: "Клиент — это Гость", Чистота, Скорость.',
        order: 3,
        mandatory: true
    },
    {
        id: FoundationBlockType.ROLE_MODEL,
        materialId: 'foundation-block-4',
        title: 'Ролевая модель и ответственность',
        description: 'Как работают Роли, Результаты и Зоны Ответственности.',
        order: 4,
        mandatory: true
    },
    {
        id: FoundationBlockType.MOTIVATION,
        materialId: 'foundation-block-5',
        title: 'Мотивация и последствия',
        description: 'Экономика Заслуг: MC, GMC и последствия нарушений.',
        order: 5,
        mandatory: true
    }
];
