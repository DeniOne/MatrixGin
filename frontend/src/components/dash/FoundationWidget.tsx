import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { Button, Card, Progress, Typography } from 'antd';
import { RocketOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const FoundationWidget: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Safe state default
    const status = user?.foundationStatus || 'NOT_STARTED';

    // Status text map
    const statusMap = {
        'NOT_STARTED': { percent: 0, text: 'Не начато', color: '#ff4d4f' },
        'IN_PROGRESS': { percent: 50, text: 'В процессе', color: '#1890ff' },
        'ACCEPTED': { percent: 100, text: 'Принято', color: '#52c41a' }
    };

    const currentStatus = statusMap[status] || statusMap['NOT_STARTED'];

    const handleAction = () => {
        navigate('/foundation');
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                        Foundation
                    </Title>
                    <div className={`px-2 py-1 rounded text-xs font-medium`} style={{ backgroundColor: `${currentStatus.color}20`, color: currentStatus.color }}>
                        {currentStatus.text}
                    </div>
                </div>

                <Text type="secondary" className="block mb-6 text-sm">
                    Базовый курс MatrixGin. Обязателен для доступа к продвинутым функциям.
                </Text>

                <Progress
                    percent={currentStatus.percent}
                    showInfo={false}
                    strokeColor={currentStatus.color}
                    trailColor="#f0f0f0"
                    className="mb-4"
                />
            </div>

            <Button
                type="primary"
                block
                size="large"
                icon={status === 'ACCEPTED' ? <CheckCircleOutlined /> : <RocketOutlined />}
                onClick={handleAction}
                className="mt-auto bg-[#030213] hover:bg-[#1a192d] h-12 rounded-xl"
            >
                {status === 'NOT_STARTED' ? 'Начать погружение' :
                    status === 'IN_PROGRESS' ? 'Продолжить' : 'Открыть материалы'}
            </Button>
        </div>
    );
};

export default FoundationWidget;
