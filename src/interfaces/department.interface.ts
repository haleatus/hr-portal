export interface IDepartment {
  id: number;
  createdAt: string;
  updatedAt: string;
  department: string;
}

export interface IDepartmentResponse {
  statusCode: number;
  message: string;
  data: IDepartment[];
  error?: object;
  meta: {
    limit: number;
    total: number;
    page_total: number;
    total_pages: number;
    next: number | null;
    page: number;
    previous: number | null;
  };
}

export interface IDepartmentCreateResponse {
  statusCode: number;
  message: string;
  data: IDepartment;
  error?: object;
}

export interface IDepartmentNameUpdate {
  department: string;
}

export interface IDepartmentUpdateResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: {
    id: number;
    createdAt: string;
    updatedAt: string;
    department: string;
    leader: {
      id: number;
      createdAt: string;
      updatedAt: string;
      fullname: string;
      email: string;
      role: string;
    };
  };
  error?: object;
}
