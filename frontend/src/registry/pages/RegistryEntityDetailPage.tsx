import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Settings, History, Lock } from 'lucide-react';
import { REGISTRY_ENTITIES } from '../config/registryEntities';
import { REGISTRY_LABELS_RU, UI_TEXT } from '../config/registryLabels.ru';
import {
    useGetEntityQuery,
    useUpdateEntityMutation,
    useExecuteTransitionMutation,
    useGetAuditQuery
} from '../api/registryApi';
import RegistryForm from '../components/RegistryForm';
import LifecyclePanel from '../components/LifecyclePanel';
import AuditLog from '../components/AuditLog';
import LifecycleBadge from '../components/LifecycleBadge';
import { CreateEntityPayload, UpdateEntityPayload } from '../types';

type Tab = 'general' | 'lifecycle' | 'audit';

const RegistryEntityDetailPage: React.FC = () => {
    const { entityType, id } = useParams<{ entityType: string; id: string }>();
    const [activeTab, setActiveTab] = useState<Tab>('general');

    const config = REGISTRY_ENTITIES.find(e => e.id === entityType);
    const ruLabel = entityType ? REGISTRY_LABELS_RU[entityType as keyof typeof REGISTRY_LABELS_RU] : undefined;

    // Queries
    const { data: entity, isLoading: isEntityLoading } = useGetEntityQuery({ type: entityType!, id: id! }, { skip: !config || !id });
    const { data: auditLogs, isLoading: isAuditLoading } = useGetAuditQuery({ type: entityType!, id: id! }, { skip: !config || !id || activeTab !== 'audit' });

    // Mutations
    const [updateEntity, { isLoading: isUpdating }] = useUpdateEntityMutation();
    const [executeTransition, { isLoading: isTransitioning }] = useExecuteTransitionMutation();

    if (!config || !id || !ruLabel) return <div>Invalid Route</div>;
    if (isEntityLoading) return <div className="p-8 text-slate-500 animate-pulse">{UI_TEXT.LOADING}</div>;
    if (!entity) return <div>{UI_TEXT.NOT_FOUND}</div>;

    const handleUpdate = async (payload: CreateEntityPayload | UpdateEntityPayload) => {
        try {
            await updateEntity({
                type: entityType!,
                id,
                ...(payload as UpdateEntityPayload)
            }).unwrap();
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    const handleTransition = async (action: 'activate' | 'archive') => {
        try {
            await executeTransition({ type: entityType!, id, action }).unwrap();
        } catch (err) {
            console.error('Transition failed', err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="mb-8">
                <Link to={`/registry/${entityType}`} className="inline-flex items-center text-xs text-slate-500 hover:text-white mb-4 transition-colors">
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    {UI_TEXT.BACK_TO_LIST}
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white tracking-tight">{entity.name}</h1>
                            <LifecycleBadge status={entity.lifecycle_status} />
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                            <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {entity.code}
                            </span>
                            <span className="text-slate-700">|</span>
                            <span>ID: {entity.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-1 border-b border-slate-800 mb-8">
                {[
                    { id: 'general', label: UI_TEXT.TAB_GENERAL, icon: FileText },
                    { id: 'lifecycle', label: UI_TEXT.TAB_LIFECYCLE, icon: Settings },
                    { id: 'audit', label: UI_TEXT.TAB_AUDIT, icon: History },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`
                            flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium transition-colors
                            ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-800'
                            }
                        `}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="min-h-[400px]">
                {activeTab === 'general' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                        <RegistryForm
                            initialData={entity}
                            onSubmit={handleUpdate}
                            isSubmitting={isUpdating}
                        />
                    </div>
                )}

                {activeTab === 'lifecycle' && (
                    <div className="max-w-2xl text-slate-300">
                        <div className="mb-6 p-4 bg-slate-900/50 rounded border border-slate-800 text-sm">
                            <h4 className="font-bold text-slate-200 mb-2">{UI_TEXT.LIFECYCLE_RULES_TITLE}</h4>
                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                                <li>{UI_TEXT.LIFECYCLE_RULE_1}</li>
                                <li>{UI_TEXT.LIFECYCLE_RULE_2}</li>
                                <li>{UI_TEXT.LIFECYCLE_RULE_3}</li>
                            </ul>
                        </div>
                        <LifecyclePanel
                            status={entity.lifecycle_status}
                            onActivate={() => handleTransition('activate')}
                            onArchive={() => handleTransition('archive')}
                            isLoading={isTransitioning}
                        />
                    </div>
                )}

                {activeTab === 'audit' && (
                    <AuditLog
                        logs={auditLogs?.data}
                        isLoading={isAuditLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default RegistryEntityDetailPage;
