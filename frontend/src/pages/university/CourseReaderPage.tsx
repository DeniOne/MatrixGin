import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout,
    Menu,
    Typography,
    Button,
    Space,
    Spin,
    Progress,
    Card,
    Empty,
    Breadcrumb,
    Tag,
    List
} from 'antd';
import {
    BookOutlined,
    CheckCircleFilled,
    PlayCircleOutlined,
    QuestionCircleOutlined,
    LeftOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { useGetEnrollmentByIdQuery, useUpdateModuleProgressMutation } from '../../features/university/api/universityApi';
import { QuizEngine } from '../../features/university/components/QuizEngine';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const CourseReaderPage: React.FC = () => {
    const { enrollmentId } = useParams<{ enrollmentId: string }>();
    const navigate = useNavigate();

    const { data: enrollmentData, isLoading, error, refetch } = useGetEnrollmentByIdQuery(enrollmentId!);
    const [updateProgress] = useUpdateModuleProgressMutation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

    const enrollment = enrollmentData?.data;
    const course = enrollment?.course;
    const modules = course?.modules || [];
    const moduleProgress = enrollment?.module_progress || [];

    // Set initial active module
    useEffect(() => {
        if (modules.length > 0 && !activeModuleId) {
            // Find first incomplete module or first module
            const firstIncomplete = modules.find((m: any) => {
                const prog = moduleProgress.find((p: any) => p.module_id === m.id);
                return prog?.status !== 'COMPLETED';
            });
            setActiveModuleId(firstIncomplete?.id || modules[0].id);
        }
    }, [modules, moduleProgress, activeModuleId]);

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-gray-950">
            <Spin size="large" tip="Загрузка курса..." />
        </div>
    );

    if (error || !enrollment) return (
        <div className="h-screen flex items-center justify-center bg-gray-950">
            <Empty description="Курс не найден" />
        </div>
    );

    const activeModule = modules.find((m: any) => m.id === activeModuleId);
    const activeProgress = moduleProgress.find((p: any) => p.module_id === activeModuleId);

    const handleModuleSelect = (moduleId: string) => {
        setActiveModuleId(moduleId);
        // Mark as IN_PROGRESS if NOT_STARTED
        const prog = moduleProgress.find((p: any) => p.module_id === moduleId);
        if (prog?.status === 'NOT_STARTED') {
            updateProgress({
                enrollmentId: enrollmentId!,
                moduleId,
                status: 'IN_PROGRESS'
            });
        }
    };

    const handleModuleComplete = () => {
        if (activeModuleId) {
            updateProgress({
                enrollmentId: enrollmentId!,
                moduleId: activeModuleId,
                status: 'COMPLETED'
            });

            // Move to next module
            const currentIndex = modules.findIndex((m: any) => m.id === activeModuleId);
            if (currentIndex < modules.length - 1) {
                setActiveModuleId(modules[currentIndex + 1].id);
            }
        }
    };

    const getModuleIcon = (type: string, status: string) => {
        if (status === 'COMPLETED') return <CheckCircleFilled className="text-emerald-500" />;
        if (type === 'QUIZ') return <QuestionCircleOutlined />;
        if (type === 'VIDEO') return <PlayCircleOutlined />;
        return <BookOutlined />;
    };

    return (
        <Layout className="h-screen overflow-hidden bg-white">
            <Header className="bg-white border-b border-gray-100 px-6 flex items-center justify-between h-16 shrink-0">
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<LeftOutlined />}
                        onClick={() => navigate('/university')}
                    />
                    <Breadcrumb
                        items={[
                            { title: <HomeOutlined />, href: '/' },
                            { title: 'Университет', href: '/university' },
                            { title: course.title }
                        ]}
                    />
                </Space>
                <Space size="large">
                    <div className="flex flex-col items-end">
                        <Text strong className="text-xs uppercase text-gray-400">Прогресс курса</Text>
                        <Progress
                            percent={enrollment.progress}
                            size="small"
                            className="w-48 m-0"
                            strokeColor={{
                                '0%': '#818cf8',
                                '100%': '#4f46e5',
                            }}
                        />
                    </div>
                </Space>
            </Header>

            <Layout className="overflow-hidden">
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={320}
                    className="bg-gray-50 border-r border-gray-200 overflow-y-auto"
                >
                    <div className="p-4 flex justify-between items-center bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        {!collapsed && <Text strong type="secondary">План обучения</Text>}
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    </div>

                    <Menu
                        mode="inline"
                        selectedKeys={[activeModuleId || '']}
                        className="bg-transparent border-none mt-2"
                        onSelect={({ key }) => handleModuleSelect(key as string)}
                        items={modules.map((m: any) => {
                            const prog = moduleProgress.find((p: any) => p.module_id === m.id);
                            return {
                                key: m.id,
                                icon: getModuleIcon(m.material?.type, prog?.status),
                                label: (
                                    <div className="flex flex-col py-2 leading-tight">
                                        <Text className="text-sm truncate">{m.material?.title || `Модуль ${m.module_order}`}</Text>
                                        <Text type="secondary" className="text-[10px] uppercase">
                                            {m.material?.duration_minutes} мин • {m.is_required ? 'Обязательно' : 'Факультатив'}
                                        </Text>
                                    </div>
                                ),
                            };
                        })}
                    />
                </Sider>

                <Content className="overflow-y-auto bg-gray-50/50 p-8">
                    <div className="max-w-4xl mx-auto">
                        {activeModule ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <Card bordered={false} className="shadow-sm rounded-2xl overflow-hidden">
                                    <div className="p-6">
                                        <Space className="mb-4">
                                            <Tag color="indigo" className="rounded-full px-3">{activeModule.material?.type}</Tag>
                                            <Text type="secondary">Цель: {course.target_metric}</Text>
                                        </Space>
                                        <Title level={2}>{activeModule.material?.title}</Title>

                                        {activeModule.material?.type === 'QUIZ' ? (
                                            <QuizEngine
                                                materialId={activeModule.material_id}
                                                enrollmentId={enrollmentId}
                                                onComplete={() => refetch()}
                                            />
                                        ) : (
                                            <div className="mt-8 prose prose-indigo max-w-none">
                                                {activeModule.material?.content_text ? (
                                                    <Paragraph className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                        {activeModule.material.content_text}
                                                    </Paragraph>
                                                ) : activeModule.material?.content_url ? (
                                                    <div className="aspect-video bg-black rounded-2xl flex items-center justify-center text-white overflow-hidden shadow-2xl">
                                                        {/* Placeholder for video player integration */}
                                                        <Space direction="vertical" align="center">
                                                            <PlayCircleOutlined className="text-6xl text-indigo-500" />
                                                            <Text className="text-white">Видео-контент: {activeModule.material.content_url}</Text>
                                                        </Space>
                                                    </div>
                                                ) : (
                                                    <Empty description="Контент отсутствует" />
                                                )}

                                                <div className="mt-12 flex justify-end">
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        icon={<CheckCircleFilled />}
                                                        className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-lg"
                                                        onClick={handleModuleComplete}
                                                        disabled={activeProgress?.status === 'COMPLETED'}
                                                    >
                                                        {activeProgress?.status === 'COMPLETED' ? 'Завершено' : 'Прочитано, идем дальше'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <Empty description="Выберите модуль для начала обучения" />
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
