# MEMORY: Foundation Admission Gate Seeded (v2.2-canon)
**Дата:** 2026-01-26

## Событие
Успешно выполнено сидирование Контура Допуска (Foundational Admission Gate) в соответствии с Каноном 2.2. Фундаментальный уровень переведен из категории «обучение» в категорию «системный порог допуска».

## Технические детали
- **Скрипт:** `backend/scripts/seed-foundation-gate.ts`
- **Команда:** `npm run seed:foundation` (из папки `backend`)
- **Контентный хеш (SHA-256):** `a3f6fa231345b2dfce0f881060a32ee6dd3f89b8f1423f5e294ae7337adeb82e`
- **Версия:** `v2.2-canon`
- **Логика:** Хеш сохранен в `FoundationAuditLog` для юридической фиксации «что именно принял пользователь».

## Как запустить повторно
При любых изменениях в файлах гейта:
`documentation/01-modules/13-Corporate-University/University structure/FOUNDATIONAL/*.md`

Необходимо выполнить:
```bash
cd backend
npm run seed:foundation
```

## Методологические изменения
1. **Admission ≠ Learning:** Исключена педагогика. Контур бинарен: либо `ACCEPTED`, либо нет доступа.
2. **Acceptance Markers:** Каждый блок содержит жесткую формулировку «Пакта Улисса», которую пользователь подтверждает в системе.
3. **Audit First:** Первоочередная задача гейта — фиксация юридического факта согласия с правилами.
