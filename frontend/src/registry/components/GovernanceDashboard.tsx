import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Table, Card, Select, Button, Tag, Badge } from 'antd';

export const GovernanceDashboard: React.FC = () => {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Projection Map State
    const [entityType, setEntityType] = useState<string>('urn:mg:entity:employee'); // Default/Mock for demo
    const [role, setRole] = useState<string>('REGISTRY_USER');
    const [projectionMap, setProjectionMap] = useState<any>(null);

    useEffect(() => {
        fetchSnapshot();
    }, []);

    const fetchSnapshot = async () => {
        try {
            const res = await axios.get('/api/registry/governance/snapshot');
            setRules(res.data.rules);
        } catch (e) { console.error(e); }
    };

    const fetchProjectionMap = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/registry/governance/projection-map?entity_type=${entityType}&role=${role}`);
            setProjectionMap(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Registry Governance Observability</h1>

            <Tabs items={[
                {
                    key: '1',
                    label: 'Visibility Snapshot (Active Rules)',
                    children: (
                        <Card title="Current Visibility Rules (Read-Only)">
                            <Table
                                dataSource={rules}
                                rowKey={(r) => r.scope + r.targetPattern}
                                pagination={false}
                                columns={[
                                    { title: 'Scope', dataIndex: 'scope', render: (t) => <Tag color="blue">{t}</Tag> },
                                    { title: 'Target Pattern', dataIndex: 'targetPattern', render: (t) => <code className="bg-gray-100 p-1">{t}</code> },
                                    { title: 'Role Condition', dataIndex: 'roleCondition' },
                                    { title: 'Effect', dataIndex: 'effect', render: (t) => <Tag color={t === 'EXCLUDE' ? 'red' : 'green'}>{t}</Tag> },
                                ]}
                            />
                        </Card>
                    )
                },
                {
                    key: '2',
                    label: 'Projection Map (Diagnostic)',
                    children: (
                        <div className="space-y-4">
                            <Card title="Projection Diagnostics">
                                <div className="flex gap-4 items-end mb-4">
                                    <div className="w-64">
                                        <label className="block text-sm font-medium mb-1">Entity Type URN</label>
                                        <input
                                            className="w-full border p-2 rounded"
                                            value={entityType}
                                            onChange={(e) => setEntityType(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-48">
                                        <label className="block text-sm font-medium mb-1">Simulated Role</label>
                                        <Select
                                            className="w-full"
                                            value={role}
                                            onChange={setRole}
                                            options={[
                                                { value: 'REGISTRY_ADMIN', label: 'Admin' },
                                                { value: 'REGISTRY_USER', label: 'User' },
                                                { value: 'GUEST', label: 'Guest' },
                                            ]}
                                        />
                                    </div>
                                    <Button type="primary" onClick={fetchProjectionMap} loading={loading}>
                                        Analyze Projection
                                    </Button>
                                </div>

                                {projectionMap && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border rounded p-4 bg-white">
                                            <h3 className="font-bold text-green-700 mb-2">Visible Attributes ({projectionMap.visible_attributes.length})</h3>
                                            <ul className="list-disc pl-5">
                                                {projectionMap.visible_attributes.map((a: any) => (
                                                    <li key={a.code}>{a.code} ({a.data_type})</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="border rounded p-4 bg-red-50">
                                            <h3 className="font-bold text-red-700 mb-2">Hidden / Pruned ({projectionMap.hidden_attributes.length})</h3>
                                            <ul className="list-disc pl-5">
                                                {projectionMap.hidden_attributes.map((a: any) => (
                                                    <li key={a.code} className="text-red-600 font-mono">{a.code}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    )
                }
            ]} />

            {/* Added Policy Simulator Tab */}
            <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Policy Simulator (Safe Mode)</h2>
                <PolicySimulator />
            </div>
        </div>
    );
};

// Sub-component for clarity
const PolicySimulator: React.FC = () => {
    const [entityType, setEntityType] = useState('urn:mg:entity:employee');
    const [role, setRole] = useState('REGISTRY_USER');
    const [overlayRule, setOverlayRule] = useState({
        scope: 'ATTRIBUTE',
        targetPattern: 'email',
        roleCondition: '!REGISTRY_ADMIN',
        effect: 'EXCLUDE'
    });
    const [diff, setDiff] = useState<any>(null);

    const handleSimulate = async () => {
        try {
            const res = await axios.post('/api/registry/simulation/diff', {
                entity_type: entityType,
                role,
                overlay_rules: [overlayRule]
            });
            setDiff(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Card title="Run 'What If' Analysis">
            <div className="flex gap-4 items-end mb-4">
                <div className="w-1/4">
                    <label className="block text-sm font-medium">Target Entity</label>
                    <input className="border p-2 w-full" value={entityType} onChange={e => setEntityType(e.target.value)} />
                </div>
                <div className="w-1/4">
                    <label className="block text-sm font-medium">Simulated Role</label>
                    <Select className="w-full" value={role} onChange={setRole} options={[{ value: 'REGISTRY_USER', label: 'User' }, { value: 'REGISTRY_ADMIN', label: 'Admin' }]} />
                </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
                <h4 className="font-bold text-yellow-800 mb-2">Simulate Adding Rule:</h4>
                <div className="flex gap-2">
                    <Select value={overlayRule.scope} onChange={v => setOverlayRule({ ...overlayRule, scope: v })} options={[{ value: 'ATTRIBUTE', label: 'Attribute' }, { value: 'RELATIONSHIP', label: 'Relationship' }]} />
                    <input className="border p-1" placeholder="Target Pattern" value={overlayRule.targetPattern} onChange={e => setOverlayRule({ ...overlayRule, targetPattern: e.target.value })} />
                    <input className="border p-1" placeholder="Role Condition" value={overlayRule.roleCondition} onChange={e => setOverlayRule({ ...overlayRule, roleCondition: e.target.value })} />
                    <Select value={overlayRule.effect} onChange={v => setOverlayRule({ ...overlayRule, effect: v })} options={[{ value: 'EXCLUDE', label: 'EXCLUDE' }]} />
                    <Button type="primary" onClick={handleSimulate}>Simulate Diff</Button>
                </div>
            </div>

            {diff && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 border border-green-200 rounded">
                        <h4 className="font-bold text-green-800">Added Visibility (Visible -&gt; Hidden?) No, Hidden -&gt; Visible</h4>
                        {/* Wait, if we EXCLUDE, we expect attributes to move to Removed Visible */}
                        <ul className="list-disc pl-5">
                            {diff.added_visible_attributes.map((a: string) => <li key={a}>{a}</li>)}
                        </ul>
                    </div>
                    <div className="bg-red-50 p-4 border border-red-200 rounded">
                        <h4 className="font-bold text-red-800">Removed Visibility (Visible -&gt; Hidden)</h4>
                        <ul className="list-disc pl-5">
                            {diff.removed_visible_attributes.map((a: string) => <li key={a} className="font-mono">{a}</li>)}
                        </ul>
                        {diff.removed_visible_attributes.length === 0 && <span className="text-gray-400 text-sm">No changes detected</span>}
                    </div>
                </div>
            )}
        </Card>
    );
}
