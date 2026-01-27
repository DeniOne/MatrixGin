
import React, { useState, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';
import { foundationApi } from '../../features/foundation/api/foundation.api';
import FoundationStatusBadge from './FoundationStatusBadge';
import { FoundationStatus } from '../../features/foundation/types/foundation.types';
import {
    LayoutDashboard,
    CheckSquare,
    Wallet,
    ShoppingBag,
    Trophy,
    User,
    BarChart2,
    BookOpen,
    GraduationCap,
    Users,
    Briefcase,
    Lightbulb,
    Factory,
    Camera,
    Code,
    Settings,
    Database,
    ShieldCheck,
    LogOut,
    ChevronDown,
    ChevronRight,
    LucideIcon,
    History,
    Menu,
    FileText,
    UserPlus,
    Building2,
    Sliders
} from 'lucide-react';
import clsx from 'clsx';
import { MENU_CONFIG, MenuCluster, MenuItem, UserRole } from '../../config/menuConfig';
import { RoleEmulator, EmulatedRole } from '../dev/RoleEmulator';

// --- Icon Mapping ---
const ICON_MAP: Record<string, LucideIcon> = {
    'DashboardOutlined': LayoutDashboard,
    'CheckSquareOutlined': CheckSquare,
    'WalletOutlined': Wallet,
    'ShoppingBagOutlined': ShoppingBag, // Store
    'TrophyOutlined': Trophy,
    'ProfileOutlined': User,
    'BarChartOutlined': BarChart2,
    'AreaChartOutlined': BarChart2, // Executive Dash
    'ReadOutlined': BookOpen,
    'SolutionOutlined': GraduationCap, // My Learning
    'ExperimentOutlined': Users, // Trainer (using Users for now)
    'TeamOutlined': Users, // My Team
    'DesktopOutlined': Briefcase, // Manager Cabinet
    'BulbOutlined': Lightbulb, // Kaizen
    'ToolOutlined': Factory, // Operations Cluster
    'ThunderboltOutlined': Camera, // Production (Sessions)
    'CodeSandboxOutlined': Building2, // WMS (Box not available, using Building)
    'ShoppingOutlined': ShoppingBag, // Procurement
    'DollarOutlined': Wallet, // Finance
    'IdcardOutlined': Users, // Personnel Cluster
    'UsergroupAddOutlined': Users, // Employees
    'FileTextOutlined': FileText, // Files
    'UserAddOutlined': UserPlus, // Registration
    'ApartmentOutlined': Building2, // OFS
    'SettingOutlined': Settings, // System Cluster
    'DatabaseOutlined': Database, // Registry
    'ControlOutlined': Sliders, // Config
    'SafetyCertificateOutlined': ShieldCheck, // Security
    'CodeOutlined': Code, // Dev Tools

    // Default fallback
    'UserOutlined': User,
    'BookOutlined': BookOpen,
    'SettingsOutlined': Settings,
};

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);

    // State
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [collapsedClusters, setCollapsedClusters] = useState<string[]>([]);

    // Role Emulator State
    // Default to SUPERUSER in DEV for convenience, or EMPLOYEE
    const [emulatedRole, setEmulatedRole] = useState<EmulatedRole>(EmulatedRole.SUPERUSER);

    const isLocked = useMemo(() => {
        // Superuser is never locked out from a UI perspective (for dev/management)
        if (emulatedRole === EmulatedRole.SUPERUSER) return false;
        // Use user object from Redux
        return user?.foundationStatus !== 'ACCEPTED';
    }, [user, emulatedRole]);

    const toggleExpand = (path: string) => {
        setExpandedItems(prev =>
            prev.includes(path)
                ? prev.filter(p => p !== path)
                : [...prev, path]
        );
    };

    const toggleCluster = (clusterId: string) => {
        setCollapsedClusters(prev =>
            prev.includes(clusterId)
                ? prev.filter(c => c !== clusterId)
                : [...prev, clusterId]
        );
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // --- Filtering Logic ---
    const filteredClusters = useMemo(() => {
        // 1. Filter items based on actual User Role (if we implemented that strictly) OR Emulated Role
        // For this task, strict mapping of UserRole to EmulatedRole is simplified.
        // We trust the "EmulatedRole" array in the config.

        return MENU_CONFIG.filter(cluster => {
            // 0. LOCKOUT LOGIC: If locked, only Cluster B is potentially visible
            if (isLocked && cluster.id !== 'university') return false;

            // 1. Filter items based on emulated role
            if (!cluster.emulatedRoles.includes(emulatedRole)) return false;
            return true;
        }).map(cluster => {
            // Filter items inside cluster
            const validItems = cluster.items.filter(item => {
                // LOCKOUT LOGIC: Only Admission Gate is visible in Cluster B if locked
                if (isLocked && cluster.id === 'university') {
                    return item.path === '/foundation/start';
                }
                // If item has specific roles, check against emulated "virtual" permissions
                // Since EmulatedRole is a "Preset", we map it roughly:
                // EMPLOYEE -> Basic roles
                // TACTICAL -> MANAGER
                // STRATEGIC -> HEAD
                // SUPERUSER -> ADMIN

                // For simplicity in this emulator, if the Cluster is visible, we show most items,
                // BUT we should respect the 'roles' array if present.
                // Development trick: If SUPERUSER, show everything.
                if (emulatedRole === EmulatedRole.SUPERUSER) return true;

                // If item has no specific role requirements, show it
                if (!item.roles || item.roles.length === 0) return true;

                // Mapping Emulated to Real Roles for check
                // This is a naive check for the prototype
                const virtualRoles: UserRole[] = [];
                if (emulatedRole === EmulatedRole.EMPLOYEE) virtualRoles.push(UserRole.EMPLOYEE);
                if (emulatedRole === EmulatedRole.TACTICAL) virtualRoles.push(UserRole.EMPLOYEE, UserRole.MANAGER);
                if (emulatedRole === EmulatedRole.STRATEGIC) virtualRoles.push(UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.DEPARTMENT_HEAD, UserRole.HR_MANAGER); // Assume Strategic sees HR stuff? No, check cluster.

                // Strict check: Does item require a role we don't 'virtually' have?
                // Actually, MENU_CONFIG `emulatedRoles` on Cluster level handles the "Zone" visibility.
                // Item level `roles` are fine-grained.
                // Let's rely on the Cluster level for the big chunks, and for items:
                // If item requires ADMIN and we are not SUPERUSER, hide it.
                if (item.roles.includes(UserRole.ADMIN) && emulatedRole !== EmulatedRole.SUPERUSER) return false;

                return true;
            });

            return { ...cluster, items: validItems };
        }).filter(cluster => cluster.items.length > 0);

    }, [emulatedRole]);

    // --- Renders ---

    const renderMenuItem = (item: MenuItem, depth = 0) => {
        const Icon = item.icon && ICON_MAP[item.icon] ? ICON_MAP[item.icon] : Menu;
        const hasSubItems = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.path);
        const isActive = location.pathname === item.path || (hasSubItems && location.pathname.startsWith(item.path));

        return (
            <div key={item.path} className="mb-0.5">
                {hasSubItems ? (
                    <div
                        onClick={() => toggleExpand(item.path)}
                        className={clsx(
                            'flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none',
                            isActive
                                ? 'bg-white text-[#3B82F6] font-medium shadow-sm border border-black/5'
                                : 'text-[#717182] hover:bg-white hover:text-[#030213] font-medium border border-transparent',
                            depth > 0 && 'ml-4'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className={clsx("w-[18px] h-[18px]", isActive ? "text-[#3B82F6]" : "text-[#717182]")} />
                            <span className={clsx("tracking-tight", depth === 0 ? "text-[14px]" : "text-[13px]")}>{item.label}</span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-50" /> : <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                    </div>
                ) : (
                    <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 border',
                                isActive
                                    ? 'bg-white text-[#3B82F6] font-medium shadow-sm border-black/10'
                                    : 'text-[#717182] hover:bg-white hover:text-[#030213] font-medium border-transparent'
                            )
                        }
                    >
                        <Icon className={clsx("w-[18px] h-[18px] mr-3 shrink-0", isActive ? "text-[#3B82F6]" : "text-[#717182]")} />
                        <span className={clsx("tracking-tight", depth === 0 ? "text-[14px]" : "text-[13px]")}>{item.label}</span>
                    </NavLink>
                )}

                {hasSubItems && isExpanded && (
                    <div className="mt-1 space-y-1 relative">
                        {item.children!.map(sub => renderMenuItem(sub, depth + 1))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <aside className="w-64 bg-[#F3F3F5] border-r border-black/10 flex flex-col h-full flex-shrink-0 font-sans relative z-20">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-black/10 bg-white">
                <span className="text-xl font-medium text-[#030213] tracking-widest uppercase">MatrixGin</span>
                <FoundationStatusBadge />
            </div>

            {/* Scrollable Content */}
            <nav className="flex-1 overflow-y-auto scrollbar-none py-6 px-4 space-y-8">

                {filteredClusters.map(cluster => {
                    const isCollapsed = collapsedClusters.includes(cluster.id);
                    return (
                        <div key={cluster.id} className="animate-fade-in group/cluster">
                            {/* Cluster Header */}
                            <div
                                className="flex items-center justify-between px-2 mb-3 cursor-pointer select-none"
                                onClick={() => toggleCluster(cluster.id)}
                            >
                                <span className="text-[16px] font-medium text-[#030213] uppercase tracking-normal opacity-90 group-hover/cluster:opacity-100 transition-opacity">
                                    {cluster.title}
                                </span>
                                {isCollapsed ? (
                                    <ChevronRight className="w-3 h-3 text-[#717182] opacity-50" />
                                ) : (
                                    <ChevronDown className="w-3 h-3 text-[#717182] opacity-50" />
                                )}
                            </div>

                            {/* Cluster Items */}
                            {!isCollapsed && (
                                <div className="space-y-1">
                                    {cluster.items.map(item => renderMenuItem(item))}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className="h-10"></div>
            </nav>

            {/* Role Emulator Widget */}
            <RoleEmulator onRoleChange={setEmulatedRole} />

            {/* User Footer */}
            <div className="p-4 bg-white border-t border-black/10">
                {user && (
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-black/5 hover:bg-[#F3F3F5]/30 transition-all cursor-pointer mb-3">
                        <div className="w-9 h-9 rounded-full bg-[#F3F3F5] flex items-center justify-center text-[#717182]">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#030213] truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[11px] text-[#717182] font-medium truncate uppercase tracking-tight">{user.role}</p>
                        </div>
                        <Settings className="w-4 h-4 text-[#717182]" />
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full h-10 flex items-center justify-center gap-2 text-sm font-medium text-[#717182] hover:text-[#030213] transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Выйти из системы
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
