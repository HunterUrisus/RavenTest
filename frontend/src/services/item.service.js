import axios from "./root.service.js";

export async function getAllItems() {
    try {
        const response = await axios.get("/items/");
        return response.data;
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

export async function getItemsByTestId(testId) {
    try {
        const response = await axios.get(`/items/${testId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching items for test ID ${testId}:`, error);
        throw error;
    }
}