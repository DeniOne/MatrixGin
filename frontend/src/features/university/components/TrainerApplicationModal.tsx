import React, { useState } from 'react';
import {
    Modal,
    Form,
    Select,
    Alert,
    Typography,
    Button,
    Space,
    message
} from 'antd';
import {
    SafetyCertificateOutlined,
    RocketOutlined,
    BookOutlined
} from '@ant-design/icons';
import { useCreateTrainerMutation } from '../api/universityApi';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface TrainerApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TrainerApplicationModal: React.FC<TrainerApplicationModalProps> = ({ isOpen, onClose }) => {
    const [createTrainer, { isLoading }] = useCreateTrainerMutation();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            await createTrainer({
                specialty: values.specialty
            }).unwrap();

            message.success('Ваша заявка на получение статуса тренера успешно подана!');
            onClose();
        } catch (err: any) {
            message.error(`Ошибка при подаче заявки: ${err.data?.error || err.message}`);
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <SafetyCertificateOutlined className="text-indigo-600" />
                    <span>Подача заявки в Институт Тренерства</span>
                </Space>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={580}
            centered
        >
            <div className="space-y-6">
                <Alert
                    message="Важная информация"
                    description="Статус тренера накладывает юридически значимые обязательства. Вы будете нести ответственность за квалификацию подопечных и аудит их результатов."
                    type="info"
                    showIcon
                />

                <Paragraph>
                    <Text strong>Институт Тренерства MatrixGin</Text> — это элитное подразделение нашего университета.
                    Тренеры получают доступ к весу влияния в Qualification Engine и специальные награды в MC за успешную подготовку стажеров.
                </Paragraph>

                <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                    <Title level={5} className="m-0 flex items-center gap-2">
                        <BookOutlined className="text-[#717182]" />
                        Требования к кандидату
                    </Title>
                    <ul className="list-disc list-inside text-sm text-[#717182] space-y-1">
                        <li>Действующий грейд не ниже SENIOR</li>
                        <li>Стабильные показатели KPI за последние 3 месяца</li>
                        <li>Отсутствие критических нарушений канонов</li>
                        <li>Готовность уделять время наставничеству</li>
                    </ul>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="specialty"
                        label="Выберите специализацию обучения"
                        rules={[{ required: true, message: 'Пожалуйста, выберите специализацию' }]}
                    >
                        <Select placeholder="Специализация..." size="large">
                            <Option value="PHOTOGRAPHER">Фотограф (MES & Quality)</Option>
                            <Option value="SALES">Продажи (Leads & Conversion)</Option>
                            <Option value="DESIGNER">Дизайнер (Creative & Assets)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item className="mb-0 mt-8 flex justify-end">
                        <Space>
                            <Button onClick={onClose} disabled={isLoading}>Отмена</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                icon={<RocketOutlined />}
                                className="bg-indigo-600 border-none px-6"
                            >
                                Подать заявку
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};
