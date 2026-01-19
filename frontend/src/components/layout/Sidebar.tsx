import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    Briefcase,
    BarChart2,
    Brain,
    ShoppingBag,
    Trophy,
    Building2,
    GraduationCap,
    ChevronDown,
    ChevronRight,
    LucideIcon,
    LogOut,
    Settings,
    User,
    ShieldCheck,
    Factory,
    Camera,
    History,
    Wallet
} from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
    path: string;
    label: string;
    icon: LucideIcon;
    subItems?: NavItem[];
}

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const [expandedItems, setExpandedItems] = useState<string[]>(['/university']);

    const toggleExpand = (path: string) => {
        setExpandedItems(prev =>
            prev.includes(path)
                ? prev.filter(p => p !== path)
                : [...prev, path]
        );
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems: NavItem[] = [
        { path: '/', label: 'Дашборд', icon: LayoutDashboard },
        { path: '/profile', label: 'Мой профиль', icon: User },
        { path: '/tasks', label: 'Задачи', icon: CheckSquare },
        {
            path: '/economy/wallet',
            label: 'Кошелек',
            icon: Wallet,
            subItems: [
                { path: '/economy/wallet', label: 'Баланс', icon: Wallet },
                { path: '/economy/transactions', label: 'История', icon: History },
            ]
        },
        { path: '/employees', label: 'Сотрудники', icon: Users },
        { path: '/departments', label: 'Отделы', icon: Briefcase },
        {
            path: '/ofs',
            label: 'ОФС',
            icon: Building2,
            subItems: [
                { path: '/ofs', label: 'Панель управления', icon: Building2 },
                { path: '/ofs/legacy', label: 'Классический вид', icon: History },
            ]
        },
        {
            path: '/university',
            label: 'Университет',
            icon: GraduationCap,
            subItems: [
                { path: '/photocraft', label: 'Фотомастерство', icon: GraduationCap },
                { path: '/sales', label: 'Продажи и сервис', icon: GraduationCap },
                { path: '/culture', label: 'Корпоративная культура', icon: GraduationCap },
                { path: '/soft', label: 'Soft Skills', icon: GraduationCap },
                { path: '/tech', label: 'Технологии', icon: GraduationCap },
                { path: '/mgmt', label: 'Менеджмент', icon: GraduationCap },
                { path: '/trainers', label: 'Институт обучающих', icon: Users },
            ]
        },
        {
            path: '/analytics',
            label: 'Аналитика',
            icon: BarChart2,
            subItems: [
                { path: '/analytics/personal', label: 'Личная', icon: User },
                { path: '/analytics/executive', label: 'Для руководства', icon: ShieldCheck },
            ]
        },
        {
            path: '/ai/recommendations',
            label: 'AI Советник',
            icon: Brain,
            subItems: [
                { path: '/ai/recommendations/personal', label: 'Персональный', icon: User },
                { path: '/ai/recommendations/executive', label: 'Системный', icon: ShieldCheck },
            ]
        },
        { path: '/store', label: 'Магазин', icon: ShoppingBag },
        { path: '/gamification', label: 'Геймификация', icon: Trophy },
        {
            path: '/production',
            label: 'Производство',
            icon: Factory,
            subItems: [
                { path: '/production/sessions', label: 'Фотосессии', icon: Camera },
            ]
        },
        // BLOCKER REQUIREMENT: SYSTEM REGISTRY
        { path: '/registry', label: 'Системный реестр', icon: Settings },
    ];

    const renderNavItem = (item: NavItem, depth = 0) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedItems.includes(item.path);
        const isActive = location.pathname === item.path || (hasSubItems && location.pathname.startsWith(item.path));
        const isChildActive = item.subItems?.some(sub => location.pathname.startsWith(sub.path));

        return (
            <div key={item.path} className="mb-1">
                {hasSubItems ? (
                    <div
                        onClick={() => toggleExpand(item.path)}
                        className={clsx(
                            'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer',
                            isActive || isChildActive
                                ? 'bg-indigo-600/10 text-indigo-400'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            depth > 0 && 'ml-4'
                        )}
                    >
                        <div className="flex items-center">
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </div>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                ) : (
                    <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                                isActive
                                    ? 'bg-indigo-600/10 text-indigo-400'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                depth > 0 && 'ml-8'
                            )
                        }
                    >
                        {!item.subItems && depth === 0 && <item.icon className="w-5 h-5 mr-3" />}
                        {depth > 0 && <item.icon className="w-4 h-4 mr-3 opacity-70" />}
                        {item.label}
                    </NavLink>
                )}

                {hasSubItems && isExpanded && (
                    <div className="mt-1 space-y-1">
                        {item.subItems!.map(subItem => renderNavItem(subItem, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full flex-shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <span className="text-xl font-bold text-white tracking-wider">MatrixGin</span>
                <span className="ml-2 text-xs text-gray-500">v2.0</span>
            </div>

            {/* User Info */}
            {user && (
                <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.role}</p>
                    </div>
                </div>
            )}

            <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                {navItems.map(item => renderNavItem(item))}
            </nav>

            {/* Footer with Settings and Logout */}
            <div className="p-4 border-t border-gray-800 space-y-1">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        clsx(
                            'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                            isActive
                                ? 'bg-indigo-600/10 text-indigo-400'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        )
                    }
                >
                    <Settings className="w-5 h-5 mr-3" />
                    Настройки
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Выйти
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

