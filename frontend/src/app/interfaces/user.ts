export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}
  