import { Role } from "../models/Role";

export const UserRoles = {
  User: { id: 1, role_name: "user" } as Role,
  Admin: { id: 2, role_name: "admin" } as Role,
  Super_Admin: { id: 3, role_name: "super_admin" } as Role,
};
