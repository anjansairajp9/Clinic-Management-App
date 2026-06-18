export interface ClinicDetails {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string | null;
    created_at: string;
    updated_at: string;
}

export interface UpdateClinicPayload {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
}
