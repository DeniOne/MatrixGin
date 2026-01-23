import React, { useEffect, useState } from 'react';
import { Timeline, Card, Tag, Button, Modal } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios'; // Or generic API client
import { ReadOnlyEntityCard } from './ReadOnlyEntityCard';

interface HistoryTimelineProps {
    entityUrn: string;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ entityUrn }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
    const [snapshotData, setSnapshotData] = useState<any>(null);

    useEffect(() => {
        // Fetch History
        axios.get(`/api/registry/entities/${entityUrn}/history`)
            .then(res => setEvents(res.data))
            .catch(console.error);
    }, [entityUrn]);

    const handleViewSnapshot = async (eventId: string) => {
        setSelectedSnapshotId(eventId);
        try {
            const res = await axios.get(`/api/registry/entities/${entityUrn}/snapshots/${eventId}`);
            setSnapshotData(res.data.data); // Assuming wrapped response
        } catch (e) {
            console.error(e);
            setSnapshotData(null);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">История аудита</h3>
            <Timeline mode="left">
                {events.map(ev => (
                    <Timeline.Item
                        key={ev.id}
                        label={new Date(ev.created_at).toLocaleString()}
                        dot={ev.action === 'CREATE' ? <ClockCircleOutlined className="text-green-500" /> : undefined}
                    >
                        <Card size="small" className="mb-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Tag color="blue">{ev.action}</Tag> by {ev.actor_urn}
                                </div>
                                <Button size="small" onClick={() => handleViewSnapshot(ev.id)}>
                                    Просмотр снимка
                                </Button>
                            </div>
                        </Card>
                    </Timeline.Item>
                ))}
            </Timeline>

            <Modal
                open={!!selectedSnapshotId}
                title="Исторический снимок"
                width={800}
                onCancel={() => { setSelectedSnapshotId(null); setSnapshotData(null); }}
                footer={null}
            >
                {snapshotData ? (
                    <ReadOnlyEntityCard entity={snapshotData} />
                ) : (
                    <div className="p-4 text-center">Loading or Partial Data...</div>
                )}
            </Modal>
        </div>
    );
};
