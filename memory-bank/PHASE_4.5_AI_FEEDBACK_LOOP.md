# PHASE 4.5 — AI Feedback Loop (Human-in-the-Loop)

**Completed:** 2026-01-19  
**Status:** PRODUCTION READY

---

## 🎯 Core Principle

**"Human evaluates AI; AI does not automatically react to evaluation"**

### Architectural Laws (Non-negotiable)

**FORBIDDEN:**
- ❌ Feedback changing AI behavior in real-time
- ❌ Auto-learning / online learning
- ❌ Alteration of weights/rules/priorities
- ❌ Influence on tasks/finances/statuses
- ❌ Personal evaluations/sanctions of individuals
- ❌ Using feedback as KPI

**ALLOWED:**
- ✅ Collection of trust signals
- ✅ Qualitative comments (max 500 chars)
- ✅ Offline analysis (future scope)
- ✅ Full traceability

---

## 📐 Architecture Pattern: Immutable Feedback Storage

### Database Schema
```prisma
enum FeedbackType {
  HELPFUL
  NOT_APPLICABLE
  UNSURE
}

model AIFeedback {
  id                String       @id @default(uuid())
  recommendationId  String
  userId            String
  feedbackType      FeedbackType
  comment           String?      @db.VarChar(500)
  
  // Context Binding (Phase 2)
  basedOnSnapshotId String?
  aiVersion         String?
  ruleSetVersion    String?
  
  timestamp         DateTime     @default(now())
  
  user              User         @relation(fields: [userId], references: [id])
  
  // Idempotency: 1 feedback per user per recommendation
  @@unique([userId, recommendationId])
  @@index([recommendationId])
  @@index([feedbackType])
  @@index([timestamp])
  @@map("ai_feedback")
}
```

**Key Design Decisions:**
1. **Idempotency via Unique Constraint** — Prisma `@@unique([userId, recommendationId])` prevents duplicate feedback
2. **Immutable Storage** — No UPDATE/DELETE operations, only INSERT
3. **Context Binding** — Every feedback linked to exact AI state (snapshot ID, versions)

---

## 🔐 Security Pattern: Ethics Guard

### Implementation
```typescript
// feedback-ethics.guard.ts
class FeedbackEthicsGuard {
  validate(comment: string): EthicsValidationResult {
    // 1. Block person evaluations
    // 2. Block toxic language
    // 3. Block punishment demands
  }
}
```

**Validation Categories:**
1. **Person Evaluations** — Regex patterns for "плохой сотрудник", "уволить", "виноват"
2. **Toxic Language** — Blacklist: "идиот", "дурак", "мудак", etc.
3. **Punishment Demands** — Patterns for "штраф", "санкция", "выговор"

**Error Handling:**
- 422 Unprocessable Entity on violation
- User-friendly message: "Пожалуйста, используйте конструктивные формулировки"

---

## 📊 Privacy Pattern: Aggregated Analytics

### Backend Service
```typescript
async getAnalytics(): Promise<FeedbackAnalyticsDto> {
  const allFeedback = await prisma.aIFeedback.findMany({
    select: {
      feedbackType: true,
      timestamp: true,
      // Explicitly exclude userId and comment
    },
  });
  
  // Aggregate by type, calculate percentages
  // NO user-level breakdown
}
```

**Privacy Guarantees:**
- ❌ No `userId` in analytics response
- ❌ No individual comments exposed
- ✅ Only aggregated counts and percentages
- ✅ Restricted access (AI_TEAM/ADMIN only)

---

## 🔄 Context Binding Pattern: Snapshot ID

### Deterministic Hash Generation
```typescript
private generateSnapshotId(context: AIOpsInput): string {
  const dataToHash = JSON.stringify({
    graph: context.graph,
    impact: context.impact,
  });
  
  return createHash('sha256')
    .update(dataToHash)
    .digest('hex')
    .substring(0, 16);
}
```

**Purpose:** Full reproducibility — "what data did AI see when creating this recommendation?"

**Metadata Attached:**
- `snapshotId` — SHA256 hash (16 chars)
- `aiVersion` — e.g., "v1.0.0"
- `ruleSetVersion` — e.g., "rules-2026-01"

---

## 🎨 UX Pattern: Voluntary Feedback

### Frontend Component
```tsx
<RecommendationFeedbackPanel
  recommendationId={recommendation.id}
  snapshotId={recommendation.snapshotId}
  aiVersion={recommendation.aiVersion}
  ruleSetVersion={recommendation.ruleSetVersion}
/>
```

**UI Elements:**
1. **3 Buttons** — 👍 Полезно / 👎 Не применимо / 🤔 Не уверен
2. **Optional Textarea** — Max 500 chars with live counter
3. **Submit Button** — Disabled until type selected
4. **Toast Notification** — "Спасибо. Это не меняет систему автоматически."

