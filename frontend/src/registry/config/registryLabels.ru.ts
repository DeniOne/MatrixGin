import { RegistryEntityType } from './registryEntities';

export const REGISTRY_DOMAINS_RU: Record<string, string> = {
    'Security': 'Безопасность',
    'Human': 'Человеческий капитал',
    'Structure': 'Организационная структура',
    'Functional': 'Функциональный домен',
    'Hierarchy': 'Иерархия и статусы',
    'Value': 'Ценностный продукт (ЦКП)',
    'Process': 'Процессы и задачи',
    'Economy': 'Внутренняя экономика',
    'Knowledge': 'База знаний',
    'Legal': 'Юридический блок'
};

export const REGISTRY_LABELS_RU: Record<RegistryEntityType, { label: string; desc?: string }> = {
    // Security
    'policy-rule': { label: 'Правило политики', desc: 'Системное ограничение или требование' },
    'retention-policy': { label: 'Политика хранения', desc: 'Правила удержания и архивации данных' },
    'role': { label: 'Роль', desc: 'Набор разрешений доступа' },
    'permission': { label: 'Разрешение', desc: 'Атомарное право на действие' },
    'role-permission': { label: 'Связь Роль-Разрешение', desc: 'Привязка прав к ролям' },
    'access-scope': { label: 'Область доступа', desc: 'Границы применимости прав' },

    // Human
    'person': { label: 'Физическое лицо', desc: 'Реальный человек' },
    'external-actor': { label: 'Внешний актор', desc: 'Подрядчик, клиент или партнер' },

    // Structure
    'organization': { label: 'Организация', desc: 'Юридическое или управленческое лицо' },
    'org-unit': { label: 'Организационная единица', desc: 'Департамент, отдел или группа' },
    'org-unit-type': { label: 'Тип подразделения', desc: 'Классификация орг. единиц' },
    'org-relation': { label: 'Связь структур', desc: 'Иерархическое или функциональное подчинение' },
    'structural-role': { label: 'Структурная роль', desc: 'Роль в рамках орг. единицы' },

    // Functional
    'function': { label: 'Функция', desc: 'Бизнес-функция или обязанность' },
    'function-group': { label: 'Группа функций', desc: 'Логическое объединение функций' },

    // Hierarchy
    'position': { label: 'Штатная позиция', desc: 'Ячейка штатного расписания' },
    'status': { label: 'Статус', desc: 'Квалификационный или социальный статус' },
    'status-rule': { label: 'Правило статуса', desc: 'Условие присвоения статуса' },
    'qualification': { label: 'Квалификация', desc: 'Подтвержденный навык' },
    'qualification-level': { label: 'Уровень квалификации', desc: 'Градация владения навыком' },

    // Value
    'cpk': { label: 'ЦКП (Продукт)', desc: 'Ценный Конечный Продукт' },
    'cpk-hierarchy': { label: 'Иерархия ЦКП', desc: 'Дерево продуктов' },
    'cpk-owner': { label: 'Владелец ЦКП', desc: 'Ответственный за продукт' },

    // Process
    'task-type': { label: 'Тип задачи', desc: 'Классификатор задач' },
    'task-state': { label: 'Состояние задачи', desc: 'Этап жизненного цикла задачи' },
    'workflow': { label: 'Рабочий процесс', desc: 'Схема прохождения задачи' },

    // Economy
    'value-token': { label: 'Токен ценности', desc: 'Учетная единица экономики' },
    'reward-rule': { label: 'Правило вознаграждения', desc: 'Условия начисления токенов' },
    'penalty-rule': { label: 'Правило штрафа', desc: 'Условия списания токенов' },

    // Knowledge
    'faculty': { label: 'Факультет', desc: 'Образовательное направление' },
    'methodology': { label: 'Методология', desc: 'Стандарт или руководство' },
    'knowledge-unit': { label: 'Единица знаний', desc: 'Статья, урок или документ' },

    // Legal
    'legal-entity': { label: 'Юридическое лицо', desc: 'Реквизиты компании' }
};

export const UI_TEXT = {
    APP_TITLE: 'Системный реестр',
    APP_SUBTITLE: 'Secure Core v1.0',
    DASHBOARD_HEADING: 'Системный реестр MatrixGin',
    DASHBOARD_DESC: 'Централизованная панель управления фундаментальными сущностями. Строгий контроль доступа, аудит и версионность.',
    ENV_PROD: 'СРЕДА: PRODUCTON',
    USER_ADMIN: 'ПОЛЬЗОВАТЕЛЬ: ADMIN (ROOT)',
    SEARCH_PLACEHOLDER: 'Поиск по коду или названию...',
    CREATE_NEW: 'Создать',
    BACK_TO_LIST: 'Назад к списку',
    CREATE_HEADER: 'Создание новой сущности',
    CREATE_DRAFT_NOTE: 'Новые сущности создаются в статусе',
    STATUS_DRAFT: 'Черновик',
    STATUS_ACTIVE: 'Активен',
    STATUS_ARCHIVED: 'Архив',
    BTN_SAVE: 'Сохранить',
    BTN_CREATE: 'Создать черновик',
    BTN_SAVING: 'Сохранение...',
    BTN_ACTIVATE: 'Активировать',
    BTN_ARCHIVE: 'Архивировать',
    LABEL_CODE: 'Системный код',
    LABEL_NAME: 'Отображаемое название',
    LABEL_DESC: 'Описание',
    LOCKED_NOTE: 'Заблокировано (Неизменяемо)',
    ERR_CODE_REQ: 'Код обязателен',
    ERR_CODE_FMT: 'Формат: только маленькие латинские буквы и _',
    ERR_NAME_REQ: 'Название обязательно',
    TAB_GENERAL: 'Основное',
    TAB_LIFECYCLE: 'Жизненный цикл',
    TAB_AUDIT: 'Аудит',
    AUDIT_TITLE: 'Журнал системного аудита',
    AUDIT_EMPTY: 'Записи аудита отсутствуют.',
    LOADING: 'Загрузка...',
    NOT_FOUND: 'Записи не найдены',
    NOT_FOUND_HINT: 'Создайте новую сущность, чтобы начать.',
    LIFECYCLE_RULES_TITLE: 'Правила перехода состояний',
    LIFECYCLE_RULE_1: 'Черновик: Начальный статус. Изменяем. Не виден в модулях.',
    LIFECYCLE_RULE_2: 'Активен: Рабочий статус. Виден везде. Частично неизменяем.',
    LIFECYCLE_RULE_3: 'Архив: Конечный статус. Только чтение.',
    ACCESS_DENIED: 'Доступ запрещен',
    ACCESS_DENIED_HINT: 'Требуется роль: REGISTRY_VIEW',
    RETURN_DASHBOARD: 'Вернуться на дашборд',
    ADMIN_MODE: 'РЕЖИМ АДМИНА',
    EXIT: 'Выход',
    COL_CODE: 'Код',
    COL_NAME: 'Название',
    COL_STATUS: 'Статус',
    COL_UPDATED: 'Обновлено',
    TERM_STATE_NOTE: 'Терминальный статус. Действия недоступны.',
    NO_REVERSE_NOTE: 'Правила: Удаление запрещено. Восстановление из архива невозможно.'
};
