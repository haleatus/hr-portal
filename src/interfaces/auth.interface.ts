export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface ICreateUserRequest {
  fullname: string;
  email: string;
  password: string;
  role: "MANAGER" | "EMPLOYEE";
}

export interface IAdminAuthResponse {
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface IUserAuthResponse {
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      fullname: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface ICreateUserResponse {
  data: {
    fullname: string;
    email: string;
    password: string;
    role: string;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  message: string;
  statusCode: number;
  timestamp: string;
  error?: {
    email?: string;
    password?: string;
    role?: string;
  };
}

export interface ICreateAdminResponse {
  data: {
    name: string;
    email: string;
    password: string;
    role: string;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  message: string;
  statusCode: number;
  timestamp: string;
  error?: {
    email?: string;
    password?: string;
    role?: string;
  };
}
