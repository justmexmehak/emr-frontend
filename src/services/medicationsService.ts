export interface Medication {
    id: number;
    name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMedications = async (): Promise<Medication[]> => {
    const response = await fetch(`${API_BASE_URL}/medications`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return [];
    }
    let result = await response.json();
    console.log(result);
    return result.data;
};

export const addMedication = async (name: string): Promise<{ success: boolean; message?: string }> => {
    const response = await fetch(`${API_BASE_URL}/medications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name })
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
        return { success: false, message: errorData.message || "Could not add medication." };
    }
};