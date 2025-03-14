// 사용자 계정 관리 탭 api
import apiClient from './index'

// 사용자 계정 조회
export const getAccounts = (pageNum, projectId) => {
    const params = { page: pageNum }
    if (projectId) {
        params.project_id = projectId
    }
    return apiClient.get('/accounts', { params })
}


// 사용자 계정 등록
export const addAccount = (accountInfo) => {
    return apiClient.post(`/accounts`, accountInfo)
}

// 사용자 계정 수정
// export const updateAccount = (accountId, updateInfo) => {
//     return apiClient.patch(`/accounts/${accountId}`, updateInfo)
// }

// 사용자 계정 삭제
export const deleteAccount = (accountId) => {
    return apiClient.delete(`/accounts/${accountId}`)
}

// 프로젝트 접근 계정 조회
// export const getProjectAccounts = (projectId, pageNum) => {
//     return apiClient.get('/project-account', {
//         params: {
//             project_id: projectId,
//             page: pageNum
//         }
//     })
// }

// 프로젝트 계정 추가
export const addProjectAccount = (projectId, accountList) => {
    return apiClient.post(
        '/project-account',
        { account_list: accountList },
        { params: { project_id: projectId } }
    );
}

// 프로젝트 계정 삭제
export const deleteProjectAccount = (projectId, accountList) => {
    return apiClient.delete('/project-account', {
        data: { account_list: accountList },
        params: { project_id: projectId }
    });
}