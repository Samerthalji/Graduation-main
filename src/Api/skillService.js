import axios from "axios";


const API_URL = "http://doroob.runasp.net/api/v1/skill";
export const deleteSkill = async (skillId) => {
    try {
        const token= localStorage.getItem('token');
        
        const response = await axios.delete(`${API_URL}/${skillId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        throw error.response ? error.response.data : new Error("Failed to delete skill");
    }
}
export const addSkill = async (skillData) => {
    try {
        const token= localStorage.getItem('token');
        const response = await axios.post(API_URL, skillData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        throw error.response ? error.response.data : new Error("Failed to add skill");
    }
}