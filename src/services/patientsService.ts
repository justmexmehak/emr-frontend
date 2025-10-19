export interface Prescription {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PatientPayload {
    name: string;
    age: string;
    contact: string;
    gender: string;
    visitDate: string;
    diagnosis: string;
    notes: string;
    prescription: Prescription[];
}

export interface Patient {
    id: number;
    name: string;
    mrNumber: string;
    age: number;
    gender: string;
}

export interface PaginatedPatientsResponse {
    data: Patient[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface Medication {
    id: string;
    name: string;
}

// export interface Prescription {
//     id: string;
//     medication: Medication;
//     dosage: string;
//     frequency: string;
//     duration: string;
// }

export interface Visit {
    id: string;
    visitDate: string;
    prescription: Prescription[];
    diagnosis: string;
    notes?: string;
}

export interface PatientDetail {
    id: string;
    name: string;
    age: number;
    contact: string;
    gender: string;
    mrNumber: string | number;
    visits: Visit[];
}

export interface PatientDetailResponse {
    data: PatientDetail;
    message: string;
    status: number;
}

export interface VisitRecordPayload {
    visitDate: string;
    diagnosis: string;
    notes?: string;
    prescription: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }[];
}

export const addVisitRecord = async (patientId: string, payload: VisitRecordPayload): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/visit-records/${patientId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        });
        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return { success: false, message: "Unauthorized" };
        }
        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || "Could not add visit record." };
        }
    } catch {
        return { success: false, message: "Network error. Please try again." };
    }
};

export const fetchPatientDetail = async (patientId: string): Promise<PatientDetailResponse | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return null;
        }
        return await response.json();
    } catch {
        return null;
    }
};

export const addPatient = async (patient: PatientPayload): Promise<{ success: boolean; message?: string; unauthorized?: boolean }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(patient)
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return { success: false, message: "Unauthorized" };
        }

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || "Could not add patient." };
        }
    } catch (error) {
        return { success: false, message: "Network error. Please try again." };
    }
};

export const fetchPatients = async (page: number, limit: number): Promise<PaginatedPatientsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/patients?page=${page}&limit=${limit}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return { data: [], pagination: { page: 1, limit, total: 0, totalPages: 1, hasNext: false, hasPrev: false } };
        }
        if (!response.ok) return { data: [], pagination: { page: 1, limit, total: 0, totalPages: 1, hasNext: false, hasPrev: false } };
        const data = await response.json();
        return data.data;
    } catch {
        return { data: [], pagination: { page: 1, limit, total: 0, totalPages: 1, hasNext: false, hasPrev: false } };
    }
};