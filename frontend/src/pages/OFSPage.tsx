import { useState } from 'react';
import { Users, Building2, Network, UserPlus, GitBranch, Lightbulb, Bot, Briefcase } from 'lucide-react';
import OrgChart from '../features/ofs/components/OrgChart';
import DepartmentList from '../features/ofs/components/DepartmentList';
import HierarchyView from '../features/ofs/components/HierarchyView';
import PyramidView from '../features/ofs/components/PyramidView';
import TriangleView from '../features/ofs/components/TriangleView';
import IdeaChannels from '../features/ofs/components/IdeaChannels';
import RoleMatrixView from '../features/ofs/components/RoleMatrixView';
import RegistrationList from '../features/ofs/components/RegistrationList';

type Tab = 'orgchart' | 'departments' | 'hierarchy' | 'pyramid' | 'triangle' | 'roles' | 'ideas' | 'registration';

export default function OFSPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orgchart');

  const tabs = [
    { id: 'orgchart' as Tab, label: 'Org Chart', icon: Network },
    { id: 'departments' as Tab, label: 'Департаменты', icon: Building2 },
    { id: 'hierarchy' as Tab, label: '7-уровневая иерархия', icon: GitBranch },
    { id: 'pyramid' as Tab, label: 'Пирамида', icon: Users },
    { id: 'triangle' as Tab, label: 'Треугольник', icon: Users },
    { id: 'roles' as Tab, label: 'Матрица Ролей (МДР)', icon: Briefcase },
    { id: 'ideas' as Tab, label: 'Каналы идей', icon: Lightbulb },
    { id: 'registration' as Tab, label: 'Регистрация', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ОФС - Организационно-Функциональная Структура
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Управление организационной структурой компании
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                    transition-colors
                    ${isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'orgchart' && <OrgChart />}
        {activeTab === 'departments' && <DepartmentList />}
        {activeTab === 'hierarchy' && <HierarchyView />}
        {activeTab === 'pyramid' && <PyramidView />}
        {activeTab === 'triangle' && <TriangleView />}
        {activeTab === 'roles' && <RoleMatrixView />}
        {activeTab === 'ideas' && <IdeaChannels />}
        {activeTab === 'registration' && <RegistrationList />}
      </div>
    </div>
  );
}
