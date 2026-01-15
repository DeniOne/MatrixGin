import React, { useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface Shift {
  id: number;
  date: string;
  time: string;
  location: string;
  mentor: string;
  type: 'DEMO' | 'SUPERVISED' | 'INDEPENDENT';
  spots: number;
  filled: number;
  status: 'OPEN' | 'FULL' | 'COMPLETED';
}

const PhotoShiftsPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'DEMO' | 'SUPERVISED' | 'INDEPENDENT'>('ALL');

  const shifts: Shift[] = [
    {
      id: 1,
      date: '25.11.2023',
      time: '10:00 - 14:00',
      location: 'Студия "Лофт"',
      mentor: 'Александр Иванов',
      type: 'DEMO',
      spots: 10,
      filled: 8,
      status: 'OPEN'
    },
    {
      id: 2,
      date: '26.11.2023',
      time: '15:00 - 19:00',
      location: 'Студия "Циклорама"',
      mentor: 'Мария Петрова',
      type: 'SUPERVISED',
      spots: 3,
      filled: 3,
      status: 'FULL'
    },
    {
      id: 3,
      date: '28.11.2023',
      time: '12:00 - 16:00',
      location: 'Студия "Арт"',
      mentor: '—',
      type: 'INDEPENDENT',
      spots: 1,
      filled: 0,
      status: 'OPEN'
    }
  ];

  const filteredShifts = filter === 'ALL' ? shifts : shifts.filter(s => s.type === filter);

  const getTypeLabel = (type: Shift['type']) => {
    switch (type) {
      case 'DEMO': return 'Демо-смена';
      case 'SUPERVISED': return 'Под присмотром';
      case 'INDEPENDENT': return 'Самостоятельная';
    }
  };

  const getTypeColor = (type: Shift['type']) => {
    switch (type) {
      case 'DEMO': return 'bg-blue-100 text-blue-800';
      case 'SUPERVISED': return 'bg-purple-100 text-purple-800';
      case 'INDEPENDENT': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
            <Calendar className="w-8 h-8 mr-3 text-blue-600" />
            Практические смены
          </h1>
          <p className="text-gray-600">
            Записывайтесь на практику для отработки навыков в реальных условиях
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Мое расписание
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
        >
          Все смены
        </button>
        <button
          onClick={() => setFilter('DEMO')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'DEMO' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
        >
          Демо-смены
        </button>
        <button
          onClick={() => setFilter('SUPERVISED')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'SUPERVISED' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
        >
          Под присмотром
        </button>
        <button
          onClick={() => setFilter('INDEPENDENT')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'INDEPENDENT' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
        >
          Самостоятельные
        </button>
      </div>

      {/* Shifts List */}
      <div className="grid gap-4">
        {filteredShifts.map(shift => (
          <div key={shift.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-start space-x-4 mb-4 md:mb-0">
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-3 min-w-[80px] border border-gray-100">
                  <span className="text-2xl font-bold text-gray-900">{shift.date.split('.')[0]}</span>
                  <span className="text-xs text-gray-500 uppercase">нояб</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getTypeColor(shift.type)}`}>
                      {getTypeLabel(shift.type)}
                    </span>
                    {shift.status === 'FULL' && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
                        Мест нет
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{shift.location}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {shift.time}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1.5" />
                      {shift.mentor}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {shift.filled} / {shift.spots} мест
                  </p>
                  <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${shift.status === 'FULL' ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${(shift.filled / shift.spots) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  disabled={shift.status === 'FULL'}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${shift.status === 'FULL'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {shift.status === 'FULL' ? 'Заполнен' : 'Записаться'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoShiftsPage;
