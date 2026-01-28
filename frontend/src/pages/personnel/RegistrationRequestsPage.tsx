import React from 'react';
import { Table, Tag, Space, Button, Typography, Card, message, Modal } from 'antd';
import { useGetRegistrationsQuery, useRejectRegistrationMutation, RegistrationRequest } from '../../features/ofs/api/registrationApi';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ApproveRegistrationModal from '../../features/ofs/components/ApproveRegistrationModal';

const { Title, Text } = Typography;

export const RegistrationRequestsPage: React.FC = () => {
    const { data: response, isLoading, refetch } = useGetRegistrationsQuery({ status: 'REVIEW' });
    const [reject] = useRejectRegistrationMutation();
    const [approvingRegistration, setApprovingRegistration] = React.useState<RegistrationRequest | null>(null);

    const handleApprove = (record: RegistrationRequest) => {
        setApprovingRegistration(record);
    };

    const handleReject = (id: string) => {
        let reason = '';
        Modal.confirm({
            title: 'Отклонить регистрацию?',
            content: (
                <div className="mt-4">
                    <p>Укажите причину отказа:</p>
                    <textarea
                        className="w-full mt-2 p-2 border rounded"
                        rows={3}
                        onChange={(e) => reason = e.target.value}
                    />
                </div>
            ),
            okText: 'Отклонить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                if (!reason) {
                    message.warning('Укажите причину');
                    return Promise.reject();
                }
                try {
                    await reject({ id, reason }).unwrap();
                    message.success('Регистрация отклонена');
                    refetch();
                } catch (err: any) {
                    message.error(err.data?.message || 'Ошибка отклонения');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Сотрудник',
            key: 'name',
            render: (record: RegistrationRequest) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.last_name} {record.first_name} {record.middle_name || ''}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>@{record.telegram_id}</Text>
                </Space>
            ),
        },
        {
            title: 'Должность',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Контакты',
            key: 'contacts',
            render: (record: RegistrationRequest) => (
                <Space direction="vertical" size={0}>
                    <Text style={{ fontSize: '12px' }}>{record.email}</Text>
                    <Text style={{ fontSize: '12px' }}>{record.phone}</Text>
                </Space>
            ),
        },
        {
            title: 'Дата подачи',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'gold';
                let icon = <ClockCircleOutlined />;
                if (status === 'APPROVED') { color = 'green'; icon = <CheckCircleOutlined />; }
                if (status === 'REJECTED') { color = 'red'; icon = <CloseCircleOutlined />; }
                return <Tag color={color} icon={icon}>{status}</Tag>;
            }
        },
        {
            title: 'Действия',
            key: 'action',
            render: (record: RegistrationRequest) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        size="small"
                        ghost
                        onClick={() => handleApprove(record)}
                    >
                        Одобрить
                    </Button>
                    <Button
                        danger
                        size="small"
                        ghost
                        onClick={() => handleReject(record.id)}
                    >
                        Отклонить
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Title level={2} className="mb-6">Заявки на регистрацию</Title>

            <Card className="shadow-sm border-black/5">
                <Table
                    columns={columns}
                    dataSource={response?.data || []}
                    loading={isLoading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {approvingRegistration && (
                <ApproveRegistrationModal
                    registration={approvingRegistration}
                    onClose={() => setApprovingRegistration(null)}
                    onSuccess={() => {
                        setApprovingRegistration(null);
                        message.success('Регистрация одобрена');
                        refetch();
                    }}
                />
            )}
        </div>
    );
};
