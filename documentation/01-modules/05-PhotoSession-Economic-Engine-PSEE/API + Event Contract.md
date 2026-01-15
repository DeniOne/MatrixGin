3.1 API CONTRACT — PhotoSession Economic Engine (v1)
Общие принципы

REST

JSON

stateless

все write-операции → POST

никакой бизнес-логики во фронте

3.1.1 Создание фотосессии
POST /sessions


Request

{
  "clientId": "string",
  "initiatorUserId": "string"
}


Behavior

создаёт Session

статус: CREATED

роль: PHOTOGRAPHER

пишет StageHistory (CREATED → PHOTOGRAPHER_PENDING)

эмитит SessionCreated

3.1.2 Получение списка
GET /sessions?status=&role=&assignedUserId=


Response

[
  {
    "sessionId": "string",
    "clientId": "string",
    "status": "PHOTOGRAPHER_PENDING",
    "role": "PHOTOGRAPHER",
    "assignedUserId": "string",
    "timeInCurrentStageSec": 1234,
    "slaStatus": "OK | WARNING | BREACH"
  }
]


📌 slaStatus — локальный расчёт, не решение

3.1.3 Карточка фотосессии
GET /sessions/{id}


Response

{
  "sessionId": "string",
  "clientId": "string",
  "currentStatus": "RETUSH_IN_PROGRESS",
  "currentRole": "RETUSHER",
  "assignedUserId": "string",
  "history": [
    {
      "fromStatus": "PHOTOGRAPHER_CONFIRMED",
      "toStatus": "SHOOTING_COMPLETED",
      "role": "PHOTOGRAPHER",
      "userId": "string",
      "startedAt": "ISO-8601",
      "endedAt": "ISO-8601"
    }
  ]
}

3.1.4 Подтверждение этапа
POST /sessions/{id}/confirm


Behavior

валидирует допустимость перехода

меняет статус

пишет StageHistory

эмитит SessionStatusChanged

3.1.5 Отклонение этапа
POST /sessions/{id}/reject


Request

{
  "reason": "string"
}


Behavior

фиксирует отказ

статус НЕ меняется

эмитит StageRejected

3.1.6 Завершение этапа
POST /sessions/{id}/complete


Behavior

завершает текущий этап

закрывает StageHistory

переводит в следующий статус

эмитит StageCompleted

3.1.7 Передача следующей роли
POST /sessions/{id}/handoff


Request

{
  "nextRole": "RETUSHER | PRINTER | SELLER",
  "assignedUserId": "string"
}


Behavior

меняет роль

фиксирует Assignment

эмитит SessionAssigned

3.2 EVENT CONTRACT (экспорт в MatrixGin)
Общие правила

immutable

append-only

без “reasoning”

без интерпретаций

3.2.1 SessionCreated
{
  "eventType": "SessionCreated",
  "sessionId": "string",
  "timestamp": "ISO-8601"
}

3.2.2 SessionStatusChanged
{
  "eventType": "SessionStatusChanged",
  "sessionId": "string",
  "fromStatus": "string",
  "toStatus": "string",
  "role": "string",
  "timestamp": "ISO-8601"
}

3.2.3 StageCompleted
{
  "eventType": "StageCompleted",
  "sessionId": "string",
  "status": "string",
  "durationSec": 1234,
  "timestamp": "ISO-8601"
}

3.2.4 StageRejected
{
  "eventType": "StageRejected",
  "sessionId": "string",
  "status": "string",
  "reason": "string",
  "timestamp": "ISO-8601"
}

3.2.5 SLABreached (signal only)
{
  "eventType": "SLABreached",
  "sessionId": "string",
  "status": "string",
  "thresholdSec": 3600,
  "actualSec": 5400,
  "timestamp": "ISO-8601"
}


📌 Это сигнал, не действие

3.3 Гарантии для AI / MatrixGin

AI читает события

AI не видит write API

AI не может инициировать transition

Execution Layer не подключён

3.4 Готовность к CODER

На этом этапе у нас есть:

утверждённый Boundary Contract

утверждённая архитектура

API contract

Event schema