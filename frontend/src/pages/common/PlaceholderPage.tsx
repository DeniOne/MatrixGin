import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
    title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
                <Construction className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-lg text-gray-600 max-w-md">
                Этот раздел находится в активной разработке.
                Мы работаем над тем, чтобы сделать его максимально полезным для вас.
            </p>
            <div className="mt-8 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                Статус: В разработке 🚧
            </div>
        </div>
    );
};

export default PlaceholderPage;
