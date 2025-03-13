// 프로젝트 사전 api
import apiClient from "./index.js";

//동의어 사전 목록 조회
export const getSynonym = (projectId, pageNum) => {
    return apiClient.get('/api/v1/synonym', {
        params: {
            project_id: projectId,
            page: pageNum,
        }
    })
}

// 동의어 사전 전체 호출(엑셀 다운로드 용)
export const getAllSynonym = (projectId) => {
    return apiClient.get('/synonym/download', {
        params: {
            project_id: projectId,
        }
    })
}

// 동의어 관계 추가
export const addSynonym = (Synonym) => {
    return apiClient.post('/synonym', Synonym)
}

// 동의어 관계 수정
export const updateSynonym = (synonymId, Synonym) => {
    return apiClient.patch(`/synonym/${synonymId}`, Synonym)
}

// 동의어 관계 삭제
export const deleteSynonym = (synonymId) => {
    return apiClient.delete(`/synonym/${synonymId}`)
}

// 이의어 사전 목록 조회
export const getHomonym = (projectId, pageNum) => {
    return apiClient.get('/homonym', {
        params: {
            project_id: projectId,
            page: pageNum,
        }
    })
}

// 이의어 사전 전체 호출(엑셀 다운로드 용)
export const getAllHomonym = (projectId) => {
    return apiClient.get('/homonym/download', {
        params: {
            project_id: projectId,
        }
    })
}

// 이의어 관계 추가
export const addHomonym = (Homonym) => {
    return apiClient.post('/homonym', Homonym)
}

// 이의어 관계 수정
export const updateHomonym = (HomonymId, Homonym) => {
    return apiClient.patch(`/homonym/${HomonymId}`, Homonym)
}

// 이의어 관계 삭제
export const deleteHomonym = (HomonymId) => {
    return apiClient.delete(`/homonym/${HomonymId}`)
}
