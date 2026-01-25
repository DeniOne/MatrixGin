import React, { useState, useEffect } from 'react';
import { Button, Card, Radio, Typography } from 'antd';
// import { UserRole } from '../../dto/common/common.enums'; // Commented out to avoid path issues without full backend alignment

const { Text } = Typography;

export enum EmulatedRole {
    EMPLOYEE = 'EMPLOYEE',
    TACTICAL = 'TACTICAL',
    STRATEGIC = 'STRATEGIC',
    SUPERUSER = 'SUPERUSER'
}

interface RoleEmulatorProps {
    onRoleChange: (role: EmulatedRole) => void;
}

export const RoleEmulator: React.FC<RoleEmulatorProps> = ({ onRoleChange }) => {
    const [role, setRole] = useState<EmulatedRole>(EmulatedRole.SUPERUSER);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Initial sync
        onRoleChange(role);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRoleChange = (e: any) => {
        const newRole = e.target.value;
        setRole(newRole);
        onRoleChange(newRole);
    };

    if (!isVisible) {
        return (
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    type="primary"
                    danger
                    shape="circle"
                    icon={<span style={{ fontSize: '10px' }}>DEV</span>}
                    onClick={() => setIsVisible(true)}
                />
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <Card
                size="small"
                title={<span className="text-xs font-bold text-red-600">ЭМУЛЯТОР РОЛЕЙ (DEV)</span>}
                extra={<Button type="text" size="small" onClick={() => setIsVisible(false)}>X</Button>}
                className="shadow-xl border-red-200"
                style={{ width: 220, backgroundColor: '#fff0f0' }}
            >
                <Radio.Group onChange={handleRoleChange} value={role} className="flex flex-col gap-2">
                    <Radio value={EmulatedRole.EMPLOYEE} className="text-xs">
                        Сотрудник (Личное+Универ)
                    </Radio>
                    <Radio value={EmulatedRole.TACTICAL} className="text-xs">
                        Линейный рук. (Отдел)
                    </Radio>
                    <Radio value={EmulatedRole.STRATEGIC} className="text-xs">
                        Топ-менеджер (Вся компания)
                    </Radio>
                    <Radio value={EmulatedRole.SUPERUSER} className="text-xs font-bold">
                        Суперюзер (Полный доступ)
                    </Radio>
                </Radio.Group>

                <div className="mt-3 pt-2 border-t border-red-100">
                    <Text type="secondary" className="text-[10px]">
                        Меняет только видимость в меню.
                        Не дает реальных прав доступа к API.
                    </Text>
                </div>
            </Card>
        </div>
    );
};
