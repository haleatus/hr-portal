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
