import { useState } from 'react';
import {
    useGetRoleMatrixQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useGetDepartmentsQuery,
    Role
} from '../api/ofsApi';
import { Plus, Edit2, Trash2, Search, Briefcase, BookOpen, Target, Award } from 'lucide-react';

export default function RoleMatrixView() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const { data: rolesData, isLoading: isRolesLoading } = useGetRoleMatrixQuery({
        department_id: selectedDepartment || undefined
    });
    const { data: departmentsData } = useGetDepartmentsQuery({});
    const [deleteRole] = useDeleteRoleMutation();

    const roles = rolesData?.data || [];
    const departments = departmentsData?.data || [];

    const filteredRoles = roles.filter(role =>
        role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить эту роль?')) {
            try {
                await deleteRole(id).unwrap();
            } catch (error) {
                console.error('Failed to delete role:', error);
            }
        }
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingRole(null);
        setIsModalOpen(true);
    };

    if (isRolesLoading) {
        return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Матрица Ролей (МДР)</h2>
                    <p className="text-gray-600 mt-1">Управление должностными инструкциями и компетенциями</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Создать роль
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Поиск роли..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg min-w-[200px]"
                >
                    <option value="">Все департаменты</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </select>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map(role => (
                    <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{role.role_name}</h3>
                                <span className="text-sm text-gray-500">
                                    {departments.find(d => d.id === role.department_id)?.name || 'Unknown Dept'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(role)}
                                    className="p-1 text-gray-400 hover:text-blue-600"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(role.id)}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            {role.purpose && (
                                <div className="flex gap-2 text-gray-600">
                                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p className="line-clamp-2">{role.purpose}</p>
                                </div>
                            )}

                            <div className="flex gap-2 text-gray-600">
                                <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p>Обязанностей: {role.responsibilities?.length || 0}</p>
                            </div>

                            <div className="flex gap-2 text-gray-600">
                                <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p>Компетенций: {Object.keys(role.required_competencies || {}).length}</p>
                            </div>

                            {role.documents && role.documents.length > 0 && (
                                <div className="flex gap-2 text-gray-600">
                                    <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <div className="flex flex-wrap gap-2">
                                        {role.documents.map((doc, idx) => (
                                            <a
                                                key={idx}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {doc.name || 'Документ'}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <RoleModal
                    role={editingRole}
                    departments={departments}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

function RoleModal({ role, departments, onClose }: { role: Role | null, departments: any[], onClose: () => void }) {
    const [formData, setFormData] = useState<Partial<Role>>(role || {
        role_name: '',
        department_id: '',
        purpose: '',
        responsibilities: [],
        required_competencies: {},
        expected_results: [],
        required_knowledge: [],
        required_skills: [],
        salary_min: 0,
        salary_max: 0,
        documents: []
    });

    const [createRole] = useCreateRoleMutation();
    const [updateRole] = useUpdateRoleMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (role) {
                await updateRole({ id: role.id, data: formData }).unwrap();
            } else {
                await createRole(formData).unwrap();
            }
            onClose();
        } catch (error) {
            console.error('Failed to save role:', error);
        }
    };

    const handleArrayInput = (field: keyof Role, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value.split('\n').filter(line => line.trim())
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-900">
                        {role ? 'Редактировать роль' : 'Создать новую роль'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Название роли</label>
                            <input
                                type="text"
                                required
                                value={formData.role_name}
                                onChange={e => setFormData({ ...formData, role_name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Департамент</label>
                            <select
                                required
                                value={formData.department_id}
                                onChange={e => setFormData({ ...formData, department_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Выберите департамент</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цель должности (Purpose)</label>
                        <textarea
                            value={formData.purpose || ''}
                            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Основная цель существования данной роли..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Обязанности (по одной на строку)</label>
                            <textarea
                                value={formData.responsibilities?.join('\n') || ''}
                                onChange={e => handleArrayInput('responsibilities', e.target.value)}
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="- Выполнение плана продаж&#10;- Ведение отчетности"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ожидаемые результаты (по одной на строку)</label>
                            <textarea
                                value={formData.expected_results?.join('\n') || ''}
                                onChange={e => handleArrayInput('expected_results', e.target.value)}
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="- Прирост выручки на 10%&#10;- Снижение оттока клиентов"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Необходимые знания</label>
                            <textarea
                                value={formData.required_knowledge?.join('\n') || ''}
                                onChange={e => handleArrayInput('required_knowledge', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Необходимые навыки</label>
                            <textarea
                                value={formData.required_skills?.join('\n') || ''}
                                onChange={e => handleArrayInput('required_skills', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Зарплата (Min)</label>
                            <input
                                type="number"
                                value={formData.salary_min || ''}
                                onChange={e => setFormData({ ...formData, salary_min: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Зарплата (Max)</label>
                            <input
                                type="number"
                                value={formData.salary_max || ''}
                                onChange={e => setFormData({ ...formData, salary_max: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Документы и ссылки</label>
                        <div className="space-y-3">
                            {(formData.documents || []).map((doc, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <input
                                        type="text"
                                        placeholder="Название"
                                        value={doc.name}
                                        onChange={e => {
                                            const newDocs = [...(formData.documents || [])];
                                            newDocs[index].name = e.target.value;
                                            setFormData({ ...formData, documents: newDocs });
                                        }}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL"
                                        value={doc.url}
                                        onChange={e => {
                                            const newDocs = [...(formData.documents || [])];
                                            newDocs[index].url = e.target.value;
                                            setFormData({ ...formData, documents: newDocs });
                                        }}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newDocs = formData.documents?.filter((_, i) => i !== index);
                                            setFormData({ ...formData, documents: newDocs });
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    documents: [...(formData.documents || []), { name: '', url: '', type: 'link' }]
                                })}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Добавить ссылку
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {role ? 'Сохранить изменения' : 'Создать роль'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
