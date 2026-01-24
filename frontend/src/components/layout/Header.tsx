import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { useAuth } from '../../features/auth/useAuth';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';
import WalletWidget from '../economy/WalletWidget';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-6">
            <div className="flex items-center">
                {/* Breadcrumbs or Page Title could go here */}
            </div>

            <div className="flex items-center space-x-4">
                <WalletWidget />

                <button className="p-2 text-[#717182] hover:text-[#030213] rounded-full hover:bg-gray-800 transition-colors">
                    <Bell className="w-5 h-5" />
                </button>

                <div className="h-8 w-px bg-gray-700 mx-2" />

                <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-[#030213]">
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-xs text-[#717182]">
                            {user?.role}
                        </div>
                    </div>

                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Пользователь" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <UserIcon className="w-6 h-6 text-[#717182]" />
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-[#717182] hover:text-red-400 rounded-full hover:bg-gray-800 transition-colors ml-2"
                        title="Выйти"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
