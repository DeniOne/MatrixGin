import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import OFSPage from './pages/OFSPage';
import ExecutiveOFSPage from './pages/ofs/ExecutiveOFSPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';
import PersonalAnalyticsPage from './pages/analytics/PersonalAnalyticsPage';
import ExecutiveAnalyticsPage from './pages/analytics/ExecutiveAnalyticsPage';
import { UniversityPage } from './pages/UniversityPage';
import { MyCoursesPage } from './pages/MyCoursesPage';
// AI Module
import PersonalAIRecommendationsPage from './pages/ai/PersonalAIRecommendationsPage';
import ExecutiveAIRecommendationsPage from './pages/ai/ExecutiveAIRecommendationsPage';
// Economy Module
import StorePage from './pages/economy/StorePage';
import WalletPage from './pages/economy/WalletPage';
import TransactionsPage from './pages/economy/TransactionsPage';
import EconomyDashboard from './pages/economy/EconomyDashboard';
// Import gamification pages
import LeaderboardPage from './pages/gamification/LeaderboardPage';
import AchievementsGallery from './components/gamification/AchievementsGallery';
import StatusProgressCard from './components/gamification/StatusProgressCard';
import QuestTracker from './components/gamification/QuestTracker';
// Import production pages
import ProductionSessionsPage from './pages/production/ProductionSessionsPage';
// Import layout
import Sidebar from './components/layout/Sidebar';

// Registry Module
import RegistryLayout from './registry/layout/RegistryLayout';
import RegistryHomePage from './registry/pages/RegistryHomePage';
import RegistryEntityListPage from './registry/pages/RegistryEntityListPage';
// import RegistryEntityCreatePage from './registry/pages/RegistryEntityCreatePage';
// import RegistryEntityDetailPage from './registry/pages/RegistryEntityDetailPage';
import { EntityPage } from './registry/pages/EntityPage';

// Layout wrapper that shows sidebar except on login page
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-gray-950 text-white">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* ISOLATED REGISTRY MODULE */}
            <Route path="/registry" element={<RegistryLayout />}>
                <Route index element={<RegistryHomePage />} />
                <Route path=":entityType" element={<RegistryEntityListPage />} />
                <Route path=":entityType/new" element={<EntityPage />} />
                <Route path=":entityType/:id" element={<EntityPage />} />
            </Route>

            {/* MAIN APPLICATION */}
            <Route path="*" element={
                <AppLayout>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        import ManagerDashboard from './pages/ManagerDashboard';
                        ...
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/manager" element={<ManagerDashboard />} />
                        <Route path="/employees" element={<EmployeesPage />} />
                        <Route path="/profile" element={<EmployeeProfilePage />} />
                        <Route path="/departments" element={<OFSPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                        <Route path="/ofs" element={<ExecutiveOFSPage />} />
                        <Route path="/ofs/legacy" element={<OFSPage />} />
                        <Route path="/university" element={<UniversityPage />} />
                        <Route path="/my-courses" element={<MyCoursesPage />} />
                        {/* Gamification routes */}
                        <Route path="/gamification" element={<LeaderboardPage />} />
                        <Route path="/gamification/leaderboard" element={<LeaderboardPage />} />
                        <Route path="/gamification/achievements" element={<AchievementsGallery />} />
                        <Route path="/gamification/status" element={<StatusProgressCard />} />
                        <Route path="/gamification/quests" element={<QuestTracker />} />
                        {/* Analytics routes */}
                        <Route path="/analytics/personal" element={<PersonalAnalyticsPage />} />
                        <Route path="/analytics/executive" element={<ExecutiveAnalyticsPage />} />

                        {/* AI Recommendations routes */}
                        <Route path="/ai/recommendations/personal" element={<PersonalAIRecommendationsPage />} />
                        <Route path="/ai/recommendations/executive" element={<ExecutiveAIRecommendationsPage />} />

                        {/* Production routes */}
                        <Route path="/production/sessions" element={<ProductionSessionsPage />} />
                        {/* Economy routes */}
                        <Route path="/store" element={<StorePage />} />
                        <Route path="/economy/wallet" element={<WalletPage />} />
                        <Route path="/economy/transactions" element={<TransactionsPage />} />
                        <Route path="/economy/analytics" element={<EconomyDashboard />} />
                    </Routes>
                </AppLayout>
            } />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
