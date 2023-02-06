import { Role } from "../common/enums/role";

export function isPermitted(userRole: Role, role: Role): boolean {
    return true;
}