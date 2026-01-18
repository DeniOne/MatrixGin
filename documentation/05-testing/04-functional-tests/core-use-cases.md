# MatrixGin — Core Use Cases

## UC-01: Task Lifecycle (Human-Centric)

Actor: Manager  
Scenario:
1. Manager creates a task
2. Assigns an employee
3. Employee works on task
4. Manager reviews and approves

Rules:
- AI may recommend, but not change task state
- Status transitions are explicit
- All actions are auditable


## UC-02: Economy & Rewards

Actor: Manager  
Scenario:
1. Task completed
2. Reward calculated
3. Manager confirms reward

Rules:
- AI cannot trigger payouts
- All economy actions require human confirmation
- Reward logic is deterministic


## UC-03: Organizational Authority

Actor: Executive  
Scenario:
1. Executive views analytics
2. Receives AI recommendations
3. Makes decision

Rules:
- AI output is advisory
- Decision ownership remains human
- No automated execution
