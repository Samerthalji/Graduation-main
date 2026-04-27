import axios from "axios";
import Api from './axiosConfig.js';

// ===================== إنشاء وظيفة جديدة =====================
// POST /api/v1/job?userId=...
// Body: { title, description, salary, location, typeJob, experienceLevel, companyId, skills }
export const createJob = async (userId, jobData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await Api.post(`/job?userId=${userId}`, jobData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error creating job");
    }
};

// ===================== جلب جميع الوظائف =====================
// GET /api/v1/job
export const getAllJobs = async () => {
    try {
        const response = await Api.get('/job');
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching jobs");
    }
};

// ===================== جلب وظيفة بالـ ID =====================
// GET /api/v1/job?id=...
export const getJobById = async (jobId) => {
    try {
        const response = await Api.get(`/job?id=${jobId}`);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error fetching job");
    }
};

// ===================== البحث عن وظائف بالمهارة =====================
// GET /api/v1/job/search-by-skill?page=...&pageSize=...&skill=...
export const searchJobsBySkill = async (skill, page = 1, pageSize = 10) => {
    try {
        const response = await Api.get('/job/search-by-skill', {
            params: { skill, page, pageSize }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error searching jobs by skill");
    }
};

// ===================== حذف وظيفة =====================
// DELETE /api/v1/job/{id}?adminId=...
export const deleteJob = async (jobId, adminId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await Api.delete(`/job/${jobId}`, {
            params: { adminId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error deleting job");
    }
};

// ===================== تعديل وظيفة =====================
// PUT /api/v1/job/{jobId}?adminId=...
// Body: { title, description, salary, location, typeJob, experienceLevel, skills }
export const updateJob = async (jobId, adminId, jobData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await Api.put(`/job/${jobId}`, jobData, {
            params: { adminId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error updating job");
    }
};
