import { useState } from 'react';
import { useGetIdeasQuery, useSubmitIdeaMutation } from '../api/ofsApi';
import { Lightbulb, TrendingUp, Wrench, GraduationCap, Plus } from 'lucide-react';

const CHANNEL_CONFIG = {
  strategic: {
    label: 'Стратегический',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Глобальные идеи: новые продукты, рынки, стратегии → Совет Учредителей → Исп. Директор',
  },
  tactical: {
    label: 'Тактический',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Локальные улучшения процессов → Система Непрерывного совершенствования',
  },
  mentoring: {
    label: 'Менторский',
    icon: GraduationCap,
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Развитие мышления руководства → Коучинг и наставничество',
  },
};

const STATUS_COLORS = {
  submitted: 'bg-gray-100 text-gray-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  implemented: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function IdeaChannels() {
  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const { data, isLoading, refetch } = useGetIdeasQuery({
    channel_type: channelFilter || undefined,
    status: statusFilter || undefined,
  });

  const ideas = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium text-gray-900">Каналы внедрения идей</h2>
          <p className="text-gray-600 mt-1">
            3 конституционных канала для предложений
          </p>
        </div>
        <button
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-[#030213] rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Подать идею
        </button>
      </div>

      {/* Channel Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(CHANNEL_CONFIG).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <div key={type} className={`rounded-lg border-2 p-4 ${config.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5" />
                <h3 className="font-medium">{config.label}</h3>
              </div>
              <p className="text-xs">{config.description}</p>
            </div>
          );
        })}
      </div>

      {/* Submit Form */}
      {showSubmitForm && (
        <SubmitIdeaForm
          onClose={() => setShowSubmitForm(false)}
          onSuccess={() => {
            setShowSubmitForm(false);
            refetch();
          }}
        />
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Канал
            </label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Все каналы</option>
              <option value="strategic">Стратегический</option>
              <option value="tactical">Тактический</option>
              <option value="mentoring">Менторский</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Все статусы</option>
              <option value="submitted">Подано</option>
              <option value="under_review">На рассмотрении</option>
              <option value="approved">Одобрено</option>
              <option value="implemented">Внедрено</option>
              <option value="rejected">Отклонено</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ideas List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-[#717182]">Загрузка...</div>
        ) : ideas.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {ideas.map((idea: any) => {
              const config = CHANNEL_CONFIG[idea.channel_type as keyof typeof CHANNEL_CONFIG];
              const Icon = config?.icon || Lightbulb;

              return (
                <div key={idea.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${config?.color || 'bg-gray-100'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{idea.title}</h3>
                        {idea.description && (
                          <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-[#717182]">
                          <span>Автор: {idea.first_name} {idea.last_name}</span>
                          <span>•</span>
                          <span>{new Date(idea.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${STATUS_COLORS[idea.status as keyof typeof STATUS_COLORS]}`}>
                        {idea.status}
                      </span>
                      {idea.priority && (
                        <span className={`px-2 py-1 text-xs rounded ${
                          idea.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          idea.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          idea.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {idea.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-[#717182]">Нет идей</div>
        )}
      </div>
    </div>
  );
}

function SubmitIdeaForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [channelType, setChannelType] = useState<'strategic' | 'tactical' | 'mentoring'>('tactical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const [submitIdea, { isLoading }] = useSubmitIdeaMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitIdea({
        channel_type: channelType,
        title,
        description,
        priority,
        submitted_by: 'current-user-id', // TODO: Get from auth
      }).unwrap();
      onSuccess();
    } catch (err) {
      console.error('Submit idea error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="font-medium text-gray-900">Подать идею</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Канал</label>
        <select
          value={channelType}
          onChange={(e) => setChannelType(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="strategic">Стратегический</option>
          <option value="tactical">Тактический</option>
          <option value="mentoring">Менторский</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
          <option value="critical">Критический</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-[#030213] rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </form>
  );
}
