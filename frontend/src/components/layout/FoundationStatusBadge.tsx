import React from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { Tooltip } from 'antd';
import { RocketOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const FoundationStatusBadge: React.FC = () => {
    const { user } = useAuth();

    // Guarded state access with default safe state
    const status = user?.foundationStatus || 'NOT_STARTED';

    const getBadgeConfig = () => {
        switch (status) {
            case 'ACCEPTED':
                return {
                    icon: <CheckCircleOutlined />,
                    color: '#52c41a',
                    bg: '#f6ffed',
                    text: 'Foundation: Принято',
                    tooltip: 'Вы успешно прошли Foundation и имеете полный доступ.'
                };
            case 'IN_PROGRESS':
                return {
                    icon: <RocketOutlined spin />,
                    color: '#1890ff',
                    bg: '#e6f7ff',
                    text: 'Foundation: В процессе',
                    tooltip: 'Завершите Foundation для доступа ко всем функциям.'
                };
            default: // NOT_STARTED and others
                return {
                    icon: <InfoCircleOutlined />,
                    color: '#ff4d4f',
                    bg: '#fff1f0',
                    text: 'Foundation: Не начато',
                    tooltip: 'Пройдите Foundation для начала работы.'
                };
        }
    };

    const config = getBadgeConfig();

    return (
        <Tooltip title={config.tooltip}>
            <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-help transition-all duration-200"
                style={{
                    color: config.color,
                    backgroundColor: config.bg,
                    border: `1px solid ${config.color}40`
                }}
            >
                {config.icon}
                <span className="hidden md:inline">{config.text}</span>
                <span className="md:hidden">FND</span>
            </div>
        </Tooltip>
    );
};

export default FoundationStatusBadge;
