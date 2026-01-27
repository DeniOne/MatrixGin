
import { EmulatedRole } from '../components/dev/RoleEmulator';

// Replicating UserRole here since we can't import from backend directly in this context without shared lib
export enum UserRole {
    EMPLOYEE = 'EMPLOYEE',
    MANAGER = 'MANAGER',
    HR_MANAGER = 'HR_MANAGER',
    DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
    ADMIN = 'ADMIN',
    // Special roles
    TRAINER = 'TRAINER',
    PRODUCTION = 'PRODUCTION',
    WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
    PROCUREMENT_MANAGER = 'PROCUREMENT_MANAGER',
    FINANCIAL_CONTROLLER = 'FINANCIAL_CONTROLLER'
}

export interface MenuItem {
    label: string;
    path: string;
    icon?: string; // We'll map string to actual icon component in Sidebar
    roles?: UserRole[];
    children?: MenuItem[];
    isExternal?: boolean;
}

export interface MenuCluster {
    id: string;
    title: string;
    icon?: string; // Cluster icon
    roles?: UserRole[]; // Minimal execution roles
    emulatedRoles: EmulatedRole[]; // Which emulated modes see this
    items: MenuItem[];
}

export const MENU_CONFIG: MenuCluster[] = [
    // A. MY SPACE
    {
        id: 'myspace',
        title: 'ЛИЧНЫЙ КАБИНЕТ',
        icon: 'UserOutlined',
        emulatedRoles: [EmulatedRole.EMPLOYEE, EmulatedRole.TACTICAL, EmulatedRole.STRATEGIC, EmulatedRole.SUPERUSER],
        items: [
            { label: 'Мой Дашборд', path: '/', icon: 'DashboardOutlined' },
            { label: 'Мои Задачи', path: '/tasks', icon: 'CheckSquareOutlined' },
            {
                label: 'Финансы и Магазин',
                path: '/economy',
                icon: 'WalletOutlined',
                children: [
                    { label: 'Кошелек', path: '/economy/wallet' },
                    { label: 'Магазин наград', path: '/store' },
                    { label: 'История операций', path: '/economy/transactions' }
                    // Auctions planned
                ]
            },
            {
                label: 'Геймификация',
                path: '/gamification',
                icon: 'TrophyOutlined',
                children: [
                    { label: 'Рейтинг сотрудников', path: '/gamification/leaderboard' },
                    { label: 'Достижения', path: '/gamification/achievements' },
                    { label: 'Квесты', path: '/gamification/quests' },
                    { label: 'Статус и Ранг', path: '/gamification/status' }
                ]
            },
            {
                label: 'Мой Профиль',
                path: '/profile',
                icon: 'ProfileOutlined',
                children: [
                    { label: 'Личная аналитика', path: '/analytics/personal' },
                    { label: 'AI Рекомендации', path: '/ai/recommendations/personal' }
                ]
            }
        ]
    },

    // B. UNIVERSITY
    {
        id: 'university',
        title: 'РАЗВИТИЕ (УНИВЕРСИТЕТ)',
        icon: 'BookOutlined',
        emulatedRoles: [EmulatedRole.EMPLOYEE, EmulatedRole.TACTICAL, EmulatedRole.STRATEGIC, EmulatedRole.SUPERUSER],
        items: [
            {
                label: 'Контур Допуска',
                path: '/foundation/start',
                icon: 'SafetyCertificateOutlined' // Canonical semantic for Admission 
            },
            {
                label: 'Центры обучения (Академии)',
                path: '/university',
                icon: 'ApartmentOutlined'
            },
            {
                label: 'Мое обучение',
                path: '/my-courses',
                icon: 'SolutionOutlined'
            },
            {
                label: 'Квалификация и Рост',
                path: '/gamification/status',
                icon: 'TrophyOutlined'
            },
            {
                label: 'Библиотечный фонд',
                path: '/library',
                icon: 'BookOutlined'
            },
            {
                label: 'УПРАВЛЕНИЕ ОБУЧЕНИЕМ',
                path: '/university/admin',
                icon: 'SettingOutlined',
                roles: [UserRole.TRAINER, UserRole.ADMIN, UserRole.HR_MANAGER],
                children: [
                    { label: 'Кабинет тренера', path: '/university/trainer/dashboard' },
                    { label: 'Аналитика обучения', path: '/university/admin/analytics' },
                    { label: 'Безопасность (Аудит)', path: '/university/admin/security' }
                ]
            }
        ]
    },

    // C. MANAGEMENT
    {
        id: 'management',
        title: 'ОПЕРАТИВНОЕ УПРАВЛЕНИЕ',
        icon: 'TeamOutlined',
        emulatedRoles: [EmulatedRole.TACTICAL, EmulatedRole.STRATEGIC, EmulatedRole.SUPERUSER],
        roles: [UserRole.MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.ADMIN],
        items: [
            { label: 'Кабинет руководителя', path: '/manager', icon: 'DesktopOutlined' },
            { label: 'Команда подразделения', path: '/ofs', icon: 'TeamOutlined' },
            // Kaizen & Feedback planned
            { label: 'Банк идей (Kaizen)', path: '/manager/kaizen', icon: 'BulbOutlined' },
        ]
    },

    // D. OPERATIONS
    {
        id: 'operations',
        title: 'ПРОИЗВОДСТВЕННЫЕ ПРОЦЕССЫ',
        icon: 'ToolOutlined',
        emulatedRoles: [EmulatedRole.TACTICAL, EmulatedRole.STRATEGIC, EmulatedRole.SUPERUSER],
        roles: [UserRole.PRODUCTION, UserRole.WAREHOUSE_MANAGER, UserRole.PROCUREMENT_MANAGER, UserRole.ADMIN],
        items: [
            { label: 'Управление производством', path: '/production/sessions', icon: 'ThunderboltOutlined' },
            // Planned items commented out or disabled until implemented
            // { label: 'Складской учет (WMS)', path: '/wms', icon: 'CodeSandboxOutlined' },
            // { label: 'Закупки и снабжение', path: '/procurement', icon: 'ShoppingOutlined' },
            // { label: 'Бюджетирование', path: '/finance', icon: 'DollarOutlined', roles: [UserRole.FINANCIAL_CONTROLLER] }
        ]
    },

    // E. PERSONNEL
    {
        id: 'personnel',
        title: 'УПРАВЛЕНИЕ ПЕРСОНАЛОМ (HR)',
        icon: 'IdcardOutlined',
        emulatedRoles: [EmulatedRole.STRATEGIC, EmulatedRole.SUPERUSER], // Usually HR is strategic or specialized
        roles: [UserRole.HR_MANAGER, UserRole.ADMIN],
        items: [
            { label: 'HR Аналитика', path: '/personnel/dashboard', icon: 'BarChartOutlined' },
            { label: 'Реестр сотрудников', path: '/personnel', icon: 'UsergroupAddOutlined' },
            {
                label: 'Кадровое делопроизводство',
                path: '/personnel/files',
                icon: 'FileTextOutlined',
                children: [
                    { label: 'Личные дела', path: '/personnel/files' },
                    { label: 'Приказы', path: '/personnel/orders' },
                    { label: 'Трудовые договоры', path: '/personnel/contracts' }
                ]
            },
            { label: 'Регистрация заявок', path: '/personnel/registration', icon: 'UserAddOutlined' },
            {
                label: 'Оргструктура и ЦКП',
                path: '/ofs',
                icon: 'ApartmentOutlined',
                children: [
                    { label: 'Организационная структура', path: '/ofs/structure' },
                    { label: 'Исполнительная схема', path: '/ofs/executive' },
                    { label: 'ЦКП и Продукты', path: '/ofs/ckp' },
                    { label: 'Матрица ролей', path: '/ofs/role-matrix' },
                    { label: 'Матрица ответственности', path: '/ofs/responsibility' },
                    { label: 'Структурные срезы', path: '/ofs/slices' }
                ]
            }
        ]
    },

    // F. SYSTEM
    {
        id: 'system',
        title: 'АДМИНИСТРИРОВАНИЕ СИСТЕМЫ',
        icon: 'SettingOutlined',
        emulatedRoles: [EmulatedRole.STRATEGIC, EmulatedRole.SUPERUSER], // Executive sees Dashboards, Superuser sees all
        roles: [UserRole.ADMIN, UserRole.HR_MANAGER], // Partial access for HR
        items: [
            {
                label: 'Стратегический Дашборд',
                path: '/analytics/executive',
                icon: 'AreaChartOutlined',
                roles: [UserRole.ADMIN, UserRole.HR_MANAGER] // Strategic managers also see this
            },
            {
                label: 'Системный Реестр',
                path: '/registry',
                icon: 'DatabaseOutlined',
                roles: [UserRole.ADMIN] // HARD ADMIN ONLY
            },
            {
                label: 'Конфигурация модулей',
                path: '/admin/config',
                icon: 'ControlOutlined',
                roles: [UserRole.ADMIN],
                children: [
                    { label: 'Управление статусами', path: '/admin/status-management' },
                    { label: 'Библиотечный фонд', path: '/library/admin' }
                ]
            },
            {
                label: 'Безопасность и Контроль',
                path: '/admin/security',
                icon: 'SafetyCertificateOutlined',
                roles: [UserRole.ADMIN, UserRole.HR_MANAGER],
                children: [
                    { label: 'Безопасность обучения', path: '/university/admin/security' },
                    { label: 'Аналитика AI Feedback', path: '/ai/feedback/analytics' }
                ]
            },
            {
                label: 'ИНСТРУМЕНТЫ РАЗРАБОТКИ',
                path: '/admin/dev',
                icon: 'CodeOutlined',
                roles: [UserRole.ADMIN], // In prod, this would be Superuser only. In dev, accessible via emulator

                children: [
                    { label: 'Feature Flags', path: '/admin/flags' },
                    { label: 'System Health', path: '/admin/health' }
                ]
            }
        ]
    }
];
