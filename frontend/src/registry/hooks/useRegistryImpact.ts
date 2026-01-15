import { useState } from 'react';
import { registrySchemaApi } from '../api/schema.api';
import { ImpactReport } from '../types/schema';

export const useRegistryImpact = () => {
    const [impactReport, setImpactReport] = useState<ImpactReport | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const clearImpact = () => setImpactReport(null);

    const analyzeLink = async (sourceUrn: string, targetUrn: string, definitionUrn: string) => {
        setIsAnalyzing(true);
        try {
            const report = await registrySchemaApi.previewImpact(
                sourceUrn,
                'RELATIONSHIP_CREATE',
                { definition_urn: definitionUrn, to_urn: targetUrn }
            );
            setImpactReport(report);
            return report;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const analyzeUnlink = async (relationshipId: string) => {
        setIsAnalyzing(true);
        try {
            // Unlink logic would go here
            const report = await registrySchemaApi.previewImpact(
                'N/A', // Relationship ID isn't a URN usually, might need adjustment in API
                'RELATIONSHIP_DELETE',
                { relationship_id: relationshipId }
            );
            setImpactReport(report);
            return report;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const analyzeReplace = async (relationshipId: string, newTargetUrn: string) => {
        setIsAnalyzing(true);
        try {
            const report = await registrySchemaApi.previewImpact(
                'N/A',
                'RELATIONSHIP_UPDATE',
                { relationship_id: relationshipId, new_to_urn: newTargetUrn }
            );
            setImpactReport(report);
            return report;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    };

    return {
        analyzeLink,
        analyzeUnlink,
        analyzeReplace,
        impactReport,
        isAnalyzing,
        clearImpact
    };
};
