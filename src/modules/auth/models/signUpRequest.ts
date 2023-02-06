export class SignUpRequest {
  userId!: string;
  username!: string;
  email!: string;
  password!: string;

  constructor(fields?: {
    userId: string;
    username: string;
    email: string;
    password: string;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
