# MODULE 34 — DIALOGUE CAPTURE & CONSENT
DEVELOPMENT CHECKLIST
STATUS: DESIGN ONLY

---

## ФАЗА 0 — Каноническое подтверждение
- [ ] Модуль вынесен отдельно от Module 30
- [ ] Зафиксирован статус DESIGN ONLY
- [ ] Подтверждён принцип non-default

---

## ФАЗА 1 — Consent Manager Design
- [ ] Модель согласия всех участников
- [ ] Архитектурный блокер при отсутствии consent
- [ ] Возможность отзыва согласия
- [ ] Логика остановки записи

---

## ФАЗА 2 — Capture Integration Design
- [ ] Adapter model для call systems
- [ ] API / webhook схема
- [ ] Post-call ingestion flow
- [ ] Отсутствие auto-recording

---

## ФАЗА 3 — UI / UX Guardrails
- [ ] Постоянные visible indicators
- [ ] Явный статус «идёт запись»
- [ ] Кнопка STOP доступна всегда
- [ ] Невозможность скрыть индикаторы

---

## ФАЗА 4 — Data Processing Design
- [ ] ASR pipeline (design)
- [ ] Summary-first подход
- [ ] Ограничения анализа
- [ ] Запрет эмоц-оценок

---

## ФАЗА 5 — Data Lifecycle & Privacy
- [ ] Ограниченный срок хранения аудио
- [ ] Полное удаление по запросу
- [ ] Разделение ownership
- [ ] Отсутствие обучения AI

---

## ФАЗА 6 — Inter-Module Boundaries
- [ ] Чёткая граница с Module 30
- [ ] Проверка передачи только summary
- [ ] KPI isolation

---

## ФАЗА 7 — Этический аудит
- [ ] Невозможность silent recording
- [ ] Невозможность фонового доступа
- [ ] Прозрачность для человека
- [ ] Финальное утверждение Владельцем Системы
