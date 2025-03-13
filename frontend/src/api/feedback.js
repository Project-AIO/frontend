// Knoewledge - Feedback 탭 api
import apiClient from "./index.js"

// 피드백 내역 조회
export const getFeedbacks = (projectId) => {
    apiClient.get(`/feedbacks`, {
        params: {
            project_id: projectId,
        }
    })
}