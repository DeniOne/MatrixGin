import React, { useState } from 'react';
import {
    BookOpen,
    Search,
    ChevronRight,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    Share2
} from 'lucide-react';

interface ScriptNode {
    id: string;
    text: string;
    options?: { label: string; nextId: string }[];
    tips?: string[];
}

interface Playbook {
    id: string;
    title: string;
    category: 'COLD_CALL' | 'MEETING' | 'OBJECTIONS' | 'CLOSING';
    description: string;
    scripts: Record<string, ScriptNode>;
    startNodeId: string;
}

const SalesPlaybookPage: React.FC = () => {
    const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const playbooks: Playbook[] = [
        {
            id: '1',
            title: 'Холодный звонок: Фотостудия',
            category: 'COLD_CALL',
            description: 'Скрипт первого контакта с потенциальным корпоративным клиентом.',
            startNodeId: 'start',
            scripts: {
                'start': {
                    id: 'start',
                    text: 'Добрый день! Меня зовут [Имя], я представляю фотостудию Photomatrix. Подскажите, вы сейчас занимаетесь организацией съемок для каталога?',
                    options: [
                        { label: 'Да, занимаемся', nextId: 'yes_interest' },
                        { label: 'Нет, нам не нужно', nextId: 'no_need' },
                        { label: 'У нас свой фотограф', nextId: 'have_photographer' }
                    ],
                    tips: ['Улыбайтесь во время разговора', 'Говорите уверенно, но не агрессивно']
                },
                'yes_interest': {
                    id: 'yes_interest',
                    text: 'Отлично! Мы специализируемся на съемках для маркетплейсов и можем предложить тестовую съемку 5 артикулов бесплатно. Как вы на это смотрите?',
                    options: [
                        { label: 'Интересно, расскажите', nextId: 'offer_details' },
                        { label: 'Нет времени', nextId: 'send_info' }
                    ]
                },
                'no_need': {
                    id: 'no_need',
                    text: 'Понял вас. А планируете ли вы обновление контента в ближайшие 2-3 месяца? Мы могли бы просто прислать портфолио на будущее.',
                    options: [
                        { label: 'Присылайте', nextId: 'get_email' },
                        { label: 'Нет, не интересно', nextId: 'end_call' }
                    ]
                },
                'have_photographer': {
                    id: 'have_photographer',
                    text: 'Это здорово, что у вас уже налажен процесс! Мы не предлагаем менять подрядчика прямо сейчас. Просто хотим показать наш уровень качества на бесплатном тесте. Вдруг пригодится как резервный вариант?',
                    options: [
                        { label: 'Ну давайте попробуем', nextId: 'offer_details' },
                        { label: 'Нет, спасибо', nextId: 'end_call' }
                    ]
                },
                'offer_details': {
                    id: 'offer_details',
                    text: 'Супер! Давайте я запишу вас на удобное время. Когда вам будет удобно обсудить детали с продюсером?',
                    options: [],
                    tips: ['Предложите 2 варианта времени на выбор']
                },
                'get_email': {
                    id: 'get_email',
                    text: 'Хорошо, диктуйте почту. Я отправлю презентацию и наши кейсы. [Записать почту]. Спасибо, хорошего дня!',
                    options: []
                },
                'send_info': {
                    id: 'send_info',
                    text: 'Конечно, давайте я отправлю вам презентацию на почту или в мессенджер, а вы посмотрите, когда будет минутка. Какой канал связи удобнее?',
                    options: []
                },
                'end_call': {
                    id: 'end_call',
                    text: 'Хорошо, спасибо за уделенное время. Если что-то изменится — мы всегда на связи. До свидания!',
                    options: []
                }
            }
        },
        {
            id: '2',
            title: 'Обработка возражения "Дорого"',
            category: 'OBJECTIONS',
            description: 'Аргументация стоимости услуг и ценности для клиента.',
            startNodeId: 'start',
            scripts: {
                'start': {
                    id: 'start',
                    text: 'Клиент говорит: "У вас дорого, я нашел дешевле".',
                    options: [
                        { label: 'Техника "Именно поэтому"', nextId: 'technique_1' },
                        { label: 'Сравнение по пунктам', nextId: 'technique_2' }
                    ]
                },
                'technique_1': {
                    id: 'technique_1',
                    text: 'Именно поэтому я хочу предложить вам тестовую съемку. Вы увидите, что наше качество позволяет продавать товар дороже и быстрее, что в итоге окупает затраты на фото.',
                    options: []
                },
                'technique_2': {
                    id: 'technique_2',
                    text: 'Давайте сравним, что входит в эту цену. У нас это: студия, модель, визажист, ретушь и передача прав. А что входит в цену конкурента?',
                    options: []
                }
            }
        }
    ];

    const filteredPlaybooks = playbooks.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePlaybookSelect = (playbook: Playbook) => {
        setActivePlaybook(playbook);
        setCurrentNodeId(playbook.startNodeId);
    };

    const handleOptionClick = (nextId: string) => {
        setCurrentNodeId(nextId);
    };

    const resetPlaybook = () => {
        if (activePlaybook) {
            setCurrentNodeId(activePlaybook.startNodeId);
        }
    };

    const currentNode = activePlaybook && currentNodeId ? activePlaybook.scripts[currentNodeId] : null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-medium text-gray-900 flex items-center">
                        <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
                        Плейбуки и Скрипты
                    </h1>
                    <p className="text-[#717182] mt-1">Библиотека сценариев продаж и работы с клиентами</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                {/* Sidebar List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#717182] w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Поиск скрипта..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {filteredPlaybooks.map(playbook => (
                            <div
                                key={playbook.id}
                                onClick={() => handlePlaybookSelect(playbook)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${activePlaybook?.id === playbook.id
                                    ? 'bg-blue-50 border border-blue-200'
                                    : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${playbook.category === 'COLD_CALL' ? 'bg-orange-100 text-orange-700' :
                                        playbook.category === 'OBJECTIONS' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {playbook.category === 'COLD_CALL' ? 'Холодный звонок' :
                                            playbook.category === 'OBJECTIONS' ? 'Возражения' : playbook.category}
                                    </span>
                                </div>
                                <h3 className={`font-medium ${activePlaybook?.id === playbook.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                    {playbook.title}
                                </h3>
                                <p className="text-xs text-[#717182] mt-1 line-clamp-2">{playbook.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Script Viewer */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    {activePlaybook && currentNode ? (
                        <>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900">{activePlaybook.title}</h2>
                                    <p className="text-sm text-[#717182]">Шаг: {currentNodeId === 'start' ? 'Начало разговора' : 'Продолжение'}</p>
                                </div>
                                <button
                                    onClick={resetPlaybook}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Начать заново
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                {/* Tips */}
                                {currentNode.tips && currentNode.tips.length > 0 && (
                                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Советы эксперта
                                        </h4>
                                        <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                            {currentNode.tips.map((tip, idx) => (
                                                <li key={idx}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Main Script Text */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8 relative">
                                    <div className="absolute -left-3 top-6 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[#030213] text-xs font-medium border-4 border-white shadow-sm">
                                        You
                                    </div>
                                    <p className="text-lg text-gray-800 leading-relaxed">
                                        {currentNode.text}
                                    </p>
                                    <div className="mt-4 flex items-center space-x-4 border-t border-gray-100 pt-4">
                                        <button className="text-[#717182] hover:text-green-600 transition-colors">
                                            <ThumbsUp className="w-5 h-5" />
                                        </button>
                                        <button className="text-[#717182] hover:text-red-600 transition-colors">
                                            <ThumbsDown className="w-5 h-5" />
                                        </button>
                                        <button className="text-[#717182] hover:text-blue-600 transition-colors ml-auto">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Options */}
                                {currentNode.options && currentNode.options.length > 0 ? (
                                    <div>
                                        <h3 className="text-sm font-medium text-[#717182] uppercase tracking-wider mb-4">
                                            Варианты ответа клиента:
                                        </h3>
                                        <div className="grid gap-3">
                                            {currentNode.options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(option.nextId)}
                                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg transition-all group text-left"
                                                >
                                                    <span className="font-medium text-gray-700 group-hover:text-blue-700">
                                                        {option.label}
                                                    </span>
                                                    <ChevronRight className="w-5 h-5 text-[#717182] group-hover:text-blue-500" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-green-50 rounded-lg border border-green-100">
                                        <p className="text-green-800 font-medium">Сценарий завершен</p>
                                        <button
                                            onClick={resetPlaybook}
                                            className="mt-4 bg-green-600 text-[#030213] px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Новый диалог
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#717182] p-8 text-center">
                            <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Выберите плейбук</h3>
                            <p className="max-w-md">
                                Выберите сценарий из списка слева, чтобы начать тренировку или работу с клиентом.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesPlaybookPage;
