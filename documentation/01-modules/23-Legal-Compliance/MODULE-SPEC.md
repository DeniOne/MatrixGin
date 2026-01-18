# Модуль: Legal Compliance (152-ФЗ)

**Приоритет:** КРИТИЧНЫЙ (MVP Phase 1)  
**Срок:** Недели 7-8  
**Команда:** 1 Backend + Legal Consultant

---

## 📋 ОПИСАНИЕ

Система соответствия российскому законодательству: 152-ФЗ (персональные данные), ТК РФ, налоговое законодательство.

### Основные функции

✅ **152-ФЗ Compliance:**
- Согласия на обработку ПДн
- Реестр обработки ПДн
- Право на удаление/изменение
- Audit log

✅ **ТК РФ Compliance:**
- 40-часовая рабочая неделя
- Контроль переработок (1.5x/2.0x)
- Отпуска (минимум 28 дней)
- Больничные листы

✅ **Налоговая отчетность:**
- Календарь дедлайнов
- Генерация форм (6-НДФЛ, 2-НДФЛ)
- Интеграция с 1С

✅ **Audit Log:**
- Все действия с ПДн
- Доступ к данным
- Изменения

---

## 🗄️ DATABASE SCHEMA

```sql
-- Согласия на обработку ПДн
CREATE TABLE compliance_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    consent_type VARCHAR(100) NOT NULL, -- personal_data, cookies, marketing
    consent_text TEXT NOT NULL,
    accepted BOOLEAN DEFAULT false,
    accepted_at TIMESTAMPTZ,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NDA подписи
CREATE TABLE nda_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    document_url TEXT,
    signed_at TIMESTAMPTZ,
    signature_method VARCHAR(50), -- electronic, physical
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log (уже существует в event_log)
-- Дополнительная таблица для детального аудита ПДн
CREATE TABLE pd_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(100), -- view, edit, delete, export
    data_type VARCHAR(100), -- profile, documents, contacts
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API ENDPOINTS

### GET `/api/compliance/consents`
Мои согласия

### POST `/api/compliance/consents/{type}/accept`
Принять согласие

### GET `/api/compliance/nda/content`
Текст NDA

### POST `/api/compliance/nda/accept`
Подписать NDA

### GET `/api/compliance/audit-log` (Admin)
Журнал аудита

### GET `/api/compliance/checklist`
Статус соответствия

### GET `/api/compliance/152fz/registry`
Реестр обработки ПДн

---

## 📊 152-ФЗ REQUIREMENTS

✅ **Обязательные меры:**
1. Хранение данных на серверах в РФ (Selectel Москва)
2. Регистрация в Роскомнадзоре
3. Письменное согласие на обработку ПДн
4. Меры безопасности УЗ-1:
   - Шифрование (AES-256)
   - RBAC контроль доступа
   - Audit logging
   - Резервное копирование
5. Право субъекта на:
   - Доступ к своим данным
   - Исправление данных
   - Удаление данных

---

## 📝 ЗАВИСИМОСТИ

- `02-Authentication-Authorization` - согласия при регистрации
- `08-Employee-Management` - кадровые документы
- Все модули - audit logging
