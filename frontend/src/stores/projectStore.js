import {defineStore} from "pinia";
import {ref} from "vue";
import {addProject, deleteProject, getProjects} from "../api/project.js";

export const useProjectStore = defineStore('project', () => {
    const selectedProject = ref({});

    function reset() {
        selectedProject.value = {};
    }

    // 프로젝트 조회
    async function fetchProjects() {
        try {
            const response = await getProjects();
            return response.data
        } catch (error) {
            throw error;
        }
    }

    // 프로젝트 추가 후 최신 리스트 받아오기
    async function createProject(projectName) {
        try {
            return await addProject(projectName);
        } catch (error) {
            throw error;
        }
    }

    // 프로젝트 삭제
    async function removeProject(projectID) {
        try {
            return await deleteProject(projectID);
        } catch (error) {
            throw error;
        }
    }

    return {selectedProject, fetchProjects, createProject, removeProject, reset};
}, {
    persist: {
        key: 'project',
        storage: sessionStorage
    }
});