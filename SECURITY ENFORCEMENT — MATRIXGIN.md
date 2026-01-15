⚠️ SECURITY ENFORCEMENT — MATRIXGIN (MANDATORY)

Мы работаем по документу SECURITY-ARCHITECTURE.md.

ОБЯЗАТЕЛЬНО:
- Всегда учитывать Contour Architecture:
  - Secure Core (no internet)
  - Sandbox / DMZ
  - Internet / Explorer

ДЛЯ КАЖДОГО МОДУЛЯ:
1. Проверять:
   - что должно быть сделано ПО БЕЗОПАСНОСТИ ПЕРЕД модулем
   - что МЕЖДУ этим модулем и другими
   - что ОБЯЗАТЕЛЬНО ПОСЛЕ

2. Любое нарушение:
   - фиксировать
   - считать архитектурной ошибкой

AI ВСЕГДА:
- advisory only
- read-only
- без прямых действий
- без доступа к internet из Secure Core

Если в ответе не учтены security-checkpoints —
ответ считается НЕПОЛНЫМ.
