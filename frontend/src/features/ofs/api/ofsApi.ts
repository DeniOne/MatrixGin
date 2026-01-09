import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Department {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  hierarchy_level?: number;
  department_type?: 'operational' | 'support' | 'management';
  functions?: string[];
  kpis?: any;
  faculty_link?: string;
  is_active: boolean;
  employee_count?: number;
  children?: Department[];
}

export interface Role {
  id: string;
  role_name: string;
  department_id: string;
  purpose?: string;
  required_competencies: any;
  responsibilities?: string[];
  expected_results?: string[];
  required_knowledge?: string[];
  required_skills?: string[];
  salary_min?: number;
  salary_max?: number;
  corporate_university_courses?: string[];
  golden_standard_processes?: string[];
  lean_principles?: string[];
  documents?: { name: string; url: string; type: string }[];
}

export interface Employee {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  position?: string;
  department_id?: string;
  department_name?: string;
  competencies?: any;
  corporate_university_level?: string;
  faculty?: string;
  photo_url?: string;
}

export interface RegistrationRequest {
  id: string;
  telegram_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone: string;
  position: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  current_step: string;
  photo_url?: string;
  created_at: string;
  completed_at?: string;
}

export interface HierarchyLevel {
  level_number: number;
  level_name: string;
  level_name_ru: string;
  description: string;
  can_have_children: boolean;
  departments?: Department[];
}

export interface PyramidRole {
  id: string;
  role_type: 'management' | 'photographers' | 'production' | 'sales';
  role_name: string;
  description?: string;
  kpi_metrics?: any;
  interdependencies?: any;
}

export interface IdeaChannel {
  id: string;
  channel_type: 'strategic' | 'tactical' | 'mentoring';
  title: string;
  description?: string;
  submitted_by: string;
  status: 'submitted' | 'under_review' | 'approved' | 'implemented' | 'rejected';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export const ofsApi = createApi({
  reducerPath: 'ofsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/ofs`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Departments', 'Roles', 'Employees', 'Registrations', 'Hierarchy', 'Pyramid', 'Triangle', 'Ideas'],
  endpoints: (builder) => ({
    // Departments
    getDepartments: builder.query<{ success: boolean; data: Department[] }, { format?: 'tree' | 'flat' }>({
      query: (params) => ({
        url: '/departments',
        params,
      }),
      providesTags: ['Departments'],
    }),

    createDepartment: builder.mutation<{ success: boolean; data: Department }, Partial<Department>>({
      query: (body) => ({
        url: '/departments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Departments', 'Hierarchy'],
    }),

    updateDepartment: builder.mutation<{ success: boolean; data: Department }, { id: string; data: Partial<Department> }>({
      query: ({ id, data }) => ({
        url: `/departments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Departments'],
    }),

    deleteDepartment: builder.mutation<{ success: boolean }, { id: string; soft?: boolean }>({
      query: ({ id, soft = true }) => ({
        url: `/departments/${id}?soft=${soft}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Departments'],
    }),

    // Roles
    getRoleMatrix: builder.query<{ success: boolean; data: Role[] }, { department_id?: string }>({
      query: (params) => ({
        url: '/role-matrix',
        params,
      }),
      providesTags: ['Roles'],
    }),

    createRole: builder.mutation<{ success: boolean; data: Role }, Partial<Role>>({
      query: (body) => ({
        url: '/role-matrix',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Roles'],
    }),

    updateRole: builder.mutation<{ success: boolean; data: Role }, { id: string; data: Partial<Role> }>({
      query: ({ id, data }) => ({
        url: `/role-matrix/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Roles'],
    }),

    deleteRole: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/role-matrix/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // Employees
    getEmployees: builder.query<{ success: boolean; data: Employee[]; pagination: any }, {
      department_id?: string;
      role_id?: string;
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/employees',
        params,
      }),
      providesTags: ['Employees'],
    }),

    updateEmployeeCompetencies: builder.mutation<{ success: boolean; data: Employee }, {
      id: string;
      data: {
        competencies?: any;
        corporate_university_level?: string;
        faculty?: string;
      };
    }>({
      query: ({ id, data }) => ({
        url: `/employees/${id}/competencies`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Employees'],
    }),

    // Org Chart
    getOrgChart: builder.query<{ success: boolean; data: Department }, { department_id?: string; depth?: number }>({
      query: (params) => ({
        url: '/org-chart',
        params,
      }),
      providesTags: ['Departments'],
    }),

    // Hierarchy
    getHierarchyLevels: builder.query<{ success: boolean; data: HierarchyLevel[] }, void>({
      query: () => '/hierarchy/levels',
      providesTags: ['Hierarchy'],
    }),

    getHierarchyStructure: builder.query<{ success: boolean; data: HierarchyLevel[] }, void>({
      query: () => '/hierarchy/structure',
      providesTags: ['Hierarchy'],
    }),

    // Pyramid of Interdependence
    getPyramidRoles: builder.query<{ success: boolean; data: PyramidRole[] }, void>({
      query: () => '/pyramid',
      providesTags: ['Pyramid'],
    }),

    createPyramidRole: builder.mutation<{ success: boolean; data: PyramidRole }, Partial<PyramidRole>>({
      query: (body) => ({
        url: '/pyramid',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pyramid'],
    }),

    // Triangle of Interdependence
    getTriangleAssignments: builder.query<{ success: boolean; data: any[] }, { employee_id?: string }>({
      query: (params) => ({
        url: '/triangle',
        params,
      }),
      providesTags: ['Triangle'],
    }),

    getTriangleStats: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/triangle/stats',
      providesTags: ['Triangle'],
    }),

    // RACI Matrix
    createRACIAssignment: builder.mutation<{ success: boolean; data: any }, {
      project_name: string;
      task_name: string;
      employee_id: string;
      raci_role: 'R' | 'A' | 'C' | 'I';
    }>({
      query: (body) => ({
        url: '/raci',
        method: 'POST',
        body,
      }),
    }),

    getProjectRACI: builder.query<{ success: boolean; data: any[] }, string>({
      query: (projectName) => `/raci/${projectName}`,
    }),

    // Idea Channels
    submitIdea: builder.mutation<{ success: boolean; data: IdeaChannel }, Partial<IdeaChannel>>({
      query: (body) => ({
        url: '/ideas',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Ideas'],
    }),

    getIdeas: builder.query<{ success: boolean; data: IdeaChannel[] }, {
      channel_type?: string;
      status?: string;
    }>({
      query: (params) => ({
        url: '/ideas',
        params,
      }),
      providesTags: ['Ideas'],
    }),

    // Reports
    getStructureReport: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/reports/structure',
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetRoleMatrixQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeCompetenciesMutation,
  useGetOrgChartQuery,
  useGetHierarchyLevelsQuery,
  useGetHierarchyStructureQuery,
  useGetPyramidRolesQuery,
  useCreatePyramidRoleMutation,
  useGetTriangleAssignmentsQuery,
  useGetTriangleStatsQuery,
  useCreateRACIAssignmentMutation,
  useGetProjectRACIQuery,
  useSubmitIdeaMutation,
  useGetIdeasQuery,
  useGetStructureReportQuery,
} = ofsApi;
