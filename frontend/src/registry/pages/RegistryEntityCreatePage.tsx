import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { REGISTRY_ENTITIES } from '../config/registryEntities';
import { REGISTRY_LABELS_RU, UI_TEXT } from '../config/registryLabels.ru';
import { useCreateEntityMutation } from '../api/registryApi';
import RegistryForm from '../components/RegistryForm';
import { CreateEntityPayload } from '../types';

const RegistryEntityCreatePage: React.FC = () => {
    const { entityType } = useParams<{ entityType: string }>();
    const navigate = useNavigate();
    const [createEntity, { isLoading, error }] = useCreateEntityMutation();

    const config = REGISTRY_ENTITIES.find(e => e.id === entityType);
    const ruLabel = entityType ? REGISTRY_LABELS_RU[entityType as keyof typeof REGISTRY_LABELS_RU] : undefined;

    if (!config || !ruLabel) return <div>Invalid Entity Type</div>;

    const handleSubmit = async (payload: any) => {
        try {
            const result = await createEntity({
                type: entityType!,
                ...payload as CreateEntityPayload
            }).unwrap();

            navigate(`/registry/${entityType}/${result.id}`);
        } catch (err) {
            console.error('Failed to create entity', err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                to={`/registry/${entityType}`}
                className="inline-flex items-center text-sm text-slate-500 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {UI_TEXT.BACK_TO_LIST}
            </Link>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
                <h1 className="text-2xl font-bold text-white mb-2">{UI_TEXT.CREATE_HEADER}: {ruLabel.label}</h1>
                <p className="text-slate-500 text-sm mb-8">
                    {UI_TEXT.CREATE_DRAFT_NOTE} <span className="text-yellow-500 font-bold uppercase text-xs">{UI_TEXT.STATUS_DRAFT}</span>.
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div>
                            <p className="font-bold">Ошибка</p>
                            <p className="text-xs mt-1 opacity-80">
                                {(error as any)?.data?.message || 'Creation failed.'}
                            </p>
                        </div>
                    </div>
                )}

                <RegistryForm
                    onSubmit={handleSubmit}
                    isSubmitting={isLoading}
                />
            </div>
        </div>
    );
};

export default RegistryEntityCreatePage;
