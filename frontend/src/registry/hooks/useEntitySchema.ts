
import { useState, useEffect } from 'react';
import { EntitySchemaDto } from '../types/schema';
import { registrySchemaApi } from '../api/schema.api';

interface UseEntitySchemaResult {
    schema: EntitySchemaDto | null;
    isLoading: boolean;
    error: string | null;
    reload: () => void;
}

export const useEntitySchema = (entityTypeUrn: string): UseEntitySchemaResult => {
    const [schema, setSchema] = useState<EntitySchemaDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSchema = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await registrySchemaApi.getSchema(entityTypeUrn);
            setSchema(data);
        } catch (err: any) {
            console.error('Failed to fetch entity schema:', err);
            setError(err.message || 'Failed to load schema');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (entityTypeUrn) {
            fetchSchema();
        }
    }, [entityTypeUrn]);

    return { schema, isLoading, error, reload: fetchSchema };
};
