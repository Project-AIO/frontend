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
const DashboardAdmin = () => import('../views/DashboardAdmin.vue')
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
                    { path: 'admin', component: DashboardAdmin, meta: { title: '관리자 계정 관리' } },
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