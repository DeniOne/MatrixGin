import type { ThemeConfig } from 'antd';

// Конфигурация темы "Awesome Reference" (Untitled-1.css)
const matrixGinTheme: ThemeConfig = {
    token: {
        // --- ЦВЕТА (Из Untitled-1.css) ---
        // --primary: #030213 (Black/Dark) - но для бренда оставим синий, если пользователь не просил менять бренд.
        // В скрине "Awesome" есть синие полоски.
        colorPrimary: '#3B82F6',
        colorInfo: '#3B82F6',

        // --- ФОН ---
        // Используем --input-background (#f3f3f5) для общего фона, чтобы белые карточки выделялись
        colorBgLayout: '#F3F3F5',
        colorBgContainer: '#FFFFFF', // --card: #ffffff

        // --- ГРАНИЦЫ ---
        // --border: rgba(0, 0, 0, 0.1) - это КЛЮЧЕВОЙ момент. Прозрачный черный.
        colorBorder: 'rgba(0, 0, 0, 0.1)',
        colorSplit: 'rgba(0, 0, 0, 0.1)',

        // --- ТЕКСТ ---
        colorText: '#030213', // --foreground (oklch converted roughly or --secondary-foreground)
        colorTextSecondary: '#717182', // --muted-foreground: #717182

        // --- ШРИФТЫ ---
        fontFamily: `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        fontWeightStrong: 500, // --font-weight-medium: 500

        // --- СКРУГЛЕНИЯ ---
        borderRadius: 10, // --radius: 0.625rem (10px)
        borderRadiusLG: 12,
        borderRadiusSM: 6,

        // --- ТЕНИ ---
        // В CSS файле теней нет (utility classes).
        // Эмулируем стандартный Tailwind shadow-sm + border
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    components: {
        Layout: {
            headerBg: '#FFFFFF',
            siderBg: '#FFFFFF',
            triggerBg: '#FFFFFF',
            triggerColor: '#717182',
            bodyBg: '#F3F3F5', // --input-background
        },
        Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#e9ebef', // --accent: #e9ebef
            itemSelectedColor: '#030213', // --accent-foreground
            itemColor: '#717182',
        },
        Card: {
            // Ключевой стиль: Белая карточка + Бордер 10% черного + Легкая тень
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            colorBorderSecondary: 'rgba(0, 0, 0, 0.1)',
            headerFontSize: 16,
            headerFontWeight: 500,
        },
        Button: {
            fontWeight: 500,
            defaultShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        }
    },
};

export default matrixGinTheme;
