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

export type Availability = {
    caregiverId: string;
    dateTime: string;
}

export type Appointment = {
    id?: string;
    caregiverId: string;
    patientId: string;
    dateTime: string;
    status: "Scheduled" | "Completed" | "Cancelled" | "None";
}

export type Popup = {
    isOpen: boolean,
    label: string,
    handleFunction?: () => void,
} | null;