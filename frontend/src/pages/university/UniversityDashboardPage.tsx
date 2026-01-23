import React from 'react';
import { Link } from 'react-router-dom';
import {
    GraduationCap,
    Users,
    Briefcase,
    Heart,
    Brain,
    Cpu,
    TrendingUp,
    BookOpen,
    Award,
    Building2
} from 'lucide-react';

interface AcademyCardProps {
    title: string;
    description: string;
    icon: any;
    path: string;
    coursesCount: number;
    skillsCount: number;
    color: string;
}

const AcademyCard: React.FC<AcademyCardProps> = ({
    title,
    description,
    icon: Icon,
    path,
    coursesCount,
    skillsCount,
    color
}) => (
    <Link
        to={path}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group flex flex-col h-full"
    >
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 flex-grow">
            {description}
        </p>
        <div className="flex items-center text-xs text-gray-400 space-x-4 pt-4 border-t border-gray-100">
            <span className="flex items-center">
                <BookOpen className="w-3 h-3 mr-1" />
                {coursesCount} курсов
            </span>
            <span className="flex items-center">
                <Award className="w-3 h-3 mr-1" />
                {skillsCount} навыков
            </span>
        </div>
    </Link>
);

const UniversityDashboardPage: React.FC = () => {
    const academies = [
        {
            title: 'Академия PhotoCraft',
            description: 'Техника съемки, свет, композиция, обработка',
            icon: GraduationCap,
            path: '/photocraft',
            coursesCount: 12,
            skillsCount: 45,
            color: 'bg-blue-600'
        },
        {
            title: 'Академия Продаж',
            description: 'Психология продаж, переговоры, кросс-продажи',
            icon: TrendingUp,
            path: '/sales',
            coursesCount: 8,
            skillsCount: 24,
            color: 'bg-green-600'
        },
        {
            title: 'Академия Сервиса',
            description: 'Сервис, работа с клиентами, решение конфликтов',
            icon: Heart,
            path: '/service', // Note: Assuming /service route based on context, though spec said Sales & Service might be combined or separate. Using /sales based on sidebar, but let's keep separate cards if needed or link to same. Wait, sidebar had /sales. Let's use /sales for now or distinct if spec implies. Spec says "Sales & Service" is one faculty usually, but image shows them separate? Image shows "Sales Excellence" and "Service & Customer Care". Let's follow image.
            coursesCount: 5,
            skillsCount: 15,
            color: 'bg-pink-600'
        },
        {
            title: 'Академия Ценностей',
            description: 'Миссия, этика, командная работа',
            icon: Users,
            path: '/culture',
            coursesCount: 4,
            skillsCount: 8,
            color: 'bg-purple-600'
        },
        {
            title: 'Академия Soft Skills',
            description: 'Эмоциональный интеллект, тайм-менеджмент, коммуникации',
            icon: Brain,
            path: '/personal',
            coursesCount: 10,
            skillsCount: 30,
            color: 'bg-yellow-500'
        },
        {
            title: 'Академия Технологий',
            description: 'Оборудование, ПО, IT-безопасность',
            icon: Cpu,
            path: '/tech',
            coursesCount: 6,
            skillsCount: 18,
            color: 'bg-indigo-600'
        },
        {
            title: 'Академия Лидерства',
            description: 'Управление, финансы, стратегия',
            icon: Briefcase,
            path: '/mgmt',
            coursesCount: 7,
            skillsCount: 20,
            color: 'bg-red-600'
        },
        {
            title: 'Институт обучающих',
            description: 'Методология обучения, наставничество, развитие талантов',
            icon: Users, // Different icon maybe?
            path: '/trainers',
            coursesCount: 3,
            skillsCount: 12,
            color: 'bg-teal-600'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Академий</p>
                        <p className="text-2xl font-bold text-gray-900">7</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-4">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Курсов</p>
                        <p className="text-2xl font-bold text-gray-900">55</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Навыков</p>
                        <p className="text-2xl font-bold text-gray-900">172</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Академии</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {academies.map((academy) => (
                    <AcademyCard key={academy.title} {...academy} />
                ))}
            </div>
        </div>
    );
};


export default UniversityDashboardPage;
