import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Checkbox, Progress, Space, Typography, Alert, Result, Divider, Tag } from 'antd';
import {
    CheckCircleFilled,
    CloseCircleFilled,
    ClockCircleOutlined,
    InfoCircleOutlined,
    TrophyOutlined,
    ArrowRightOutlined,
    RedoOutlined
} from '@ant-design/icons';
import { useGetQuizQuery, useSubmitQuizAttemptMutation, QuizQuestion } from '../api/universityApi';

const { Title, Paragraph, Text } = Typography;

interface QuizEngineProps {
    materialId: string;
    enrollmentId?: string;
    onComplete?: (result: any) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ materialId, enrollmentId, onComplete }) => {
    const { data: quizData, isLoading, error, refetch } = useGetQuizQuery(materialId);
    const [submitAttempt, { isLoading: isSubmitting }] = useSubmitQuizAttemptMutation();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [result, setResult] = useState<any>(null);
    const [cooldown, setCooldown] = useState(0);

    // Cooldown timer logic
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(c => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    if (isLoading) return <Card loading bordered={false} className="bg-white/50 backdrop-blur-sm" />;
    if (error) return (
        <Alert
            message="Ошибка загрузки теста"
            description={(error as any)?.data?.error || 'Попробуйте позже'}
            type="error"
            showIcon
            action={<Button size="small" type="primary" onClick={() => refetch()}>Повторить</Button>}
        />
    );

    const quiz = quizData?.data;
    if (!quiz) return <Alert message="Тест не найден" type="warning" showIcon />;

    const questions = quiz.questions;
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleOptionChange = (questionId: string, selected: string | string[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: Array.isArray(selected) ? selected : [selected]
        }));
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(c => c + 1);
        }
    };

    const handleSubmit = async () => {
        const payload = {
            quizId: quiz.id,
            enrollmentId,
            answers: Object.entries(answers).map(([id, options]) => ({
                questionId: id,
                selectedOptions: options
            }))
        };

        try {
            const res = await submitAttempt(payload).unwrap();
            if (res.success) {
                setResult(res.data);
                if (onComplete) onComplete(res.data);
            }
        } catch (err: any) {
            // Handle cooldown error
            if (err?.data?.error?.includes('cooldown')) {
                const match = err.data.error.match(/\d+/);
                if (match) setCooldown(parseInt(match[0]));
            }
            console.error('Submit error:', err);
        }
    };

    const restartQuiz = () => {
        setResult(null);
        setCurrentQuestionIndex(0);
        setAnswers({});
    };

    // Result screen
    if (result) {
        return (
            <Card bordered={false} className="shadow-xl rounded-2xl overflow-hidden bg-white">
                <Result
                    icon={result.passed ? <CheckCircleFilled className="text-emerald-500 text-6xl" /> : <CloseCircleFilled className="text-rose-500 text-6xl" />}
                    title={
                        <Title level={2}>
                            {result.passed ? 'Поздравляем! Тест пройден' : 'Тест не пройден'}
                        </Title>
                    }
                    subTitle={
                        <Space direction="vertical" align="center" size="large" className="w-full">
                            <Text className="text-[#717182] text-lg">
                                Ваш результат: <Text strong className={result.passed ? 'text-emerald-600' : 'text-rose-600'}>{result.score.toFixed(1)}%</Text> (необходимо {quiz.pass_score}%)
                            </Text>
                            <Progress
                                type="circle"
                                percent={Math.round(result.score)}
                                strokeColor={result.passed ? '#10b981' : '#f43f5e'}
                                size={120}
                            />
                            {result.mode === 'DIAGNOSTIC' && (
                                <Tag color="blue" icon={<InfoCircleOutlined />}>Диагностический тест (влияет на рейтинг)</Tag>
                            )}
                        </Space>
                    }
                    extra={[
                        <Button
                            key="restart"
                            icon={<RedoOutlined />}
                            onClick={restartQuiz}
                            disabled={cooldown > 0}
                        >
                            {cooldown > 0 ? `Повтор через ${cooldown}с` : 'Попробовать снова'}
                        </Button>,
                        result.passed && (
                            <Button key="next" type="primary" icon={<ArrowRightOutlined />}>
                                К следующему уроку
                            </Button>
                        )
                    ]}
                />
            </Card>
        );
    }

    // Question screen
    return (
        <Card
            bordered={false}
            className="shadow-lg rounded-2xl bg-white/80 backdrop-blur-md border border-white/20"
            title={
                <div className="flex justify-between items-center py-2">
                    <Space direction="vertical" size={0}>
                        <Text type="secondary" className="uppercase text-xs font-medium tracking-wider">Вопрос {currentQuestionIndex + 1} из {questions.length}</Text>
                        <Title level={4} className="m-0">{quiz.title}</Title>
                    </Space>
                    <div className="w-32">
                        <Progress percent={Math.round(((currentQuestionIndex + 1) / questions.length) * 100)} size="small" showInfo={false} strokeColor="#6366f1" />
                    </div>
                </div>
            }
        >
            <div className="min-h-[300px] flex flex-col">
                <div className="mb-8">
                    <Paragraph className="text-xl font-medium text-gray-800 leading-relaxed">
                        {currentQuestion.text}
                    </Paragraph>
                    {currentQuestion.type === 'MULTIPLE' && (
                        <Text type="secondary" icon={<InfoCircleOutlined />}>Выберите несколько вариантов ответа</Text>
                    )}
                </div>

                <div className="flex-grow">
                    {currentQuestion.type === 'SINGLE' ? (
                        <Radio.Group
                            className="w-full"
                            onChange={e => handleOptionChange(currentQuestion.id, e.target.value)}
                            value={answers[currentQuestion.id]?.[0]}
                        >
                            <Space direction="vertical" className="w-full">
                                {currentQuestion.options.map(opt => (
                                    <Radio.Button
                                        key={opt.id}
                                        value={opt.id}
                                        className="w-full h-auto py-4 px-6 rounded-xl border-gray-100 hover:border-indigo-400 transition-all text-left mb-2 flex items-center"
                                        style={{ display: 'flex', whiteSpace: 'normal', borderRadius: '12px' }}
                                    >
                                        <Text className="text-base">{opt.text}</Text>
                                    </Radio.Button>
                                ))}
                            </Space>
                        </Radio.Group>
                    ) : (
                        <Checkbox.Group
                            className="w-full"
                            onChange={vals => handleOptionChange(currentQuestion.id, vals as string[])}
                            value={answers[currentQuestion.id]}
                        >
                            <Space direction="vertical" className="w-full">
                                {currentQuestion.options.map(opt => (
                                    <div key={opt.id} className="w-full mb-2">
                                        <Checkbox
                                            value={opt.id}
                                            className="w-full h-auto py-4 px-6 rounded-xl border border-gray-100 hover:border-indigo-400 transition-all m-0 flex items-center bg-white"
                                            style={{ borderRadius: '12px' }}
                                        >
                                            <Text className="text-base">{opt.text}</Text>
                                        </Checkbox>
                                    </div>
                                ))}
                            </Space>
                        </Checkbox.Group>
                    )}
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                    <Button
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(c => c - 1)}
                    >
                        Назад
                    </Button>

                    {isLastQuestion ? (
                        <Button
                            type="primary"
                            size="large"
                            icon={<TrophyOutlined />}
                            className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md px-8 rounded-lg"
                            onClick={handleSubmit}
                            loading={isSubmitting}
                            disabled={!answers[currentQuestion.id]?.length}
                        >
                            Завершить тест
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            className="bg-indigo-600 hover:bg-indigo-500 border-none shadow-md px-8 rounded-lg"
                            onClick={nextQuestion}
                            disabled={!answers[currentQuestion.id]?.length}
                        >
                            Далее
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};
