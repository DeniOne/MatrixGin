import { FoundationBlockType } from '../types/foundation.types';

export interface BlockContent {
    id: FoundationBlockType;
    title: string;
    meaning: string;
    consequences: string;
    icon: string;
}

export const FOUNDATION_CONTENT: Record<FoundationBlockType, BlockContent> = {
    [FoundationBlockType.CONSTITUTION]: {
        id: FoundationBlockType.CONSTITUTION,
        title: 'Конституция',
        meaning: 'Высший Устав Компании. Определяет иерархию, права и абсолютную власть Основателей. Служит фундаментом всех операций.',
        consequences: 'Нарушение конституционных принципов является основанием для немедленного увольнения и внесения в черный список. Незнание закона не освобождает от ответственности.',
        icon: 'Scale'
    },
    [FoundationBlockType.CODEX]: {
        id: FoundationBlockType.CODEX,
        title: 'Корпоративный Кодекс',
        meaning: 'Кодекс Чести. Определяет этические красные линии, политику борьбы с мошенничеством и принцип "Клиент — это Гость". Регулирует поведение, когда никто не видит.',
        consequences: 'Мошенничество, воровство или этические нарушения ведут к немедленному увольнению и получению "Волчьего билета" (отраслевой черный список).',
        icon: 'BookOpen'
    },
    [FoundationBlockType.GOLDEN_STANDARD]: {
        id: FoundationBlockType.GOLDEN_STANDARD,
        title: 'Золотой Стандарт',
        meaning: 'Святой Грааль операций. Скорость, Чистота, Качество. Каждый пиксель и каждая секунда имеют значение. Мы не жертвуем качеством ради скорости.',
        consequences: 'Систематическое несоответствие стандарту ведет к переобучению или понижению в должности. Саботаж качества приравнивается к мошенничеству.',
        icon: 'Star'
    },
    [FoundationBlockType.ROLE_MODEL]: {
        id: FoundationBlockType.ROLE_MODEL,
        title: 'Ролевая Модель (MDR)',
        meaning: 'Матрица Должностной Роли. Определяет вашу Цель, Ожидаемые Результаты (KPI) и Зону Ответственности. Никаких "это не моя работа".',
        consequences: 'Эффективность измеряется строго Результатами, а не усилиями. Невыполнение KPI ведет к потере бонусов и возможному расторжению контракта.',
        icon: 'UserCheck'
    },
    [FoundationBlockType.MOTIVATION]: {
        id: FoundationBlockType.MOTIVATION,
        title: 'Ядро Мотивации',
        meaning: 'Экономика Заслуг. Вы получаете MC (Коины) за достижения и GMC (Золотые коины) за стратегическое влияние. MC и GMC — это побочный продукт создания ценности.',
        consequences: 'Манипуляции системой или выпрашивание повышений запрещены. Ваш доход — это математическая функция вашей полезности.',
        icon: 'TrendingUp'
    }
};

export const BLOCK_ORDER = [
    FoundationBlockType.CONSTITUTION,
    FoundationBlockType.CODEX,
    FoundationBlockType.GOLDEN_STANDARD,
    FoundationBlockType.ROLE_MODEL,
    FoundationBlockType.MOTIVATION
];
