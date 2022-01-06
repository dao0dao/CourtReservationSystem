export interface User {
    name: string;
    login: string;
    password?: string;
    confirmPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}