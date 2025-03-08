export interface IUser {
  id: number;
  fullname?: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: IUser;
  error?: object;
}
