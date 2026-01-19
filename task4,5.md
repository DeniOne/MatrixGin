# PHASE 4.5 — AI FEEDBACK LOOP (Human-in-the-Loop)

## Цель
Добавить механизм сбора обратной связи от пользователей на AI-рекомендации без передачи AI контроля над системой.

---

## 🔴 CRITICAL (Foundation)

### P45-PR-01 — Frontend: Feedback UI Component
- [x] Создать [RecommendationFeedbackPanel.tsx](file:///f:/Matrix_Gin/frontend/src/components/ai/RecommendationFeedbackPanel.tsx)
  - [x] 3 кнопки: 👍 Полезно / 👎 Не применимо / 🤔 Не уверен
  - [x] Опциональное текстовое поле (max 500 chars)
  - [x] Disabled state до прочтения рекомендации
  - [x] Стилизация в соответствии с дизайн-системой
- [x] Интегрировать в [RecommendationDetailsDrawer.tsx](file:///f:/Matrix_Gin/frontend/src/components/ai/RecommendationDetailsDrawer.tsx)
  - [x] Добавить панель feedback в footer drawer
  - [x] Обработка состояний (loading, success, error)


### P45-PR-02 — Backend: Feedback Persistence
- [x] Создать Prisma модель [AIFeedback](file:///f:/Matrix_Gin/backend/src/ai-ops/ai-feedback.service.ts#16-75)
  - [x] Поля: [id](file:///f:/Matrix_Gin/frontend/src/features/ai/aiApi.ts#69-71), `recommendationId`, `userId`, `feedbackType`, `comment`, `timestamp`
  - [x] Unique constraint: `[userId, recommendationId]`
  - [x] Индексы для производительности
- [x] Создать DTO: [SubmitFeedbackDto](file:///f:/Matrix_Gin/backend/src/ai-ops/dto/submit-feedback.dto.ts#14-27), [FeedbackResponseDto](file:///f:/Matrix_Gin/frontend/src/features/ai/aiApi.ts#45-52)
- [x] Создать [ai-feedback.service.ts](file:///f:/Matrix_Gin/backend/src/ai-ops/ai-feedback.service.ts)
  - [x] [submitFeedback()](file:///f:/Matrix_Gin/backend/src/ai-ops/ai-feedback.service.ts#20-74) — сохранение с idempotency
  - [x] Валидация: max 500 chars, sanitization
- [x] Создать endpoint `POST /api/ai/feedback`
  - [x] Добавить в [ai-ops.controller.ts](file:///f:/Matrix_Gin/backend/src/ai-ops/ai-ops.controller.ts)
  - [x] Обработка ошибок (409 для дубликатов)
- [x] Миграция БД: `npx prisma migrate dev`


---

## 🟡 HIGH (Traceability)

### P45-PR-03 — Context Binding
- [ ] Расширить модель [AIFeedback](file:///f:/Matrix_Gin/backend/src/ai-ops/ai-feedback.service.ts#16-75)
  - [ ] Добавить: `basedOnSnapshotId`, `aiVersion`, `ruleSetVersion`
  - [ ] Метаданные для воспроизводимости
- [ ] Обновить [ai-ops.service.ts](file:///f:/Matrix_Gin/backend/src/ai-ops/ai-ops.service.ts)
  - [ ] Включить версионную информацию в response
  - [ ] Передавать snapshot ID в рекомендации
- [ ] Обновить [submitFeedback()](file:///f:/Matrix_Gin/backend/src/ai-ops/ai-feedback.service.ts#20-74) для сохранения контекста

---

## 🟡 MEDIUM (UX & Governance)

### P45-PR-04 — User Acknowledgement UI
- [x] Создать Toast notification
  - [x] Текст: "Спасибо. Это не меняет систему автоматически."
  - [x] Показывать после успешной отправки feedback
- [x] Интегрировать в [RecommendationFeedbackPanel.tsx](file:///f:/Matrix_Gin/frontend/src/components/ai/RecommendationFeedbackPanel.tsx)


### P45-PR-05 — Ethics Guard
- [ ] Создать `feedback-ethics.guard.ts`
  - [ ] Запрет оценок людей (regex patterns)
  - [ ] Фильтрация токсичных формулировок
  - [ ] Whitelist/blacklist keywords
- [ ] Интегрировать в [ai-feedback.service.ts](file:///f:/Matrix_Gin/backend/src/ai-ops/ai-feedback.service.ts)
  - [ ] Валидация перед сохранением
  - [ ] Возврат 422 при нарушении этики

### P45-PR-06 — Internal Analytics Dashboard
- [ ] Создать `AIFeedbackAnalyticsPage.tsx`
  - [ ] Агрегаты: % полезных, % отклонённых
  - [ ] Топ причин отклонения (из комментариев)
  - [ ] Без user-level breakdown (только агрегаты)
- [ ] Создать endpoint `GET /api/ai/feedback/analytics`
  - [ ] Restricted: только для AI-команды
  - [ ] Агрегированные данные

---

## 📄 DOCS

### P45-PR-07 — Documentation Sync
- [ ] Обновить `ARCHITECTURE.md`
  - [ ] Секция: AI Feedback Loop
  - [ ] Диаграмма: feedback flow
- [ ] Обновить `AI_CONSTITUTION.md`
  - [ ] Зафиксировать: feedback ≠ control
  - [ ] Зафиксировать: feedback ≠ learning
- [ ] Обновить `MASTER_CHECKLIST.md`
  - [ ] Отметить Phase 4.5 как in-progress
- [ ] Создать `AI_FEEDBACK_LIFECYCLE.md`
  - [ ] Описание жизненного цикла feedback данных
  - [ ] Retention policy, архивация

---

## Acceptance Criteria (общие)

✅ Feedback не влияет на delivery рекомендаций  
✅ Нет призывов к действию в UI  
✅ Пользователь понимает добровольность  
✅ Полная трассируемость (snapshot + AI version + ruleset)  
✅ Immutable storage  
✅ Нет персональных оценок людей  
✅ Idempotency: 1 feedback / recommendation / user  
