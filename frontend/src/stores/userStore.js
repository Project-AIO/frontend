import {defineStore} from "pinia";
import {ref} from "vue";
import {
    addAccount,
    addProjectAccount,
    deleteAccount,
    deleteProjectAccount,
    getAccounts,
    // getProjectAccounts
} from "../api/account.js";

export const useUserStore = defineStore('user', () => {
    const userList = ref([])
    const projectAccountIds = ref([])

    function reset() {
        userList.value = [];
        projectAccountIds.value = [];
    }

    // 사용자 전체 조회
    async function fetchUsers(pageNum) {
        try {
            const response = await getAccounts(pageNum);
            userList.value = response.data.accounts;
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    // 사용자 계정 추가
    async function addUser(accountInfo) {
        try {
            const [response] = await Promise.all([addAccount(accountInfo)]);
            return response
        } catch (error) {
            throw error;
        }
    }

    // 사용자 계정 수정
    // async function updateUser(accountID, updateInfo) {
    //     try {
    //         const response = await updateAccount(accountID, updateInfo);
    //         await fetchUsers(1)
    //         return response
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // 사용자 계정 삭제
    async function deleteUser(accountID) {
        try {
            return await deleteAccount(accountID)
        } catch (error) {
            throw error;
        }
    }

    // 프로젝트 계정 조회
    async function fetchProjectUsers(projectID, pageNum) {
        try {
            const response  = await getAccounts(pageNum, projectID);
            userList.value = response.data.accounts;
            projectAccountIds.value = response.data.projectAccountIds;
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // 프로젝트 계정 추가
    async function addProjectUser(projectID, accountList) {
        try {
            return await addProjectAccount(projectID, accountList)
        } catch (error) {
            throw error;
        }
    }

    // 프로젝트 계정 삭제
    async function deleteProjectUser(projectID, accountList) {
        try {
            return await deleteProjectAccount(projectID, accountList)
        } catch (error) {
            throw error;
        }
    }

    return { userList, fetchUsers, addUser, deleteUser,
        projectAccountIds, fetchProjectUsers, addProjectUser, deleteProjectUser,
        reset }
}, {
    persist: {
        key: 'user',
        storage: sessionStorage
    }
});