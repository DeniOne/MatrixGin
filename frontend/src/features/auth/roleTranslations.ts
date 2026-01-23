export const ROLE_TRANSLATIONS: Record<string, string> = {
    'Photon': 'Фотон',
    'Admin': 'Администратор',
    'Manager': 'Руководитель',
    'User': 'Пользователь',
    'Guest': 'Гость',
    'Developer': 'Разработчик',
    'Designer': 'Дизайнер',
    'QA': 'QA Инженер',
    'HR': 'HR Менеджер',
};

export const STATUS_TRANSLATIONS: Record<string, string> = {
    'PHOTON': 'Фотон',
    'TOPCHIK': 'Топчик',
    'STAR': 'Звезда',
    'UNIVERSE': 'Вселенная'
};

export const RANK_TRANSLATIONS: Record<string, string> = {
    'COLLECTOR': 'Коллекционер',
    'INVESTOR': 'Инвестор',
    'MAGNATE': 'Магнат',
    'DIAMOND_HAND': 'Бриллиантовая рука'
};

export const getRoleName = (role?: string): string => {
    if (!role) return 'Не определено';
    return ROLE_TRANSLATIONS[role] || role;
};

export const getStatusName = (code?: string): string => {
    if (!code) return 'Неизвестно';
    return STATUS_TRANSLATIONS[code] || code;
};

export const getRankName = (code?: string): string => {
    if (!code) return 'Неизвестно';
    return RANK_TRANSLATIONS[code] || code;
};
