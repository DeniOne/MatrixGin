import React from 'react';
import { useGetEmployeesQuery } from '../features/ofs/api/ofsApi';
import { Users, Building2, Briefcase, Loader2 } from 'lucide-react';

const EmployeesPage: React.FC = () => {
    const { data, isLoading, error } = useGetEmployeesQuery({});

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-gray-500 animate-pulse uppercase tracking-widest font-bold text-xs">Загрузка данных...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center border border-dashed border-gray-800 rounded-3xl m-6">
                <p className="text-gray-500">Не удалось загрузить список сотрудников.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-4 tracking-tight">
                    <Users className="w-10 h-10 text-indigo-500" />
                    Сотрудники
                </h1>
                <p className="text-gray-400 font-light">
                    Полный список персонала организации с указанием должностей и департаментов.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.data.map(emp => (
                    <div key={emp.id} className="group bg-gray-900 border border-gray-800 p-6 rounded-3xl hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/5">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-full flex items-center justify-center text-white font-black text-2xl uppercase shadow-xl ring-4 ring-gray-950 group-hover:scale-105 transition-transform">
                                {emp.first_name[0]}{emp.last_name[0]}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                                    {emp.first_name} {emp.last_name}
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center justify-center gap-1.5">
                                        <Briefcase className="w-3 h-3 text-indigo-400" />
                                        {emp.position || 'No Position'}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold flex items-center justify-center gap-1.5">
                                        <Building2 className="w-3 h-3 text-gray-600" />
                                        {emp.department_name || 'No Department'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeesPage;
