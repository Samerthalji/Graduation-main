import Api from './axiosConfig.js';


export const getJobApplications = async ({ jobId, companyId, pageNumber = 1, pageSize = 10 }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await Api.post('/application/job/applications', {
            jobId,
            companyId,
            pageNumber,
            pageSize
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching job applications");
    }
};


export const applyToJob = async (jobId, cvFile) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('cvFile', cvFile);

        const response = await Api.post(`/application/apply?jobId=${jobId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error applying to job");
    }
};


export const getMyApplications = async (pageNumber = 1, pageSize = 20) => {
    try {
        const token = localStorage.getItem('token');
        const response = await Api.post('/application/MyApplication', {}, {
            params: { pageNumber, pageSize },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching user applications");
    }
};

export const deleteApplication = async (applicationId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await Api.delete(`/application/${applicationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error deleting application");
    }
};


export const getApplicationDetails = async (applicationId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await Api.get('/application/Details', {
            params: { applicationId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching application details");
    }
};


export const updateApplicationStatus = async (userId, applicationId, status) => {
    try {
        const token = localStorage.getItem('token');
        const response = await Api.post('/application/Status', null, {
            params: { userId, applicationId, status },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error updating application status");
    }
};
