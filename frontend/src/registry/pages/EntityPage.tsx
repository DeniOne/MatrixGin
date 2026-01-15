
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityCardRenderer } from '../components/EntityCardRenderer';

export const EntityPage: React.FC = () => {
    // Route defined as :entityType in App.tsx
    const { entityType, id } = useParams<{ entityType: string; id: string }>();
    const navigate = useNavigate();

    if (!entityType) {
        return <div>Error: Entity Type is required</div>;
    }

    return (
        <EntityCardRenderer
            entityTypeUrn={decodeURIComponent(entityType)}
            entityId={id}
            onClose={() => navigate(-1)}
        />
    );
};
