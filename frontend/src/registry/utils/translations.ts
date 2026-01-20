/**
 * Registry Translation Utilities
 * Автоматический перевод названий типов сущностей на русский язык
 */

export const ENTITY_TYPE_TRANSLATIONS: Record<string, string> = {
    // ===== ENTITY TYPES =====

    // Meta (00_meta)
    'EntityType': 'Тип сущности',
    'AttributeDefinition': 'Определение атрибута',
    'RelationshipDefinition': 'Определение связи',
    'FsmDefinition': 'Определение FSM',

    // Human Capital (02_human)
    'Person': 'Физическое лицо',
    'Employee': 'Сотрудник',
    'ExternalActor': 'Внешний актор',
    'External Actor': 'Внешний актор',
    'AiAgent': 'AI-агент',
    'AI Agent': 'AI-агент',
    'Expert': 'Эксперт',

    // Structure (03_structure)
    'Organization': 'Организация',
    'OrgUnitType': 'Тип подразделения',
    'Org Unit Type': 'Тип подразделения',
    'OrgUnit': 'Подразделение',
    'Org Unit': 'Подразделение',
    'OrgRelation': 'Связь структур',
    'Org Relation': 'Связь структур',
    'StructuralRole': 'Структурная роль',
    'Position': 'Должность',

    // Security (01_security)
    'UserAccount': 'Учётная запись',
    'User Account': 'Учётная запись',
    'Role': 'Роль',
    'Permission': 'Разрешение',
    'RolePermission': 'Роль-Разрешение',
    'Role Permission': 'Роль-Разрешение',
    'AccessScope': 'Область доступа',
    'Access Scope': 'Область доступа',
    'PolicyRule': 'Правило политики',
    'Policy Rule': 'Правило политики',
    'RetentionPolicy': 'Политика хранения',
    'Retention Policy': 'Политика хранения',

    // Functional (04_functional)
    'Function': 'Функция',
    'FunctionGroup': 'Группа функций',
    'Function Group': 'Группа функций',

    // Hierarchy (05_hierarchy)
    'Status': 'Статус',
    'StatusRule': 'Правило статуса',
    'Status Rule': 'Правило статуса',
    'Qualification': 'Квалификация',
    'QualificationLevel': 'Уровень квалификации',
    'Qualification Level': 'Уровень квалификации',
    'Appointment': 'Назначение',

    // Value (06_value)
    'CPK': 'ЦПК',
    'CpkHierarchy': 'Иерархия ЦПК',
    'CPK Hierarchy': 'Иерархия ЦПК',
    'CpkOwner': 'Владелец ЦПК',
    'CPK Owner': 'Владелец ЦПК',

    // Process (07_process)
    'TaskType': 'Тип задачи',
    'Task Type': 'Тиль задачи',
    'TaskState': 'Состояние задачи',
    'Task State': 'Состояние задачи',
    'Workflow': 'Рабочий процесс',

    // Economy (08_economy)
    'ValueToken': 'Токен ценности',
    'Value Token': 'Токен ценности',
    'RewardRule': 'Правило вознаграждения',
    'Reward Rule': 'Правило вознаграждения',
    'PenaltyRule': 'Правило штрафа',
    'Penalty Rule': 'Правило штрафа',

    // Knowledge (09_knowledge)
    'Faculty': 'Факультет',
    'Program': 'Программа',
    'Course': 'Курс',
    'KnowledgeUnit': 'Единица знаний',
    'Knowledge Unit': 'Единица знаний',
    'Methodology': 'Методология',
    'ResearchArtifact': 'Исследовательский артефакт',
    'Research Artifact': 'Исследовательский артефакт',
    'ContentItem': 'Элемент контента',
    'Content Item': 'Элемент контента',
    'Tag': 'Тег',

    // Legal (10_legal)
    'LegalEntity': 'Юридическое лицо',
    'Legal Entity': 'Юридическое лицо',
    'Document': 'Документ',

    // Integration (11_integration)
    'Integration': 'Интеграция',
    'Webhook': 'Вебхук',

    // ===== COMMON FIELDS =====

    'First Name': 'Имя',
    'Last Name': 'Фамилия',
    'Middle Name': 'Отчество',
    'Birth Date': 'Дата рождения',
    'Code': 'Код',
    'Name': 'Название',
    'Description': 'Описание',
    'Relationships': 'Связи',
    'Title': 'Заголовок',
    'Type': 'Тип',

    // Security fields
    'Rule Type': 'Тип правила',
    'Enforcement': 'Уровень применения',
    'Enforcement Level': 'Уровень применения',
    'Action': 'Действие',
    'Resource': 'Ресурс',
    'Scope': 'Область',
    'Module': 'Модуль',
    'Role Name': 'Название роли',
    'Is System': 'Системная',
    'Is Active': 'Активна',
    'Username': 'Имя пользователя',
    'Email': 'Email',
    'Is Locked': 'Заблокирован',
    // 'Status': 'Статус', // Duplicate

    // Structure fields
    'Parent': 'Родитель',
    'Level': 'Уровень',
    'Path': 'Путь',

    // UI Text
    'Foundation Entity Type': 'Foundation Entity Type',

    // Enum values
    'block': 'Блокировать',
    'warn': 'Предупреждение',
    'log': 'Логирование',
    'active': 'Активен',
    'inactive': 'Неактивен',
    'draft': 'Черновик'
};

/**
 * Переводит название типа сущности на русский
 */
export function translateEntityType(label: string): string {
    return ENTITY_TYPE_TRANSLATIONS[label] || label;
}

/**
 * Переводит название поля на русский
 */
export function translateFieldLabel(label: string): string {
    return ENTITY_TYPE_TRANSLATIONS[label] || label;
}
