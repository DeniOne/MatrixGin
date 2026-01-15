import { Type, Static } from '@sinclair/typebox';

export const CreateSessionSchema = Type.Object({
    clientId: Type.String(),
    initiatorUserId: Type.String(),
    clientSnapshot: Type.Optional(Type.Object({
        clientId: Type.String(),
        name: Type.Optional(Type.String()),
        phone: Type.Optional(Type.String()),
        email: Type.Optional(Type.String()),
        consentGiven: Type.Boolean(),
        source: Type.Union([
            Type.Literal('ON_SITE'),
            Type.Literal('QR'),
            Type.Literal('ONLINE'),
        ]),
    })),
});

export type CreateSessionDTO = Static<typeof CreateSessionSchema>;

export const ConfirmStageSchema = Type.Object({
    userId: Type.String(),
});

export type ConfirmStageDTO = Static<typeof ConfirmStageSchema>;

export const RejectStageSchema = Type.Object({
    userId: Type.String(),
    reason: Type.String(),
});

export type RejectStageDTO = Static<typeof RejectStageSchema>;

export const CompleteStageSchema = Type.Object({
    userId: Type.String(),
});

export type CompleteStageDTO = Static<typeof CompleteStageSchema>;

export const HandoffStageSchema = Type.Object({
    nextRole: Type.Union([
        Type.Literal('PHOTOGRAPHER'),
        Type.Literal('RETUSHER'),
        Type.Literal('PRINTER'),
        Type.Literal('SELLER'),
    ]),
    assignedUserId: Type.String(),
});

export type HandoffStageDTO = Static<typeof HandoffStageSchema>;

export const SessionQuerySchema = Type.Object({
    status: Type.Optional(Type.String()),
    role: Type.Optional(Type.String()),
    assignedUserId: Type.Optional(Type.String()),
});

export type SessionQueryParams = Static<typeof SessionQuerySchema>;
