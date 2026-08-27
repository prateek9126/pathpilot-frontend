const API_BASE_URL = 'http://localhost:8080/api';

async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API error: ${response.status}`);
    }
    return response.json();
}

export const api = {
    // Get current profile
    getProfile: async () => {
        const res = await fetch(`${API_BASE_URL}/profile`);
        return handleResponse(res);
    },

    // Onboard user (Natural Language or Form)
    onboard: async (naturalLanguage, profile = null) => {
        const payload = naturalLanguage 
            ? { naturalLanguage } 
            : { profile };
        const res = await fetch(`${API_BASE_URL}/onboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return handleResponse(res);
    },

    // Update profile manually
    updateProfile: async (profile) => {
        const res = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });
        return handleResponse(res);
    },

    // Get current roadmap
    getRoadmap: async () => {
        const res = await fetch(`${API_BASE_URL}/roadmap`);
        return handleResponse(res);
    },

    // Get specific module details
    getModule: async (moduleId) => {
        const res = await fetch(`${API_BASE_URL}/roadmap/modules/${moduleId}`);
        return handleResponse(res);
    },

    // Complete module (if no quiz)
    completeModule: async (moduleId) => {
        const res = await fetch(`${API_BASE_URL}/roadmap/modules/${moduleId}/complete`, {
            method: 'POST'
        });
        return handleResponse(res);
    },

    // Submit assessment answers
    submitAssessment: async (moduleId, answers) => {
        const res = await fetch(`${API_BASE_URL}/roadmap/modules/${moduleId}/assessment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
        });
        return handleResponse(res);
    },

    // Submit feedback
    submitFeedback: async (moduleId, difficulty, struggles) => {
        const res = await fetch(`${API_BASE_URL}/roadmap/modules/${moduleId}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty, struggles })
        });
        return handleResponse(res);
    },

    // Load a demo profile
    loadDemo: async (demoId) => {
        const res = await fetch(`${API_BASE_URL}/demo/${demoId}`, {
            method: 'POST'
        });
        return handleResponse(res);
    },

    // Get chat messages
    getChatMessages: async () => {
        const res = await fetch(`${API_BASE_URL}/ai/chat`);
        return handleResponse(res);
    },

    // Send chat message
    sendChatMessage: async (text) => {
        const res = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        return handleResponse(res);
    },

    // Get recommended resources based on filters
    getRecommendations: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.maxBudget !== undefined) queryParams.append('maxBudget', filters.maxBudget);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
        if (filters.skill) queryParams.append('skill', filters.skill);
        if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
        if (filters.platform) queryParams.append('platform', filters.platform);

        const res = await fetch(`${API_BASE_URL}/recommendations?${queryParams.toString()}`);
        return handleResponse(res);
    },

    // Get recommended projects
    getProjects: async () => {
        const res = await fetch(`${API_BASE_URL}/projects`);
        return handleResponse(res);
    },

    // Get project details
    getProjectDetails: async (projectId) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}`);
        return handleResponse(res);
    },

    // Start project
    startProject: async (projectId) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/start`, {
            method: 'POST'
        });
        return handleResponse(res);
    },

    // Complete project milestone
    completeProjectMilestone: async (projectId, phaseIndex) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/milestones/${phaseIndex}/complete`, {
            method: 'POST'
        });
        return handleResponse(res);
    },

    // Update project status
    updateProjectStatus: async (projectId, status) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return handleResponse(res);
    },

    // Send project assistant message
    sendProjectAssistantMessage: async (projectId, query) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/assistant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        return handleResponse(res);
    },

    // Compare projects
    compareProjects: async (projectIds) => {
        const res = await fetch(`${API_BASE_URL}/projects/compare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectIds)
        });
        return handleResponse(res);
    },

    // Get certifications
    getCertifications: async (maxBudget, category) => {
        const queryParams = new URLSearchParams();
        if (maxBudget !== undefined) queryParams.append('maxBudget', maxBudget);
        if (category) queryParams.append('category', category);
        const res = await fetch(`${API_BASE_URL}/certifications?${queryParams.toString()}`);
        return handleResponse(res);
    },

    // Get certification details
    getCertDetails: async (certId) => {
        const res = await fetch(`${API_BASE_URL}/certifications/${certId}`);
        return handleResponse(res);
    },

    // Save certification
    saveCert: async (certId) => {
        const res = await fetch(`${API_BASE_URL}/certifications/${certId}/save`, {
            method: 'POST'
        });
        return handleResponse(res);
    },

    // Unsave certification
    unsaveCert: async (certId) => {
        const res = await fetch(`${API_BASE_URL}/certifications/${certId}/unsave`, {
            method: 'POST'
        });
        return handleResponse(res);
    },

    // Update certification status
    updateCertStatus: async (certId, status) => {
        const res = await fetch(`${API_BASE_URL}/certifications/${certId}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return handleResponse(res);
    },

    // Complete certification milestone
    completeCertMilestone: async (certId, phaseIndex) => {
        const res = await fetch(`${API_BASE_URL}/certifications/${certId}/milestones/${phaseIndex}/complete`, {
            method: 'POST'
        });
        return handleResponse(res);
    },

    // Send certification assistant message
    sendCertAssistantMessage: async (certId, query) => {
        const res = await fetch(`${API_BASE_URL}/certifications/${certId}/assistant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        return handleResponse(res);
    },

    // Compare certifications
    compareCertifications: async (certIds) => {
        const res = await fetch(`${API_BASE_URL}/certifications/compare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(certIds)
        });
        return handleResponse(res);
    },

    // Get career overview
    getCareerOverview: async () => {
        const res = await fetch(`${API_BASE_URL}/career/overview`);
        return handleResponse(res);
    },

    // Get transition roadmap
    getCareerTransitionPlan: async (targetCareer) => {
        const res = await fetch(`${API_BASE_URL}/career/transition?target=${encodeURIComponent(targetCareer)}`);
        return handleResponse(res);
    },

    // Get company openings
    getCompanyOpenings: async (targetCareer) => {
        const res = await fetch(`${API_BASE_URL}/career/companies?target=${encodeURIComponent(targetCareer)}`);
        return handleResponse(res);
    },

    // Search skill demand
    searchSkillDemand: async (skill) => {
        const res = await fetch(`${API_BASE_URL}/career/skill?skill=${encodeURIComponent(skill)}`);
        return handleResponse(res);
    },

    // Send career advisor message
    sendCareerAdvisorMessage: async (query) => {
        const res = await fetch(`${API_BASE_URL}/career/advisor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        return handleResponse(res);
    }
};
