import React, { useState } from 'react';
import {
    Layout,
    Typography,
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    Space,
    Button,
    Modal,
    Form,
    Input,
    Rate,
    Progress,
    Empty,
    Spin,
    message,
    Alert
} from 'antd';
import {
    TrophyOutlined,
    TeamOutlined,
    StarOutlined,
    AuditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { useGetTrainerDashboardQuery, useCompleteMentorshipMutation } from '../../features/university/api/universityApi';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const TrainerDashboardPage: React.FC = () => {
    const { data: dashboardResult, isLoading, error, refetch } = useGetTrainerDashboardQuery();
    const [completeMentorship, { isLoading: isCompleting }] = useCompleteMentorshipMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
    const [form] = Form.useForm();

    const dashboard = dashboardResult?.data;

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-gray-950">
            <Spin size="large" tip="Загрузка дашборда тренера..." />
        </div>
    );

    if (error || !dashboard) return (
        <div className="p-8">
            <Alert
                message="Ошибка доступа"
                description="Вы не зарегистрированы как тренер или у вас недостаточно прав для доступа к этому разделу."
                type="error"
                showIcon
            />
        </div>
    );

    const handleOpenCompleteModal = (period: any) => {
        setSelectedPeriod(period);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPeriod(null);
        form.resetFields();
    };

    const onFinish = async (values: any) => {
        try {
            await completeMentorship({
                periodId: selectedPeriod.id,
                status: values.status,
                notes: values.notes,
                metrics: {
                    nps_score: values.nps_score,
                    kpi_improvement: values.kpi_improvement,
                    quality_score: values.quality_score
                }
            }).unwrap();

            message.success('Наставничество успешно завершено');
            handleCloseModal();
            refetch();
        } catch (err: any) {
            message.error(`Ошибка: ${err.data?.error || err.message}`);
        }
    };

    const columns = [
        {
            title: 'Сотрудник (ID)',
            dataIndex: 'traineeId',
            key: 'traineeId',
            render: (text: string) => <Text copyable>{text}</Text>
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colors: Record<string, string> = {
                    PROBATION: 'orange',
                    ACTIVE: 'blue',
                    COMPLETED: 'emerald',
                    FAILED: 'red'
                };
                return <Tag color={colors[status] || 'default'}>{status}</Tag>;
            }
        },
        {
            title: 'Начало',
            dataIndex: 'startAt',
            key: 'startAt',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Дедлайн',
            dataIndex: 'expectedEndAt',
            key: 'expectedEndAt',
            render: (date: string) => {
                const isOverdue = new Date(date) < new Date();
                return <Text delete={isOverdue} type={isOverdue ? 'danger' : 'secondary'}>{new Date(date).toLocaleDateString()}</Text>;
            }
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_: any, record: any) => (
                record.status === 'PROBATION' || record.status === 'ACTIVE' ? (
                    <Button
                        type="primary"
                        size="small"
                        ghost
                        onClick={() => handleOpenCompleteModal(record)}
                    >
                        Завершить
                    </Button>
                ) : null
            )
        }
    ];

    return (
        <Content className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <Title level={4} className="m-0 text-indigo-600 uppercase tracking-widest text-xs">Институт Тренерства</Title>
                        <Title level={2} className="mt-1">Личный кабинет тренера</Title>
                    </div>
                    <Space>
                        {dashboard.currentAccreditation ? (
                            <Tag color="gold" className="px-4 py-1 rounded-full text-sm font-bold border-none shadow-sm">
                                <TrophyOutlined className="mr-2" />
                                {dashboard.currentAccreditation.level} (Вес: {dashboard.currentAccreditation.weight})
                            </Tag>
                        ) : (
                            <Tag color="default">Без аккредитации</Tag>
                        )}
                    </Space>
                </div>

                {/* Stats Grid */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl">
                            <Statistic
                                title="Ваш рейтинг"
                                value={dashboard.rating}
                                precision={2}
                                prefix={<StarOutlined className="text-amber-400" />}
                                suffix="/ 5.0"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl">
                            <Statistic
                                title="Обработанный NPS"
                                value={dashboard.stats.avgNPS}
                                precision={1}
                                prefix={<InfoCircleOutlined className="text-blue-400" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl">
                            <Statistic
                                title="Успешные ученики"
                                value={dashboard.stats.traineesSuccessful}
                                prefix={<CheckCircleOutlined className="text-emerald-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl">
                            <Statistic
                                title="Всего подопечных"
                                value={dashboard.stats.traineesTotal}
                                prefix={<TeamOutlined className="text-gray-400" />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Active Mentorships Section */}
                <Card
                    title={<Title level={4} className="m-0"><AuditOutlined className="mr-2" />Активные подопечные</Title>}
                    bordered={false}
                    className="shadow-sm rounded-2xl overflow-hidden"
                >
                    <Table
                        dataSource={dashboard.activeMentorships}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        locale={{ emptyText: <Empty description="Нет активных подопечных" /> }}
                    />
                </Card>

                {/* History Section */}
                {dashboard.history.length > 0 && (
                    <Card
                        title={<Title level={4} className="m-0">Архив наставничества</Title>}
                        bordered={false}
                        className="shadow-sm rounded-2xl overflow-hidden opacity-80"
                    >
                        <Table
                            dataSource={dashboard.history}
                            columns={columns.slice(0, 4)}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                )}
            </div>

            {/* Finalization Modal */}
            <Modal
                title={`Завершение наставничества: ${selectedPeriod?.traineeId}`}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={600}
                centered
            >
                <div className="mb-6">
                    <Alert
                        message="Юридически значимое действие"
                        description="Ваша оценка напрямую влияет на квалификацию и выплаты сотруднику. Это действие будет занесено в Audit Log."
                        type="warning"
                        showIcon
                    />
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ status: 'COMPLETED', nps_score: 5 }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="status" label="Итог обучения" rules={[{ required: true }]}>
                                <Button.Group className="w-full">
                                    <Button
                                        className="w-1/2"
                                        type={form.getFieldValue('status') === 'COMPLETED' ? 'primary' : 'default'}
                                        onClick={() => form.setFieldsValue({ status: 'COMPLETED' })}
                                    >
                                        Успешно
                                    </Button>
                                    <Button
                                        className="w-1/2"
                                        danger
                                        type={form.getFieldValue('status') === 'FAILED' ? 'primary' : 'default'}
                                        onClick={() => form.setFieldsValue({ status: 'FAILED' })}
                                    >
                                        Провал
                                    </Button>
                                </Button.Group>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="nps_score" label="Оценка NPS (1-10)">
                                <Input type="number" min={1} max={10} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="kpi_improvement" label="Рост KPI (%)">
                                <Input type="number" suffix="%" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="quality_score" label="Качество работы (1-100)">
                                <Input type="number" min={1} max={100} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="notes"
                        label="Финальный отзыв и обоснование"
                        rules={[{ required: true, message: 'Комментарий обязателен для Audit Log' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Опишите сильные и слабые стороны ученика..." />
                    </Form.Item>

                    <Form.Item className="mb-0 mt-8 flex justify-end">
                        <Space>
                            <Button onClick={handleCloseModal}>Отмена</Button>
                            <Button type="primary" htmlType="submit" loading={isCompleting} icon={<AuditOutlined />}>
                                Подтвердить и завершить
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
};
