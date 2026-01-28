MatrixGin — Security Architecture & Enforcement Map
Status: CANONICAL / NON-OPTIONAL
Version: 1.0

0. СМЫСЛ ДОКУМЕНТА (читать 1 раз)

Этот документ — не рекомендации, а архитектурный закон MatrixGin.

Он отвечает на вопросы:

КОГДА именно вводится безопасность

ПЕРЕД / МЕЖДУ / ПОСЛЕ каких модулей

ЧТО КОНКРЕТНО должно быть сделано

ЧТО СЧИТАЕТСЯ ОШИБКОЙ АРХИТЕКТУРЫ

Если шаг пропущен — модуль считается некорректно внедрённым, даже если код работает.

1️⃣ КОНТУРНАЯ МОДЕЛЬ (БАЗА)

MatrixGin всегда состоит из трёх контуров:

🔒 Contour A — Secure Core

PostgreSQL (основные данные)

Redis (internal)

AI Core (KPI, Qualification, Reward, Ops)

Analytics

Economy

Employees

OFS

❌ НЕТ интернета
❌ НЕТ внешних API
❌ НЕТ внешних LLM

🧪 Contour B — Sandbox / DMZ

Валидация входящих данных

Очистка

Prompt-injection защита

RAG preprocessing

Rate limiting

❌ НЕТ секретных данных
❌ НЕТ прямого доступа к БД

🌍 Contour C — Internet / Explorer

Web

External APIs

Public LLMs

Telegram

External RAG

❌ НЕТ доступа к Secure Core

2️⃣ SECURITY CHECKPOINT MAP
(САМОЕ ВАЖНОЕ — ПЕРЕД / МЕЖДУ / ПОСЛЕ МОДУЛЕЙ)
🧱 PHASE 0 — ADMISSION GATE & BASE-FIRST
❗ КРИТИЧЕСКИЙ ГЕЙТ
✅ ПРОВЕРЯЕТСЯ ПЕРЕД СБОРОМ ЛЮБЫХ ДАННЫХ

 (до ввода ФИО, до загрузки фото, до доступа к задачам)

  **Base-First Enforcement**: Пользователь обязан принять Базу ДО регистрации.
 
  **Dynamic Scopes**: JWT токен блокирует API вызовы на основе `AdmissionStatus`.
 
  **Bot Guard**: ТГ-бот игнорирует команды до получения статуса `ADMITTED`.

🚫 Ошибка архитектуры, если:
- Можно прислать анкетные данные до принятия Базы.
- API возвращает данные (напр. задачи) пользователю со статусом `PENDING_BASE`.
 
 🔐 MODULE 01 — Authentication & Authorization
🛑 SECURITY CHECKPOINT: ПЕРЕД MODULE 01

 Определены роли (RBAC)

 Нет глобального admin

 Service-to-service auth

 Токены с ограниченным scope

🛑 SECURITY CHECKPOINT: ПОСЛЕ MODULE 01

 Audit log для:

логина

refresh

смены ролей

 Нет auth bypass ни в одном сервисе

🚫 Ошибка архитектуры, если:

любой модуль доступен без Auth

AI может вызывать protected endpoints напрямую

👥 MODULE 02 — Employees / OFS
🛑 SECURITY CHECKPOINT: ПЕРЕД MODULE 02

 Data classification:

Personal

Confidential

 Ограничение полей по ролям

🛑 SECURITY CHECKPOINT: ПОСЛЕ MODULE 02

 Field-level access control

 Логи чтения персональных данных

 AI имеет read-only доступ

🚫 Запрещено:

передавать персональные данные в AI Explorer

использовать Employees как training data для внешних LLM

✅ MODULE 03 — Tasks / Operations
🛑 SECURITY CHECKPOINT: МЕЖДУ TASKS И AI

 AI получает только агрегированные данные

 AI не может:

менять статус

создавать задачи

назначать людей

🛑 SECURITY CHECKPOINT: ПОСЛЕ MODULE 03

 Все AI-рекомендации помечены как:

advisory / non-binding

🎮 / 💰 MODULES — Gamification / Economy
🛑 SECURITY CHECKPOINT: ПЕРЕД

 Финансовые данные = Restricted

 Отдельные права на просмотр / изменение

🛑 SECURITY CHECKPOINT: ПОСЛЕ

 AI не начисляет награды

 AI не двигает деньги

 Все операции подписаны человеком

🚫 Ошибка, если AI напрямую пишет в economy tables.

📊 MODULE 12 — Analytics & KPI
🛑 SECURITY CHECKPOINT: МЕЖДУ ANALYTICS И AI CORE

 AI получает:

snapshots

агрегаты

 Нет raw access к БД

🛑 SECURITY CHECKPOINT: ПОСЛЕ

 Воспроизводимость рекомендаций

 Audit trail: input → output

🤖 AI CORE — КРИТИЧЕСКИЙ УЗЕЛ
🧠 AI Core (Contour A)

No internet

No external calls

No write access

Deterministic mode

🌍 AI Explorer (Contour C)

No DB

No personal data

Abstract prompts only

🧪 AI Firewall (Contour B)

Schema validation

Injection detection

Sanitization

🚫 AI Core ≠ AI Explorer
Их смешение = критическая архитектурная ошибка

🔗 MODULE 21 — Telegram / External Integrations
🛑 SECURITY CHECKPOINT: ПЕРЕД

 Telegram живёт ТОЛЬКО в Internet contour

 Никаких прямых запросов к БД

🛑 SECURITY CHECKPOINT: МЕЖДУ

 Telegram → Sandbox → Secure Core

 Строгие DTO

🚀 PRE-PRODUCTION CHECKPOINT (ОБЯЗАТЕЛЬНО)

Перед любым production-деплоем:

 Secrets manager

 Key rotation

 Encrypted backups

 Incident isolation plan

 Manual kill-switch AI

⚠️ VIOLATION POLICY

Если модуль:

ломает контуры

обходит sandbox

даёт AI лишние права

➡️ модуль считается НЕПРИНЯТЫМ, независимо от бизнес-ценности.

🧠 END OF SECURITY-ARCHITECTURE.md