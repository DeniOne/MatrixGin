import { pgTable, pgSchema, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * PSEE Database Schema (Drizzle ORM)
 */
export const pseeSchema = pgSchema('psee');

// Sessions table (snapshot, overwrite)
export const sessions = pseeSchema.table('sessions', {
    id: uuid('id').primaryKey(),
    clientSnapshot: jsonb('client_snapshot').notNull(),
    currentStatus: text('current_status').notNull(),
    sessionRole: text('session_role').notNull(),
    assignedUserId: uuid('assigned_user_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Stage history table (append-only)
export const stageHistory = pseeSchema.table('stage_history', {
    id: uuid('id').primaryKey(),
    sessionId: uuid('session_id').notNull().references(() => sessions.id),
    fromStatus: text('from_status'),
    toStatus: text('to_status'),
    role: text('role'),
    userId: uuid('user_id'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
});

// Assignments table (append-only)
export const assignments = pseeSchema.table('assignments', {
    id: uuid('id').primaryKey(),
    sessionId: uuid('session_id').notNull().references(() => sessions.id),
    role: text('role').notNull(),
    assignedUserId: uuid('assigned_user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Events table (event store, append-only)
export const events = pseeSchema.table('events', {
    id: uuid('id').primaryKey(),
    sessionId: uuid('session_id'),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
