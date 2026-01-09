import { api } from '../../app/api';

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    REVIEW = 'REVIEW',
    DONE = 'DONE',
    ARCHIVED = 'ARCHIVED',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    creatorId?: string;
    assigneeId?: string;
    departmentId?: string;
    dueDate?: string;
    completedAt?: string;
    tags?: string[];
    mcReward?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    assigneeId?: string;
    departmentId?: string;
    priority?: TaskPriority;
    dueDate?: string;
    tags?: string[];
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    assigneeId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
}

export interface TaskFilters {
    status?: TaskStatus;
    assigneeId?: string;
    departmentId?: string;
    priority?: TaskPriority;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedTasksResponse {
    data: Task[];
    total: number;
    page: number;
    limit: number;
}

export const tasksApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query<PaginatedTasksResponse, TaskFilters | void>({
            query: (filters = {}) => {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined) {
                        params.append(key, String(value));
                    }
                });
                return `/tasks?${params.toString()}`;
            },
            providesTags: ['Task'],
        }),
        getTask: builder.query<Task, string>({
            query: (id) => `/tasks/${id}`,
            providesTags: (result, error, id) => [{ type: 'Task', id }],
        }),
        createTask: builder.mutation<Task, CreateTaskRequest>({
            query: (task) => ({
                url: '/tasks',
                method: 'POST',
                body: task,
            }),
            invalidatesTags: ['Task'],
        }),
        updateTask: builder.mutation<Task, { id: string; data: UpdateTaskRequest }>({
            query: ({ id, data }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }, 'Task'],
        }),
        deleteTask: builder.mutation<void, string>({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),
        completeTask: builder.mutation<Task, string>({
            query: (id) => ({
                url: `/tasks/${id}/complete`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Task', id }, 'Task'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetTaskQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useCompleteTaskMutation,
} = tasksApi;
