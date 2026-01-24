/**
 * Registry AI Ops Viewer (Step 12 Canonical)
 * 
 * Read-only visualizer for AI Recommendations.
 * Must enforce "Advisory Only" branding.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Spin, Card, List, Tag, Typography, Collapse } from 'antd';
import { RobotOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;
const { Panel } = Collapse;

interface AIOpsRecommendation {
    id: string;
    category: string;
    severity: string;
    title: string;
    reasoning: string;
    basedOn: {
        relations?: string[];
        impacts?: string[];
        nodes?: string[];
    };
    disclaimer: 'advisory-only';
}

interface AIOpsResponse {
    recommendations: AIOpsRecommendation[];
    metadata: {
        analyzedAt: string;
        model: string;
        determinism: boolean;
    };
}

interface RegistryAIOpsViewerProps {
    entityType: string;
    entityId: string;
}

export const RegistryAIOpsViewer: React.FC<RegistryAIOpsViewerProps> = ({ entityType, entityId }) => {
    // const navigate = useNavigate();
    const [data, setData] = useState<AIOpsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3000/api/ai-ops/${entityType}/${entityId}/analyze`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    throw new Error('Не удалось получить AI анализ');
                }

                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [entityType, entityId]);

    if (loading) return <Spin tip="Generating AI Recommendations..." />;
    if (error) return <Alert type="error" message={error} />;
    if (!data) return null;

    const severityColors: Record<string, string> = {
        critical: '#f5222d',
        high: '#fa8c16',
        medium: '#faad14',
        low: '#52c41a'
    };

    const categoryIcons: Record<string, React.ReactNode> = {
        risk: <SafetyCertificateOutlined />,
        stability: <RobotOutlined />, // Placeholder
        optimization: <RobotOutlined />, // Placeholder
        compliance: <SafetyCertificateOutlined />
    };

    return (
        <div className="ai-ops-viewer space-y-4">
            <Alert
                message="Режим AI-Советника"
                description="Эти рекомендации сгенерированы AI на основе графа реестра. Они носят информационный характер и не выполняют никаких действий."
                type="info"
                showIcon
                icon={<RobotOutlined />}
                className="mb-4"
            />

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={data.recommendations}
                renderItem={item => (
                    <List.Item>
                        <Card
                            size="small"
                            className={`border-l-4 ${item.severity === 'critical' ? 'border-red-500' : item.severity === 'high' ? 'border-orange-500' : 'border-green-500'}`}
                            title={
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2">
                                        {categoryIcons[item.category]}
                                        {item.title}
                                    </span>
                                    <Tag color={severityColors[item.severity]}>{item.severity.toUpperCase()}</Tag>
                                </div>
                            }
                        >
                            <Paragraph>{item.reasoning}</Paragraph>

                            <Collapse ghost size="small">
                                <Panel header="Why is this recommended?" key="1">
                                    <div className="text-xs text-[#717182]">
                                        <p>На основе данных:</p>
                                        <ul className="list-disc pl-4">
                                            {item.basedOn.relations && <li>Связи: {item.basedOn.relations.join(', ')}</li>}
                                            {item.basedOn.impacts && <li>Влияние: {item.basedOn.impacts.join(', ')}</li>}
                                        </ul>
                                        <p className="mt-2 text-[#717182]">Детерминированный ID: {item.id}</p>
                                    </div>
                                </Panel>
                            </Collapse>
                        </Card>
                    </List.Item>
                )}
            />

            <div className="text-right text-xs text-[#717182]">
                Модель: {data.metadata.model} | Analyzed: {new Date(data.metadata.analyzedAt).toLocaleTimeString()}
            </div>
        </div>
    );
};
