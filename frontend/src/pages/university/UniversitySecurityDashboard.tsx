import React, { useState } from 'react';
import {
    Layout,
    Typography,
    Card,
    Row,
    Col,
    Table,
    Tag,
    Space,
    Button,
    Modal,
    Form,
    Input,
    message,
    Alert,
    Timeline,
    Badge,
    Empty,
    Spin
} from 'antd';
import {
    SafetyCertificateOutlined,
    AlertOutlined,
    CheckCircleOutlined,
    StopOutlined,
    InfoCircleOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import {
    useGetSecuritySignalsQuery,
    useValidateSignalMutation,
    useInvalidateCertificationMutation
} from '../../features/university/api/universityApi';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const UniversitySecurityDashboard: React.FC = () => {
    const { data: signalsResult, isLoading, refetch } = useGetSecuritySignalsQuery();
    const [validateSignal] = useValidateSignalMutation();
    const [invalidateCert] = useInvalidateCertificationMutation();

    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedSignal, setSelectedSignal] = useState<any>(null);
    const [actionType, setActionType] = useState<'VALIDATE' | 'INVALIDATE'>('VALIDATE');
    const [form] = Form.useForm();

    const signals = signalsResult?.data || [];

    const handleOpenModal = (signal: any, type: 'VALIDATE' | 'INVALIDATE') => {
        setSelectedSignal(signal);
        setActionType(type);
        setIsActionModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsActionModalOpen(false);
        setSelectedSignal(null);
        form.resetFields();
    };

    const onFinish = async (values: any) => {
        try {
            if (actionType === 'VALIDATE') {
                await validateSignal({
                    id: selectedSignal.id,
                    comment: values.comment
                }).unwrap();
                message.success('Сигнал успешно подтвержден как ложноположительный');
            } else {
                // For invalidation, we need the enrollment ID (stored in entity_id or context)
                const enrollmentId = selectedSignal.context?.metadata?.enrollmentId || selectedSignal.entity_id;
                await invalidateCert({
                    id: enrollmentId,
                    reason: values.comment,
                    evidenceLinks: values.evidenceLinks?.split('\n').filter(Boolean)
                }).unwrap();
                message.success('Сертификат успешно отозван. Audit Log обновлен.');
            }

            handleCloseModal();
            refetch();
        } catch (err: any) {
            message.error(`Ошибка: ${err.data?.error || err.message}`);
        }
    };

    const columns = [
        {
            title: 'Уровень',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => {
                const colors: Record<string, string> = { HIGH: 'red', MEDIUM: 'orange', LOW: 'blue' };
                return <Tag color={colors[level]}>{level}</Tag>;
            }
        },
        {
            title: 'Субъект (ID)',
            dataIndex: 'entity_id',
            key: 'entity_id',
            render: (id: string) => <Text copyable size="small">{id}</Text>
        },
        {
            title: 'Тип аномалии',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Badge status="processing" text={type} />
        },
        {
            title: 'Уверенность',
            key: 'confidence',
            render: (_: any, record: any) => (
                <Text strong>{(record.context.confidenceScore * 100).toFixed(0)}%</Text>
            )
        },
        {
            title: 'Детектировано',
            dataIndex: 'detected_at',
            key: 'detected_at',
            render: (date: string) => new Date(date).toLocaleString()
        },
        {
            title: 'Статус',
            key: 'status',
            render: (_: any, record: any) => (
                record.context?.resolved ?
                    <Tag icon={<CheckCircleOutlined />} color="success">РЕШЕНО</Tag> :
                    <Tag icon={<AlertOutlined />} color="warning">ТРЕБУЕТ ВНИМАНИЯ</Tag>
            )
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_: any, record: any) => (
                !record.context?.resolved ? (
                    <Space>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleOpenModal(record, 'VALIDATE')}
                        >
                            Валидировать
                        </Button>
                        <Button
                            type="link"
                            danger
                            size="small"
                            onClick={() => handleOpenModal(record, 'INVALIDATE')}
                        >
                            Отозвать
                        </Button>
                    </Space>
                ) : null
            )
        }
    ];

    if (isLoading) return <div className="p-20 text-center"><Spin size="large" /></div>;

    return (
        <Content className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <Title level={4} className="m-0 text-amber-600 uppercase tracking-widest text-xs">Контур Безопасности</Title>
                        <Title level={2} className="mt-1">Аудит целостности обучения</Title>
                    </div>
                </div>

                <Alert
                    message="Human-in-the-Loop Architecture"
                    description="Система детекции аномалий работает в режиме read-only. Никакие сертификаты не отзываются автоматически. Любое действие в этом разделе требует двойного подтверждения и заносится в Audit Log."
                    type="warning"
                    showIcon
                    className="rounded-2xl"
                />

                {/* Signals Table */}
                <Card bordered={false} className="shadow-sm rounded-2xl overflow-hidden">
                    <Table
                        dataSource={signals}
                        columns={columns}
                        rowKey="id"
                        expandable={{
                            expandedRowRender: (record) => (
                                <div className="p-4 bg-gray-50 rounded-xl m-2">
                                    <Title level={5}>Детализация инцидента</Title>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Text strong>Улики (Signals):</Text>
                                            <ul className="list-disc list-inside mt-2 text-xs text-[#717182]">
                                                {record.context.signals.map((s: string, i: number) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Метаданные сессии:</Text>
                                            <Paragraph className="mt-2 text-xs text-[#717182] font-mono">
                                                IP: {record.context.metadata?.ipAddress || 'unknown'}<br />
                                                Баллы: {record.context.confidenceScore}
                                            </Paragraph>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }}
                    />
                </Card>
            </div>

            {/* Action Modal */}
            <Modal
                title={actionType === 'VALIDATE' ? 'Валидация активности' : 'Отзыв сертификата'}
                open={isActionModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={600}
                centered
            >
                <div className="mb-6">
                    <Alert
                        message={actionType === 'VALIDATE' ? 'Подтверждение легитимности' : 'Критическое действие!'}
                        description={
                            actionType === 'VALIDATE'
                                ? "Вы подтверждаете, что данная активность является легитимной. Сигнал будет помечен как разрешенный."
                                : "Вы отзываете сертификат у пользователя. Это действие ПУБЛИЧНО и будет зафиксировано в Audit Log как ручная инвалидация."
                        }
                        type={actionType === 'VALIDATE' ? 'info' : 'error'}
                        showIcon
                    />
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="comment"
                        label="Обоснование решения (для Audit Log)"
                        rules={[{ required: true, message: 'Обоснование обязательно' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Опишите причины вашего решения..." />
                    </Form.Item>

                    {actionType === 'INVALIDATE' && (
                        <Form.Item
                            name="evidenceLinks"
                            label="Ссылки на улики/логи (по одной в строке)"
                        >
                            <Input.TextArea rows={2} placeholder="https://..." />
                        </Form.Item>
                    )}

                    <Form.Item className="mb-0 mt-8 flex justify-end">
                        <Space>
                            <Button onClick={handleCloseModal}>Отмена</Button>
                            <Button
                                type="primary"
                                danger={actionType === 'INVALIDATE'}
                                htmlType="submit"
                                icon={actionType === 'VALIDATE' ? <CheckCircleOutlined /> : <StopOutlined />}
                            >
                                {actionType === 'VALIDATE' ? 'Подтвердить легитимность' : 'Отозвать сертификат'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
};
