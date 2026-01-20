/**
 * Registry Impact Viewer (Step 11 Canonical)
 * 
 * Read-only visualizer for Impact Analysis.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Spin, Card, List, Tag, Badge, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ImpactReportDto {
    root: { entityType: string; id: string; label: string };
    summary: { critical: number; high: number; medium: number; low: number };
    impacts: ImpactItemDto[];
}

interface ImpactItemDto {
    entityType: string;
    id: string;
    label: string;
    relation: string;
    impactType: string;
    severity: string;
    path: string[];
}

interface RegistryImpactViewerProps {
    entityType: string;
    entityId: string;
    viewName: string;
}

export const RegistryImpactViewer: React.FC<RegistryImpactViewerProps> = ({ entityType, entityId, viewName }) => {
    const navigate = useNavigate();
    const [report, setReport] = useState<ImpactReportDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImpact = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3000/api/impact/${entityType}/${entityId}?view=${viewName}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch impact report');
                }

                const data = await res.json();
                setReport(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchImpact();
    }, [entityType, entityId, viewName]);

    if (loading) return <Spin tip="Analyzing Impact..." />;
    if (error) return <Alert type="error" message={error} />;
    if (!report) return null;

    const severityColors: Record<string, string> = {
        critical: '#f5222d',
        high: '#fa8c16',
        medium: '#faad14',
        low: '#52c41a'
    };

    return (
        <div className="impact-viewer space-y-4">
            {/* Summary Panel */}
            <Card title="Impact Summary" size="small">
                <div className="flex gap-4">
                    {Object.entries(report.summary).map(([sev, count]) => (
                        <Badge key={sev} count={count} color={severityColors[sev]} showZero>
                            <div className="p-2 border rounded bg-gray-50 capitalize w-24 text-center">
                                {sev}
                            </div>
                        </Badge>
                    ))}
                </div>
            </Card>

            {/* Impact List */}
            <Card title="Affected Entities" size="small">
                <List
                    itemLayout="horizontal"
                    dataSource={report.impacts}
                    renderItem={item => (
                        <List.Item
                            actions={[<a key="view" onClick={() => navigate(`/app/entities/${item.entityType}/${item.id}`)}>View Details <ArrowRightOutlined /></a>]}
                        >
                            <List.Item.Meta
                                avatar={<Tag color={severityColors[item.severity]}>{item.severity.toUpperCase()}</Tag>}
                                title={<Text strong>{item.label}</Text>}
                                description={
                                    <div className="text-xs text-gray-500">
                                        Type: {item.impactType} | Relation: {item.relation} | Path: {item.path.join(' -> ')}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};
