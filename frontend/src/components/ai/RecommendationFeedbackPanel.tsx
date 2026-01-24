import React, { useState } from 'react';
import { useSubmitFeedbackMutation, FeedbackType } from '../../features/ai/aiApi';
import { ThumbsUp, ThumbsDown, HelpCircle, Loader2 } from 'lucide-react';
import { message } from 'antd';

interface RecommendationFeedbackPanelProps {
    recommendationId: string;
    onSubmitSuccess?: () => void;
    // PHASE 4.5 - Context Binding
    snapshotId?: string;
    aiVersion?: string;
    ruleSetVersion?: string;
}

const RecommendationFeedbackPanel: React.FC<RecommendationFeedbackPanelProps> = ({
    recommendationId,
    onSubmitSuccess,
    snapshotId,
    aiVersion,
    ruleSetVersion,
}) => {
    const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
    const [comment, setComment] = useState('');
    const [submitFeedback, { isLoading, isSuccess }] = useSubmitFeedbackMutation();

    const handleSubmit = async () => {
        if (!selectedType) return;

        try {
            await submitFeedback({
                recommendationId,
                feedbackType: selectedType,
                comment: comment.trim() || undefined,
                // PHASE 4.5 - Context Binding
                basedOnSnapshotId: snapshotId,
                aiVersion,
                ruleSetVersion,
            }).unwrap();

            // PHASE 4.5 - Critical UX message
            message.success({
                content: 'Спасибо. Это не меняет систему автоматически.',
                duration: 5,
                icon: '✓',
            });

            onSubmitSuccess?.();
        } catch (error: any) {
            // RTK Query error handling
            const status = error?.status || error?.originalStatus;
            const errorMessage = error?.data?.error || error?.data?.message || error?.message;

            if (status === 409) {
                message.info('Вы уже оставили отзыв на эту рекомендацию');
            } else if (status === 422) {
                // PHASE 4.5 - Ethics violation
                message.error(errorMessage || 'Пожалуйста, используйте конструктивные формулировки');
            } else {
                message.error('Ошибка отправки отзыва');
            }
        }
    };

    return (
        <div className="space-y-6 p-6 bg-white/40 border border-black/10 rounded-2xl">
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#717182] uppercase tracking-widest">
                    Насколько полезна эта рекомендация?
                </h4>
                <p className="text-xs text-[#717182] font-light">
                    Ваш отзыв помогает улучшить качество рекомендаций, но не влияет на систему автоматически.
                </p>
            </div>

            {/* 3 кнопки выбора */}
            <div className="grid grid-cols-3 gap-3">
                <FeedbackButton
                    icon={<ThumbsUp className="w-5 h-5" />}
                    label="Полезно"
                    selected={selectedType === FeedbackType.HELPFUL}
                    onClick={() => setSelectedType(FeedbackType.HELPFUL)}
                    disabled={isSuccess}
                />
                <FeedbackButton
                    icon={<ThumbsDown className="w-5 h-5" />}
                    label="Не применимо"
                    selected={selectedType === FeedbackType.NOT_APPLICABLE}
                    onClick={() => setSelectedType(FeedbackType.NOT_APPLICABLE)}
                    disabled={isSuccess}
                />
                <FeedbackButton
                    icon={<HelpCircle className="w-5 h-5" />}
                    label="Не уверен"
                    selected={selectedType === FeedbackType.UNSURE}
                    onClick={() => setSelectedType(FeedbackType.UNSURE)}
                    disabled={isSuccess}
                />
            </div>

            {/* Опциональный комментарий */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-[#717182] uppercase tracking-widest">
                    Комментарий (опционально)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    placeholder="Поделитесь деталями..."
                    disabled={isSuccess}
                    className="w-full p-3 bg-gray-950 border border-black/10 rounded-xl text-sm text-gray-300 placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors disabled:opacity-50 resize-none"
                    rows={3}
                />
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">{comment.length}/500</span>
                    {comment.length >= 450 && (
                        <span className="text-amber-500 font-medium">Приближается лимит</span>
                    )}
                </div>
            </div>

            {/* Submit button */}
            <button
                onClick={handleSubmit}
                disabled={!selectedType || isLoading || isSuccess}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-600 text-[#030213] font-medium uppercase tracking-widest text-xs rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSuccess ? '✓ Отправлено' : 'Отправить отзыв'}
            </button>
        </div>
    );
};

// Вспомогательный компонент кнопки
interface FeedbackButtonProps {
    icon: React.ReactNode;
    label: string;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
    icon,
    label,
    selected,
    onClick,
    disabled,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                ${selected
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-white/40 border-black/10 text-[#717182] hover:border-gray-700'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            {icon}
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </button>
    );
};

export default RecommendationFeedbackPanel;
