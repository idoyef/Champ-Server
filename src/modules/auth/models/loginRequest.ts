export class LoginRequest {
  username!: string;
  email!: string;
  password!: string;

  constructor(fields?: { username: string; email: string; password: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
