import apiClient from './index'

// 프로젝트 검색
export const getProjects = () => {
    return apiClient.get('/project')
}

// 프로젝트 생성
export const addProject = (projectName) => {
    return apiClient.post('/project', projectName)
}

// 프로젝트 삭제
export const deleteProject = (projectID) => {
    return apiClient.delete(`/project/${projectID}`)
}