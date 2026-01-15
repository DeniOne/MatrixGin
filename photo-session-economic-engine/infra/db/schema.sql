-- PSEE Database Schema (Canonical DDL)
-- PostgreSQL + schema: psee

CREATE SCHEMA IF NOT EXISTS psee;

-- Sessions table (snapshot, overwrite)
CREATE TABLE psee.sessions (
    id UUID PRIMARY KEY,
    client_snapshot JSONB NOT NULL,
    current_status TEXT NOT NULL,
    session_role TEXT NOT NULL,
    assigned_user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stage history table (append-only)
CREATE TABLE psee.stage_history (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES psee.sessions(id),
    from_status TEXT,
    to_status TEXT,
    role TEXT,
    user_id UUID,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ
);

-- Assignments table (append-only)
CREATE TABLE psee.assignments (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES psee.sessions(id),
    role TEXT NOT NULL,
    assigned_user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events table (event store, append-only)
CREATE TABLE psee.events (
    id UUID PRIMARY KEY,
    session_id UUID,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stage_history_session ON psee.stage_history(session_id);
CREATE INDEX idx_assignments_session ON psee.assignments(session_id);
CREATE INDEX idx_events_session ON psee.events(session_id);
CREATE INDEX idx_events_type ON psee.events(event_type);
