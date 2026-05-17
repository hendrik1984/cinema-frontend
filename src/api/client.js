import { getToken } from "../utils/auth";

const BASE_URL = "http://127.0.0.1:5000";

export async function apiFetch(endpoint, options = {}){
    const token = getToken()

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.Error || "Request failed");
    }

    return data;
}