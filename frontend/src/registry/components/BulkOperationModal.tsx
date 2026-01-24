import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Select, Input, message } from 'antd';
import { BulkImpactPreview } from './BulkImpactPreview';

interface BulkOperationModalProps {
    visible: boolean;
    targets: string[]; // URNs
    onClose: () => void;
    onSuccess: () => void;
}

export const BulkOperationModal: React.FC<BulkOperationModalProps> = ({ visible, targets, onClose, onSuccess }) => {
    const [step, setStep] = useState<'CONFIG' | 'PREVIEW' | 'RESULT'>('CONFIG');
    const [operation, setOperation] = useState('ATTRIBUTE_SET');
    const [payload, setPayload] = useState<any>({});
    const [previewData, setPreviewData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handlePreview = async () => {
        setLoading(true);
        try {
            // Raw Intent: No UI Validation
            const res = await axios.post('/api/registry/bulk/impact/preview', {
                operation,
                targets,
                payload
            });
            setPreviewData(res.data);
            setStep('PREVIEW');
        } catch (err: any) {
            message.error('Preview Failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCommit = async () => {
        setLoading(true);
        try {
            await axios.post('/api/registry/bulk/commit', {
                operation,
                targets,
                payload
            });
            message.success('Bulk Operation Completed');
            onSuccess();
            onClose();
        } catch (err: any) {
            message.error('Commit Failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const isCommitDisabled = !previewData?.summary?.canCommit;

    return (
        <Modal
            open={visible}
            title={`Bulk Operation (${targets.length} Items)`}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            {step === 'CONFIG' && (
                <div className="space-y-4">
                    <div>
                        <label>Operation Type</label>
                        <Select
                            className="w-full"
                            value={operation}
                            onChange={setOperation}
                            options={[
                                { value: 'ATTRIBUTE_SET', label: 'Set Attribute' },
                                { value: 'RELATIONSHIP_LINK', label: 'Link Entity' },
                                { value: 'RELATIONSHIP_UNLINK', label: 'Unlink Entity' },
                            ]}
                        />
                    </div>
                    {/* Simplified Payload Input for MVP */}
                    <div>
                        <label>Payload (JSON)</label>
                        <Input.TextArea
                            rows={4}
                            value={JSON.stringify(payload)}
                            onChange={e => {
                                try {
                                    setPayload(JSON.parse(e.target.value));
                                } catch (e) { /* ignore invalid json while typing */ }
                            }}
                        />
                        <div className="text-xs text-[#717182] mt-1">
                            Example: {"{"}"key": "status", "value": "active"{"}"}
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button type="primary" onClick={handlePreview} loading={loading}>
                            Проверить влияние
                        </Button>
                    </div>
                </div>
            )}

            {step === 'PREVIEW' && previewData && (
                <div className="space-y-4">
                    <BulkImpactPreview
                        summary={previewData.summary}
                        details={previewData.details}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setStep('CONFIG')}>Назад</Button>
                        <Button
                            type="primary"
                            danger={!isCommitDisabled}
                            onClick={handleCommit}
                            disabled={isCommitDisabled}
                            loading={loading}
                        >
                            {isCommitDisabled ? 'Blocked by Registry' : 'Confirm Commit'}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
