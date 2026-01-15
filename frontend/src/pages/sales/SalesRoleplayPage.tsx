import React, { useState, useRef, useEffect } from 'react';
import {
    Mic,
    Square,
    Play,
    RotateCcw,
    MessageSquare,
    User,
    Bot,
    Award,
    AlertCircle
} from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

interface Scenario {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    duration: string;
}

const SalesRoleplayPage: React.FC = () => {
    const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scenarios: Scenario[] = [
        { id: '1', title: 'Продажа абонемента', difficulty: 'Easy', description: 'Клиент хочет купить абонемент, но сомневается в цене.', duration: '5 мин' },
        { id: '2', title: 'Недовольный клиент', difficulty: 'Hard', description: 'Клиент недоволен качеством ретуши. Ваша задача - уладить конфликт.', duration: '10 мин' },
        { id: '3', title: 'Кросс-продажа', difficulty: 'Medium', description: 'Предложите клиенту дополнительные услуги (визажист, стилист) при бронировании.', duration: '7 мин' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startScenario = (scenario: Scenario) => {
        setActiveScenario(scenario);
        setMessages([
            {
                id: '1',
                sender: 'bot',
                text: 'Здравствуйте! Я видел у вас акцию на абонементы, но мне кажется, это все равно дороговато...',
                timestamp: new Date()
            }
        ]);
        setFeedback(null);
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop recording simulation
            setIsRecording(false);
            // Simulate processing and user message
            const newMessage: Message = {
                id: Date.now().toString(),
                sender: 'user',
                text: 'Понимаю ваши сомнения. Но давайте посчитаем стоимость одного часа в абонементе...',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newMessage]);

            // Simulate bot response after delay
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    text: 'Хм, ну если считать по часам, то выходит выгоднее. А есть рассрочка?',
                    timestamp: new Date()
                }]);
            }, 1500);

        } else {
            setIsRecording(true);
        }
    };

    const finishSession = () => {
        setFeedback('Отличная работа! Вы использовали технику присоединения и правильно аргументировали выгоду. Рекомендация: старайтесь делать паузы чуть короче.');
        setActiveScenario(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="w-8 h-8 mr-3 text-pink-600" />
                    Арена Ролевых Игр
                </h1>
                <p className="text-gray-500 mt-1">Тренируйте навыки переговоров с AI-симулятором</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                {/* Scenarios List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-900">Сценарии</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {scenarios.map(scenario => (
                            <div
                                key={scenario.id}
                                onClick={() => startScenario(scenario)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer ${activeScenario?.id === scenario.id
                                    ? 'border-pink-500 bg-pink-50 shadow-sm'
                                    : 'border-gray-200 hover:border-pink-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900">{scenario.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${scenario.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                        scenario.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {scenario.difficulty}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                                <div className="flex items-center text-xs text-gray-400">
                                    <Play className="w-3 h-3 mr-1" />
                                    {scenario.duration}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simulation Area */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
                    {activeScenario ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
                                <div>
                                    <h3 className="font-bold text-gray-900">{activeScenario.title}</h3>
                                    <p className="text-xs text-green-600 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Симуляция активна
                                    </p>
                                </div>
                                <button
                                    onClick={finishSession}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                >
                                    Завершить
                                </button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 ml-3' : 'bg-pink-100 mr-3'
                                                }`}>
                                                {msg.sender === 'user' ? <User className="w-5 h-5 text-blue-600" /> : <Bot className="w-5 h-5 text-pink-600" />}
                                            </div>
                                            <div className={`p-4 rounded-2xl shadow-sm ${msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                                }`}>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                                <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                                                    }`}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Controls */}
                            <div className="p-6 bg-white border-t border-gray-100">
                                <div className="flex justify-center items-center space-x-8">
                                    <button className="p-3 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                                        <RotateCcw className="w-6 h-6" />
                                    </button>

                                    <button
                                        onClick={toggleRecording}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 ${isRecording
                                            ? 'bg-red-500 animate-pulse ring-4 ring-red-200'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {isRecording ? (
                                            <Square className="w-6 h-6 text-white fill-current" />
                                        ) : (
                                            <Mic className="w-8 h-8 text-white" />
                                        )}
                                    </button>

                                    <button className="p-3 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                                        <AlertCircle className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    {isRecording ? 'Идет запись... Говорите четко' : 'Нажмите на микрофон, чтобы ответить'}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/30">
                            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                                <Bot className="w-10 h-10 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Выберите сценарий</h3>
                            <p className="max-w-md text-gray-500">
                                Выберите ситуацию из списка слева, чтобы начать тренировку. AI-клиент будет реагировать на ваши ответы в реальном времени.
                            </p>
                        </div>
                    )}

                    {/* Feedback Overlay */}
                    {feedback && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-yellow-100 p-4 rounded-full">
                                        <Award className="w-12 h-12 text-yellow-600" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Тренировка завершена!</h2>
                                <p className="text-center text-gray-600 mb-6">
                                    Вы успешно справились со сценарием.
                                </p>
                                <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-100">
                                    <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wide">Обратная связь AI:</h4>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        {feedback}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFeedback(null)}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    Продолжить обучение
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesRoleplayPage;
