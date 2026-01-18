# MatrixGin — ACL & Permission Contracts

## 1. Permission Model

Permissions are defined by:
- role,
- action,
- scope.

Permissions are explicit and non-inferential.


## 2. Rules

1. No implicit permissions.
2. No role-based hardcoding in code.
3. ACL logic must be testable independently.
4. Scope must be explicit (self, unit, global).


## 3. Forbidden Practices

- Permission checks in UI only
- Hidden role exceptions
- Hardcoded role logic in services


## 4. Validation

- ACL matrix must be test-covered
- Forbidden scenarios must be explicitly tested
- Any bypass is a critical defect
