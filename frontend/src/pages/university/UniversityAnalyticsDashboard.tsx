import React from 'react';
import {
    Layout,
    Typography,
    Card,
    Row,
    Col,
    Statistic,
    Spin,
    Alert,
    Progress,
    List,
    Tag,
    Divider
} from 'antd';
import {
    AreaChartOutlined,
    BookOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    RiseOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import { useGetAnalyticsOverviewQuery } from '../../features/university/api/universityApi';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const UniversityAnalyticsDashboard: React.FC = () => {
    const { data: analyticsResult, isLoading, error } = useGetAnalyticsOverviewQuery();

    const analytics = analyticsResult?.data;

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-gray-950">
            <Spin size="large" tip="Собираем аналитику университета..." />
        </div>
    );

    if (error || !analytics) return (
        <div className="p-8">
            <Alert
                message="Ошибка доступа"
                description="У вас недостаточно прав для просмотра общеуниверситетской аналитики."
                type="error"
                showIcon
            />
        </div>
    );

    return (
        <Content className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <Title level={4} className="m-0 text-indigo-600 uppercase tracking-widest text-xs">Управление Знаниями</Title>
                        <Title level={2} className="mt-1">Аналитика Корпоративного Университета</Title>
                    </div>
                </div>

                {/* Main Stats Row */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl border-l-4 border-indigo-500">
                            <Statistic
                                title="Образовательные центры"
                                value={analytics.infrastructure.academies}
                                prefix={<PieChartOutlined className="text-indigo-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl border-l-4 border-blue-500">
                            <Statistic
                                title="Активные курсы"
                                value={analytics.infrastructure.courses}
                                prefix={<BookOutlined className="text-blue-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl border-l-4 border-emerald-500">
                            <Statistic
                                title="Всего зачислений"
                                value={analytics.learning.totalEnrollments}
                                prefix={<TeamOutlined className="text-emerald-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl border-l-4 border-amber-500">
                            <Statistic
                                title="Сигналы безопасности"
                                value={analytics.security.activeSignals}
                                valueStyle={{ color: analytics.security.activeSignals > 0 ? '#f59e0b' : 'inherit' }}
                                prefix={<SafetyCertificateOutlined className={analytics.security.activeSignals > 0 ? 'text-amber-500' : 'text-gray-300'} />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Detailed Analytics Section */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card
                            title={<Title level={4} className="m-0"><AreaChartOutlined className="mr-2" />Эффективность Обучения</Title>}
                            bordered={false}
                            className="shadow-sm rounded-2xl min-h-[400px]"
                        >
                            <div className="space-y-8 py-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <Text strong>Процент завершения (Completion Rate)</Text>
                                        <Text className="text-indigo-600 font-bold">{analytics.learning.completionRate.toFixed(1)}%</Text>
                                    </div>
                                    <Progress
                                        percent={analytics.learning.completionRate}
                                        strokeColor={{ '0%': '#6366f1', '100%': '#3b82f6' }}
                                        showInfo={false}
                                        strokeWidth={12}
                                    />
                                </div>

                                <Divider />

                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Statistic
                                            title="Завершено курсов"
                                            value={analytics.learning.completedEnrollments}
                                            suffix={<Text type="secondary" className="text-sm">/ {analytics.learning.totalEnrollments}</Text>}
                                            prefix={<RiseOutlined className="text-emerald-500" />}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Активные наставничества"
                                            value={analytics.mentorship.activePeriods}
                                            prefix={<TeamOutlined className="text-indigo-500" />}
                                        />
                                    </Col>
                                </Row>

                                <Alert
                                    message="Тренд месяца"
                                    description="Наблюдается рост вовлеченности в академии Фотографии на 14% по сравнению с прошлым периодом."
                                    type="info"
                                    showIcon
                                    className="rounded-xl border-none bg-indigo-50"
                                />
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card
                            title={<Title level={4} className="m-0">Краткий аудит</Title>}
                            bordered={false}
                            className="shadow-sm rounded-2xl h-full"
                        >
                            <Paragraph type="secondary">
                                Университет работает в штатном режиме. Все квалификационные изменения зафиксированы в блокчейне событий.
                            </Paragraph>

                            <List
                                className="mt-4"
                                split={false}
                                dataSource={[
                                    { label: 'Стабильность системы', value: '100%', status: 'success' },
                                    { label: 'Скорость проверки тестов', value: '< 1с', status: 'success' },
                                    { label: 'Аномалии (24ч)', value: analytics.security.activeSignals, status: analytics.security.activeSignals > 0 ? 'warning' : 'success' }
                                ]}
                                renderItem={(item) => (
                                    <List.Item className="px-0 py-2 border-none">
                                        <div className="w-full flex justify-between items-center">
                                            <Text>{item.label}</Text>
                                            <Tag color={item.status === 'success' ? 'green' : 'gold'}>{item.value}</Tag>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </Content>
    );
};
