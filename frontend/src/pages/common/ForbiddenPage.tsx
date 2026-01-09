import React from 'react';

const ForbiddenPage: React.FC = () => (
  <div className="max-w-3xl mx-auto text-white">
    <h1 className="text-3xl font-bold mb-3">403 — Доступ запрещён</h1>
    <p className="text-gray-300">У вас нет прав доступа к этому разделу.</p>
  </div>
);

export default ForbiddenPage;
