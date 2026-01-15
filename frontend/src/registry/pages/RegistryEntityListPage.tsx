import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { REGISTRY_ENTITIES } from '../config/registryEntities';
import { REGISTRY_LABELS_RU, REGISTRY_DOMAINS_RU, UI_TEXT } from '../config/registryLabels.ru';
import { useGetEntitiesQuery } from '../api/registryApi';
import RegistryTable from '../components/RegistryTable';

const RegistryEntityListPage: React.FC = () => {
    const { entityType } = useParams<{ entityType: string }>();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    // Validate Entity Type
    const config = REGISTRY_ENTITIES.find(e => e.id === entityType);
    const ruLabel = entityType ? REGISTRY_LABELS_RU[entityType as keyof typeof REGISTRY_LABELS_RU] : undefined;

    // API Query
    const { data, isLoading } = useGetEntitiesQuery(
        { type: entityType || '', search },
        { skip: !config }
    );

    if (!config || !ruLabel) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <AlertTriangle className="w-10 h-10 mb-4 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-300">{UI_TEXT.NOT_FOUND}</h2>
                <Link to="/registry" className="mt-4 text-indigo-400 hover:underline">{UI_TEXT.RETURN_DASHBOARD}</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{ruLabel.label}</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {REGISTRY_DOMAINS_RU[config.domain]}: <span className="text-indigo-400 text-xs">{ruLabel.desc}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-sm text-slate-200 w-64 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all"
                        />
                    </div>

                    <Link
                        to={`/registry/${entityType}/new`}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-bold text-sm uppercase tracking-wide shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        {UI_TEXT.CREATE_NEW}
                    </Link>
                </div>
            </div>

            {/* DATA TABLE */}
            <RegistryTable
                data={data?.data}
                isLoading={isLoading}
                onRowClick={(id) => navigate(`/registry/${entityType}/${id}`)}
            />
        </div>
    );
};

export default RegistryEntityListPage;
