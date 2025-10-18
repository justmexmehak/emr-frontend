export interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
}

// const API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, token: data.accessToken };
        } else {
            return { success: false, message: data.message || "Login failed. Incorrect Email or Password." };
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return { success: false, message: "An error occurred. Please try again." };
    }
};