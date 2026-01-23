Trainee RoleContract Specification
Назначение

Формализовать роль Trainee / Apprentice как полноценный RoleContract,
а не «период снисхождения».

1. Статус роли
RoleType: TRAINEE
RoleLayer: OPERATIVE
Eligibility: FOUNDATION_ACCEPTED == TRUE


❗ Trainee НЕ существует без принятой Foundation.

2. Смысл роли

Trainee — это роль с ограниченным ЦКП,
но полной подчинённостью законам системы.

Роль отвечает на вопрос:

«Чему человек учится, какую ценность уже создаёт и за что несёт ответственность».

3. RoleContract (структура)
3.1 Обязательные поля
RoleContract {
  role_id: TRAINEE
  person_id
  foundation_version
  start_date
  review_date
  supervisor_id
  scope_limitations
}

3.2 ЦКП Trainee

ЦКП НЕ равен ЦКП полноценной роли.

Примеры:

корректно выполненные задачи под надзором

соблюдение стандартов

отсутствие антифрод-флагов

стабильность базовых метрик

4. Ограничения роли (жёстко)

Trainee не может:

выполнять критические операции без подтверждения

влиять на финальные KPI системы

принимать управленческие решения

обходить процессы «потому что учится»

5. KPI-логика
KPI_Trainee = {
  discipline_compliance,
  task_completion_rate,
  error_rate,
  learning_progress
}


❗ KPI Trainee не равны KPI Production-ролей,
но считаются по тем же принципам.

6. Мотивация

сниженные коэффициенты

фикс + ограниченный бонус

антифрод действует полностью

«старался» ≠ основание для выплат

7. Выход из роли Trainee
IF
- supervisor_approval == TRUE
- KPI_thresholds_met == TRUE
THEN
- terminate TRAINEE RoleContract
- allow new RoleContract


Автоматического повышения не существует.