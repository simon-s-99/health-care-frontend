export type AuthenticatedUser = {
    isAuthenticated: boolean | null;
    userId: string | null;
    username: string | null;
    roles: string[] | null;
}

export type Feedback = {
    id: string;
    appointmentId: string;
    patientId: string;
}