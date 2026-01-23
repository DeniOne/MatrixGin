import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Tabs, List, Tag, Button, Modal, Form, Select, Radio, Input, message } from 'antd';
import { mesApi, ProductionOrder } from '../../api/mes.api';

const { TabPane } = Tabs;

const ProductionOrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<ProductionOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [isQCModalVisible, setIsQCModalVisible] = useState(false);
    const [qcForm] = Form.useForm();

    const fetchOrder = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await mesApi.getOrder(id);
            setOrder(data);
        } catch (error) {
            message.error('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleQCSubmit = async (values: any) => {
        try {
            await mesApi.registerCheck({
                production_order_id: id,
                ...values
            });
            message.success('Quality Check Registered');
            setIsQCModalVisible(false);
            fetchOrder();
        } catch (error) {
            message.error('Failed to register QC');
        }
    };

    if (!order) return <div>Загрузка...</div>;

    return (
        <div style={{ padding: 24 }}>
            <Card title={`Order ${order.product_type} (${order.status})`} loading={loading}>
                <Descriptions bordered>
                    <Descriptions.Item label="ID">{order.id}</Descriptions.Item>
                    <Descriptions.Item label="Количество">{order.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Источник">{order.source_type}</Descriptions.Item>
                    <Descriptions.Item label="Статус"><Tag color="blue">{order.status}</Tag></Descriptions.Item>
                </Descriptions>
            </Card>

            <div style={{ marginTop: 24 }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Work Orders" key="1">
                        <List
                            dataSource={order.work_orders || []}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`${item.sequence_order}. ${item.operation_type}`}
                                        description={<Tag>{item.status}</Tag>}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>
                    <TabPane tab="Quality & Defects" key="2">
                        <Button type="primary" onClick={() => setIsQCModalVisible(true)} style={{ marginBottom: 16 }}>
                            Проверка качества реестра
                        </Button>

                        <h3>Проверки</h3>
                        <List
                            dataSource={order.quality_checks || []}
                            renderItem={item => (
                                <List.Item>
                                    <Tag color={item.result === 'PASS' ? 'green' : 'red'}>{item.result}</Tag>
                                    {item.check_type} - {item.comments}
                                </List.Item>
                            )}
                        />

                        <h3>Дефекты</h3>
                        <List
                            dataSource={order.defects || []}
                            renderItem={item => (
                                <List.Item>
                                    <Tag color="red">{item.severity}</Tag>
                                    {item.defect_type} {item.resolved ? <Tag color="green">RESOLVED</Tag> : <Tag color="orange">OPEN</Tag>}
                                </List.Item>
                            )}
                        />
                    </TabPane>
                </Tabs>
            </div>

            <Modal
                title="Проверка качества реестра"
                open={isQCModalVisible}
                onCancel={() => setIsQCModalVisible(false)}
                onOk={() => qcForm.submit()}
            >
                <Form form={qcForm} onFinish={handleQCSubmit} layout="vertical">
                    <Form.Item name="check_type" label="Тип" initialValue="VISUAL">
                        <Select>
                            <Select.Option value="VISUAL">Визуальный</Select.Option>
                            <Select.Option value="MEASUREMENT">Измерение</Select.Option>
                            <Select.Option value="FUNCTIONAL">Функциональный</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="result" label="Результат" initialValue="PASS">
                        <Radio.Group>
                            <Radio value="PASS">PASS</Radio>
                            <Radio value="FAIL">FAIL</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="comments" label="Комментарии">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductionOrderDetailPage;
