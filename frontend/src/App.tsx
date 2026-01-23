import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Foundation Module
import { FoundationLayout } from './layouts/FoundationLayout';
import { StartPage } from './pages/foundation/StartPage';
import { BlockPage } from './pages/foundation/BlockPage';
import { DecisionPage } from './pages/foundation/DecisionPage';
import { ResultPage } from './pages/foundation/ResultPage';

// Main App Pages
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
import { CourseReaderPage } from './pages/university/CourseReaderPage';
import { TrainerDashboardPage } from './pages/university/TrainerDashboardPage';
import { UniversitySecurityDashboard } from './pages/university/UniversitySecurityDashboard';
import { UniversityAnalyticsDashboard } from './pages/university/UniversityAnalyticsDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

// AI Module
import PersonalAIRecommendationsPage from './pages/ai/PersonalAIRecommendationsPage';
import ExecutiveAIRecommendationsPage from './pages/ai/ExecutiveAIRecommendationsPage';
// Economy Module
import StorePage from './pages/economy/StorePage';
import WalletPage from './pages/economy/WalletPage';
import TransactionsPage from './pages/economy/TransactionsPage';
import EconomyDashboard from './pages/economy/EconomyDashboard';
// Gamification
import LeaderboardPage from './pages/gamification/LeaderboardPage';
import AchievementsGallery from './components/gamification/AchievementsGallery';
import StatusProgressCard from './components/gamification/StatusProgressCard';
import QuestTracker from './components/gamification/QuestTracker';
// Production
import ProductionSessionsPage from './pages/production/ProductionSessionsPage';
// Admin
import StatusManagement from './pages/admin/StatusManagement';
// Layout
import Sidebar from './components/layout/Sidebar';

// Registry Module
import RegistryLayout from './registry/layout/RegistryLayout';
import RegistryHomePage from './registry/pages/RegistryHomePage';
import RegistryEntityListPage from './registry/pages/RegistryEntityListPage';
import { EntityPage } from './registry/pages/EntityPage';

// Personnel Module
import {
    PersonnelLayout,
    PersonnelFilesListPage,
    PersonalFileDetailPage,
    OrdersListPage,
    ContractsListPage,
    HRDashboardPage,
} from './pages/personnel';

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

import { RequireAuth } from './components/auth/RequireAuth';

// ... other imports ...

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* PUBLIC ROUTE */}
            <Route path="/login" element={<LoginPage />} />

            {/* ISOLATED REGISTRY MODULE (Protected?) - Assuming Protected for now */}
            <Route path="/registry" element={<RequireAuth><RegistryLayout /></RequireAuth>}>
                <Route index element={<RegistryHomePage />} />
                <Route path=":entityType" element={<RegistryEntityListPage />} />
                <Route path=":entityType/new" element={<EntityPage />} />
                <Route path=":entityType/:id" element={<EntityPage />} />
            </Route>

            {/* FOUNDATIONAL IMMERSION - STRICT ISOLATION (Protected) */}
            <Route path="/foundation" element={<RequireAuth><FoundationLayout /></RequireAuth>}>
                <Route index element={<Navigate to="start" replace />} />
                <Route path="start" element={<StartPage />} />
                <Route path="immersion/:blockId" element={<BlockPage />} />
                <Route path="decision" element={<DecisionPage />} />
                <Route path="result" element={<ResultPage />} />
            </Route>

            {/* MAIN APPLICATION (Protected) */}
            <Route path="*" element={
                <RequireAuth>
                    <AppLayout>
                        <Routes>
                            {/* Login moved out, but keep here if lazy routing requires it? No, duplicate routes are bad. Remove Login from here. */}
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
                            <Route path="/university/course/:enrollmentId" element={<CourseReaderPage />} />
                            <Route path="/university/trainer/dashboard" element={<TrainerDashboardPage />} />
                            <Route path="/university/admin/security" element={<UniversitySecurityDashboard />} />
                            <Route path="/university/admin/analytics" element={<UniversityAnalyticsDashboard />} />
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
                            <Route path="/admin/status-management" element={<StatusManagement />} />

                            {/* Personnel Module routes */}
                            <Route path="/personnel" element={<PersonnelLayout />}>
                                <Route index element={<PersonnelFilesListPage />} />
                                <Route path="files/:id" element={<PersonalFileDetailPage />} />
                                <Route path="orders" element={<OrdersListPage />} />
                                <Route path="contracts" element={<ContractsListPage />} />
                                <Route path="dashboard" element={<HRDashboardPage />} />
                            </Route>
                        </Routes>
                    </AppLayout>
                </RequireAuth>
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
