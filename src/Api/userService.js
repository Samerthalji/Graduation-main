import Api from "axios";


const API_URL = "http://doroob.runasp.net/api/v1/users";
export const getUserProfile = async () => {
    try {
        
     
        const token = localStorage.getItem('token');

           const response = await Api.get(`${API_URL}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
         throw error.response?error.response.data :new Error("error ");}
    }
export const updateUserProfile = async (formData) => {
    try {
        const token = localStorage.getItem('token');

        const response = await Api.post(`${API_URL}/upload-image`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error.response ? error.response.data : new Error("Error updating user profile");
    }
};
