// playground api
import apiClient from "./index"

//대화 기록 조회
export const getConversations = (projectId) => {
    return apiClient.get(`/conversations`, {
        params: {
            project_id: projectId,
        }
    })
}

// 신규 대화 생성
export const addConversation = (conversationInfo) => {
    return apiClient.post(`/conversations`, conversationInfo)
}

// 대화 내용 열기
export const openConversation = (conversationId) => {
    return apiClinet.get(`/conversations`, {
        params: {
            conversation_id: conversationId,
        }
    })
}

// 신규 질문 등록
export const addQuestion = (questionInfo) => {
    return apiClient.post(`/question`, questionInfo )
}

// 피드백 등록
export const addFeedback = (feedbackInfo) => {
    return apiClient.post(`/feedback`, feedbackInfo)
}

// 대화 삭제
export const deleteConversation = (conversationId) => {
    return apiClient.delete(`/conversations/${conversationId}`)
}