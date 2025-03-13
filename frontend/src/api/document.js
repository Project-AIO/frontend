// Knowledge - document 탭 api
import apiClient from './index'

// 프로젝트 폴더 api
// 프로젝트 폴더 목록 조회
export const getFolders = (projectId) => {
    return apiClient.get(`/project_folder`, {
        params: {
            project_id: projectId,
        },
    })
}

// 폴더 생성
export const addFolder = (folderInfo) => {
    return apiClient.post(`/project_folder`, folderInfo)
}

// 폴더 삭제
export const deleteFolder = (folderId) => {
    return apiClient.delete(`/project_folder/${folderId}`)
}

// 프로젝트 문서 api
// 문서 목록 조회
export const getDocs = (folderId) => {
    return apiClient.get(`/document`, {
        params: {
            project_folder_id: folderId,
        },
    })
}

// 문서 등록
export const addDoc = (docInfo) => {
    return apiClient.post(`/document`, docInfo)
}

// 문서 정보 수정
export const updateDoc = (docId, updateInfo) => {
    return apiClient.patch(`/document/${docId}`, updateInfo)
}

// 문서 삭제
export const deleteDoc = (docId) => {
    apiClient.delete(`/document/${docId}`)
}
