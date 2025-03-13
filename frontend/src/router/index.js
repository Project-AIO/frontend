import { createRouter, createWebHistory } from 'vue-router'
import { setActivePinia } from 'pinia'
import pinia from '../pinia'
setActivePinia(pinia)  // active Pinia 설정
import { useAdminStore } from "../stores/adminStore.js";

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

// 비동기 컴포넌트 로딩
// const DashboardCharts = () => import('../views/DashboardCharts.vue')
// const DashboardAsk = () => import('../views/DashboardAsk.vue')
// const DashboardAnls = () => import('../views/DashboardAnls.vue')
const DashboardUsers = () => import('../views/DashboardUsers.vue')
const DashboardAccount = () => import('../views/DashboardAccount.vue')
const DashboardProject = () => import('../views/DashboardProject.vue')
// const DashboardAdmin = () => import('../views/DashboardAdmin.vue')
// const DashboardKldg = () => import('../views/DashboardKldg.vue')
// const KnowledgeDocs = () => import('../views/KnowledgeDocs.vue')
// const KnowledgeFdbk = () => import('../views/KnowledgeFdbk.vue')
// const KnowledgeSDict = () => import('../views/KnowledgeSDict.vue')
// const KnowledgeHDict = () => import('../views/KnowledgeHDict.vue')

const routes = [
    { path: '/login', component: LoginView, meta: { title: '로그인' } },
    { path: '/dashboard', component: DashboardView,
      children: [
            // { path: 'charts', component: DashboardCharts, meta: { title: 'Dashboard'} },
            // { path: 'kldg', component: DashboardKldg, meta: { title: 'Knowledge' },
            //     children: [
            //         { path: 'documents', component: KnowledgeDocs },
            //         { path: 'feedback', component: KnowledgeFdbk },
            //         { path: 'synonym', component: KnowledgeSDict },
            //         { path: 'homonym', component: KnowledgeHDict },
            //         { path: '', redirect: '/dashboard/kldg/documents' }
            //     ]
            // },
            // { path: 'ask', component: DashboardAsk, meta: { title: 'Playground'} },
            // { path: 'analytics', component: DashboardAnls, meta: { title: 'Analytics' } },
            { path: 'setting',
                children: [
                { path: 'account', component: DashboardAccount,
                  children: [
                    // { path: 'admin', component: DashboardAdmin, meta: { title: '관리자 계정 관리' } },
                    { path: 'users', component: DashboardUsers, meta: { title: '사용자 계정 관리' } },
                    { path: '', redirect: '/dashboard/setting/account/users' }
                  ]
                },
                { path: 'project', component: DashboardProject, meta: {title: '프로젝트 관리'}}
          ]
        },
      ]
    },
    { path: '/', redirect: '/login' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// // 서버에 인증 상태 확인 요청
// const checkAuth = async () => {
//     try {
//         const response = await api.get('/auth-check', { withCredentials: true })
//         return response.data.authenticated
//     } catch {
//         return false
//     }
// }
//
// // 네비게이션 가드에서 인증 여부 확인 후 리다이렉트 처리
// router.beforeEach(async (to, from, next) => {
//     const isAuthenticated = await checkAuth()
//
//     if (to.path === '/login' && isAuthenticated) {
//         next('/dashboard/charts') // 로그인된 상태에서 /login 접근 시 대시보드로 이동
//     } else if (to.meta.requiresAuth && !isAuthenticated) {
//         next('/login') // 보호된 페이지 접근 시 로그인 필요
//     } else {
//         next() // 정상적으로 페이지 이동
//     }
// })


// 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
    const adminStore = useAdminStore()
    if (to.path === '/login' && adminStore.accessToken) {
        return next('/dashboard');
    }

    if (to.path !== '/login' && !adminStore.accessToken) {
        return next('/login');
    }

    next();
});

export default router