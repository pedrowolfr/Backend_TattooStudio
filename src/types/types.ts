export interface CreateUserRequestBody {
  first_name: string;
  last_name: string;
  phone: number;
  email: string;
  password: string;
}
export interface CreateAppointmentsRequestBody {
  user_id: number;
  date: string;
  time: string;
}
export interface LoginUserRequestBody {
  email: string;
  password: string;
}
export interface TokenData {
  userId: string;
  userRoles: string[];
}
