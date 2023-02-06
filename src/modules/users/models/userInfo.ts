import { Role } from "../../../common/enums/role";

export class UserInfo {
    id!: string;
    username!: string;
    role!: Role;

    constructor(fields?: { id: string; userName: string; role: Role; }) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}