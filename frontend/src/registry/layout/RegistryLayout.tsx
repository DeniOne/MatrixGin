import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Shield, Lock, Database, LogOut } from 'lucide-react';
import { REGISTRY_ENTITIES, EntityConfig } from '../config/registryEntities';
import { REGISTRY_LABELS_RU, REGISTRY_DOMAINS_RU, UI_TEXT } from '../config/registryLabels.ru';

// Group entities by domain
const groupedEntities = REGISTRY_ENTITIES.reduce((acc, entity) => {
    if (!acc[entity.domain]) acc[entity.domain] = [];
    acc[entity.domain].push(entity);
    return acc;
}, {} as Record<string, EntityConfig[]>);

const RegistryLayout: React.FC = () => {
    // RBAC GUARD (Mock check - in prod rely on real auth context)
    const hasAccess = true; // Force true for now

    if (!hasAccess) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <Lock className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold">{UI_TEXT.ACCESS_DENIED}</h1>
                    <p className="text-gray-400 mt-2">{UI_TEXT.ACCESS_DENIED_HINT}</p>
                    <Link to="/" className="mt-6 inline-block text-blue-400 hover:underline">{UI_TEXT.RETURN_DASHBOARD}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
            {/* ISOLATED SIDEBAR */}
            <aside className="w-64 flex flex-col border-r border-slate-800 bg-slate-900">
                <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                        <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-wide text-white">{UI_TEXT.APP_TITLE}</h1>
                        <span className="text-[10px] text-indigo-400 font-mono uppercase">{UI_TEXT.APP_SUBTITLE}</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                    {Object.entries(groupedEntities).map(([domain, entities]) => (
                        <div key={domain}>
                            <h3 className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider pl-2">
                                {REGISTRY_DOMAINS_RU[domain]}
                            </h3>
                            <ul className="space-y-1">
                                {entities.map(entity => (
                                    <li key={entity.id}>
                                        <NavLink
                                            to={`/registry/${entity.id}`}
                                            className={({ isActive }) => `
                                                block px-3 py-1.5 text-xs rounded-md transition-colors
                                                ${isActive
                                                    ? 'bg-indigo-500/10 text-indigo-300 border-l-2 border-indigo-500'
                                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                                }
                                            `}
                                        >
                                            {REGISTRY_LABELS_RU[entity.id]?.label || entity.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 bg-red-950/20 rounded border border-red-900/50">
                        <Shield className="w-3 h-3" />
                        <span className="font-mono">{UI_TEXT.ADMIN_MODE}</span>
                    </div>
                    <Link to="/" className="mt-3 flex items-center gap-2 px-3 text-xs text-slate-500 hover:text-white transition-colors">
                        <LogOut className="w-3 h-3" />
                        {UI_TEXT.EXIT}
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-hidden flex flex-col bg-slate-950">
                <header className="h-12 border-b border-slate-800 flex items-center px-6 bg-slate-900/50">
                    <div className="flex-1">
                        {/* Breadcrumbs or Context Header could go here */}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                        <span>{UI_TEXT.ENV_PROD}</span>
                        <span>|</span>
                        <span>{UI_TEXT.USER_ADMIN}</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default RegistryLayout;
