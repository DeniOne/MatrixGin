import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, notification, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FieldRenderer } from './FieldRenderer'; // Updating this next
// import { FormProjectionDto } from ... (Using Any for speed in demo, strictly types in real)

interface Props {
    entityType?: string; // For Create
    entityUrn?: string;  // For Edit/View
    mode?: 'CREATE' | 'EDIT' | 'VIEW';
}

export const UniversalEntityForm: React.FC<Props> = ({ entityType, entityUrn, mode = 'VIEW' }) => {
    const [projection, setProjection] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjection();
    }, [entityType, entityUrn, mode]);

    const fetchProjection = async () => {
        setLoading(true);
        try {
            // Build Query
            let url = `/api/registry/entities/form-projection?mode=${mode}`;
            if (entityType) url += `&type=${entityType}`;
            if (entityUrn) url += `&urn=${entityUrn}`;

            const res = await axios.get(url);
            setProjection(res.data);

            // Initialize Form Values
            if (res.data.sections) {
                const initValues: any = {};
                res.data.sections.forEach((sec: any) => {
                    sec.fields.forEach((field: any) => {
                        initValues[field.code] = field.val;
                    });
                });
                form.setFieldsValue(initValues);
            }

        } catch (e: any) {
            notification.error({ message: 'Ошибка загрузки формы', description: e.message });
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = async (values: any) => {
        if (mode === 'VIEW') return; // Should not happen

        try {
            if (mode === 'CREATE') {
                await axios.post('/api/registry/entities', {
                    type: entityType, // or projection.entity_type
                    attributes: values
                });
                notification.success({ message: 'Сущность создана' });
                navigate(-1); // Go back
            } else {
                await axios.put(`/api/registry/entities/${entityUrn}`, {
                    attributes: values
                });
                notification.success({ message: 'Сущность обновлена' });
            }
        } catch (e: any) {
            notification.error({ message: 'Ошибка операции', description: e.response?.data?.message || e.message });
        }
    };

    if (loading) return <Spin size="large" />;
    if (!projection) return <div>Нет данных формы</div>;

    return (
        <Card title={projection.title}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                {projection.sections.map((section: any) => (
                    <div key={section.title} className="mb-6">
                        <h3 className="text-lg font-medium mb-4 border-b pb-2">{section.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.fields.map((field: any) => (
                                <Form.Item
                                    key={field.code}
                                    name={field.code}
                                    label={field.label}
                                    required={field.required}
                                    rules={[{ required: field.required, message: 'Обязательно' }]}
                                    tooltip={field.description}
                                >
                                    {/* Delegate to FieldRenderer which now handles Static Text too */}
                                    <FieldRenderer
                                        definition={{
                                            widget: field.widget || 'INPUT_TEXT',
                                            code: field.code,
                                            label: field.label,
                                            config: { required: field.required }
                                        }}
                                        value={field.val}
                                    />
                                </Form.Item>
                            ))}
                        </div>
                    </div>
                ))}

                {mode !== 'VIEW' && (
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => navigate(-1)}>Отмена</Button>
                        <Button type="primary" htmlType="submit">
                            {mode === 'CREATE' ? 'Create' : 'Save Changes'}
                        </Button>
                    </div>
                )}
                {mode === 'VIEW' && (
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => navigate(-1)}>Назад</Button>
                    </div>
                )}
            </Form>
        </Card>
    );
};
