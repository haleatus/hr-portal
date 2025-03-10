export interface IAdmin {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
}

export interface IGetAllAdminResponse {
  statusCode: number;
  message: string;
  data: IAdmin[];
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

export interface IAdminDetailsUpdate {
  name: string;
}

export interface IAdminUpdateResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: IAdmin;
  error: object;
}