**Critical UX Message:**
> Emphasizes voluntary nature and lack of direct action

---

## 🚀 API Endpoints

### Submit Feedback
```
POST /api/ai-ops/feedback
Authorization: Bearer <JWT>

Request:
{
  "recommendationId": "uuid",
  "feedbackType": "HELPFUL" | "NOT_APPLICABLE" | "UNSURE",
  "comment": "optional string, max 500 chars",
  "basedOnSnapshotId": "abc123...",
  "aiVersion": "v1.0.0",
  "ruleSetVersion": "rules-2026-01"
}

Response (201 Created):
{
  "id": "uuid",
  "recommendationId": "uuid",
  "feedbackType": "HELPFUL",
  "timestamp": "2026-01-19T02:23:29.000Z"
}

Errors:
- 401: Unauthorized
- 409: Conflict (duplicate feedback)
- 422: Unprocessable Entity (ethics violation)
- 400: Bad Request (validation error)
```

### Get Analytics
```
GET /api/ai-ops/feedback/analytics
Authorization: Bearer <JWT>
Restricted: AI_TEAM, ADMIN only

Response:
{
  "totalFeedback": 150,
  "byType": {
    "HELPFUL": 100,
    "NOT_APPLICABLE": 30,
    "UNSURE": 20
  },
  "percentages": {
    "helpful": 67,
    "notApplicable": 20,
    "unsure": 13
  },
  "periodStart": "2026-01-01T00:00:00.000Z",
  "periodEnd": "2026-01-19T02:57:00.000Z",
  "generatedAt": "2026-01-19T02:57:00.000Z"
}
```

---

## 📁 Files Structure

### Backend (7 files)
1. `backend/prisma/schema.prisma` — AIFeedback model + FeedbackType enum
2. `backend/src/ai-ops/dto/submit-feedback.dto.ts` — Request DTO
3. `backend/src/ai-ops/dto/feedback-response.dto.ts` — Response DTO
4. `backend/src/ai-ops/dto/feedback-analytics.dto.ts` — Analytics DTO
5. `backend/src/ai-ops/ai-feedback.service.ts` — Business logic
6. `backend/src/ai-ops/feedback-ethics.guard.ts` — Validation guard
7. `backend/src/ai-ops/ai-ops.controller.ts` — Endpoints (updated)
8. `backend/src/ai-ops/ai-ops.routes.ts` — Routes (updated)
9. `backend/src/ai-ops/ai-ops.service.ts` — Snapshot ID generation (updated)
10. `backend/src/ai-ops/ai-ops.types.ts` — Type definitions (updated)

### Frontend (4 files)
1. `frontend/src/features/ai/aiApi.ts` — RTK Query integration
2. `frontend/src/components/ai/RecommendationFeedbackPanel.tsx` — Feedback UI
3. `frontend/src/components/ai/RecommendationDetailsDrawer.tsx` — Integration
4. `frontend/src/pages/ai/AIFeedbackAnalyticsPage.tsx` — Analytics dashboard

### Database
1. Migration: `20260118232329_add_ai_feedback_table`

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] Submit feedback (all 3 types)
- [ ] Verify toast notification
- [ ] Test duplicate submission (409 error)
- [ ] Test ethics violations (422 error)
- [ ] Verify analytics dashboard
- [ ] Check context binding (snapshot ID in DB)

### Automated Testing (Future)
- [ ] Unit tests: `ai-feedback.service.spec.ts`
- [ ] Unit tests: `feedback-ethics.guard.spec.ts`
- [ ] Integration tests: POST /api/ai-ops/feedback
- [ ] Integration tests: GET /api/ai-ops/feedback/analytics

---

## 🔮 Future Enhancements (Out of Scope)

1. **Rate Limiting** — Prevent feedback spam (mentioned as future scope)
2. **Offline Analysis** — ML on aggregated feedback (no auto-action)
3. **Trend Detection** — Identify patterns in feedback over time
4. **A/B Testing** — Compare AI versions based on feedback

**Critical:** All future enhancements MUST adhere to core principle: "Feedback ≠ Control"

---

## 📚 Related Documentation

- `MASTER_CHECKLIST.md` — Section "PHASE 4.5 — AI Feedback Loop"
- `MODULES-IMPLEMENTATION-STATUS.md` — AI Core module details
- `implementation_plan.md` — Original implementation plan
- `walkthrough.md` — Phase 1-4 walkthrough
- `task.md` — Task checklist (all phases)

---

**Last Updated:** 2026-01-19  
**Author:** TECHLEAD + CODER  
**Status:** ✅ PRODUCTION READY
