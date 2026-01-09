import React from 'react';
import { PlayCircle, Download, Star } from 'lucide-react';

const TechSoftwarePage: React.FC = () => {
    const courses = [
        {
            id: '1',
            title: 'Adobe Lightroom: Основы цветокоррекции',
            duration: '45 мин',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400',
            hasPreset: true
        },
        {
            id: '2',
            title: 'Photoshop: Ретушь портретов',
            duration: '1ч 20мин',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400',
            hasPreset: false
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Уроки по ПО</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="h-48 relative bg-gray-100">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                    <PlayCircle className="w-10 h-10 text-indigo-600 fill-current" />
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span>{course.duration}</span>
                                <span className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                                    {course.rating}
                                </span>
                            </div>
                            {course.hasPreset && (
                                <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 flex items-center justify-center">
                                    <Download className="w-4 h-4 mr-2" />
                                    Скачать пресет
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechSoftwarePage;
