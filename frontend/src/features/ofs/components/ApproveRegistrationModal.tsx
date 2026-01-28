import { useState } from 'react';
import { X, CheckCircle2, MapPin, Briefcase, Building2, AlertCircle } from 'lucide-react';
import { useGetDepartmentsQuery, useGetLocationsQuery } from '../api/ofsApi';
import { useApproveRegistrationMutation } from '../api/registrationApi';

interface Props {
    registration: {
        id: string;
        first_name: string;
        last_name: string;
        position: string;
        department_id?: string;
        location_id?: string;
        invited_by?: string;
    };
    onClose: () => void;
    onSuccess: () => void;
}

export default function ApproveRegistrationModal({ registration, onClose, onSuccess }: Props) {
    const [departmentId, setDepartmentId] = useState(registration.department_id || '');
    const [locationId, setLocationId] = useState(registration.location_id || '');
    const [error, setError] = useState<string | null>(null);

    const { data: departmentsData, isLoading: deptsLoading } = useGetDepartmentsQuery({ format: 'flat' });
    const { data: locationsData, isLoading: locsLoading } = useGetLocationsQuery();
    const [approve, { isLoading: isApproving }] = useApproveRegistrationMutation();

    const isSelfRegistration = !registration.invited_by;
    const canSubmit = departmentId && locationId;

    const handleApprove = async () => {
        if (!canSubmit) {
            setError('Необходимо выбрать подразделение и локацию');
            return;
        }

        try {
            setError(null);
            await approve({
                id: registration.id,
                departmentId: departmentId,
                locationId: locationId,
            }).unwrap();
            onSuccess();
        } catch (err: any) {
            console.error('Failed to approve registration:', err);
            setError(err.data?.error?.message || 'Ошибка при одобрении регистрации. Возможно, данные некорректны.');
        }
    };

    return (
        <div className="fixed inset-0 bg-[#030213]/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 transform transition-all scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Одобрение регистрации</h2>
                            <p className="text-blue-100 text-sm mt-0.5">
                                {registration.last_name} {registration.first_name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {isSelfRegistration && (
                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p><strong>Саморегистрация:</strong> Необходимо вручную назначить оргструктуру перед одобрением.</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Position Display */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Указанная должность</p>
                                <p className="text-gray-900 font-bold">{registration.position}</p>
                            </div>
                        </div>

                        {/* Department Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                <Building2 className="w-4 h-4 text-blue-500" />
                                Подразделение <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                disabled={deptsLoading}
                                className={`w-full px-4 py-3 bg-white border ${!departmentId ? 'border-amber-200 bg-amber-50/20' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-gray-900 disabled:opacity-50`}
                            >
                                <option value="">Выберите подразделение...</option>
                                {departmentsData?.data?.map((dept: any) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                Локация <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={locationId}
                                onChange={(e) => setLocationId(e.target.value)}
                                disabled={locsLoading}
                                className={`w-full px-4 py-3 bg-white border ${!locationId ? 'border-amber-200 bg-amber-50/20' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-gray-900 disabled:opacity-50`}
                            >
                                <option value="">Выберите локацию...</option>
                                {locationsData?.data?.map((loc: any) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name} {loc.city ? `(${loc.city})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 text-xs text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <strong>Процесс:</strong> После подтверждения будет создан аккаунт сотрудника, и на почту <strong>{registration.id && 'пользователя'}</strong> придет ссылка для входа.
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={isApproving || !canSubmit}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                    >
                        {isApproving ? 'Загрузка...' : 'Подтвердить и одобрить'}
                    </button>
                </div>
            </div>
        </div>
    );
}
