import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Đăng nhập',
      },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/qlkh',
      name: 'QLKH',
      component: () => import('../views/QLKH.vue'),
      meta: {
        title: 'Quản lý Khách hàng',
        requiresAuth: true,
      },
    },
    {
      path: '/qlnb',
      name: 'QLNB',
      component: () => import('../views/QLNB.vue'),
      meta: {
        title: 'Quản lý Nội bộ',
        requiresAuth: true,
      },
    },
    {
      path: '/qldm',
      name: 'QLDM',
      component: () => import('../views/QLDM.vue'),
      meta: {
        title: 'Quản lý Định mức',
        requiresAuth: true,
      },
    },
    {
      path: '/qlpo',
      name: 'QLPO',
      component: () => import('../views/QLPO.vue'),
      meta: {
        title: 'Quản lý PO',
        requiresAuth: true,
      },
    },
    {
      path: '/qluser',
      name: 'QLUser',
      component: () => import('../views/QLUser.vue'),
      meta: {
        title: 'Quản lý User',
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  // Cập nhật title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Hệ thống quản lý`
  }

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  // Tránh redirect loop: nếu đang redirect đến cùng một trang
  if (to.path === from.path) {
    next()
    return
  }

  // Xử lý trang signin
  if (to.path === '/signin') {
    if (isAuthenticated) {
      next('/')
      return
    }
    next()
    return
  }

  // Xử lý các trang yêu cầu authentication
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/signin')
      return
    }
    next()
    return
  }

  // Các trang khác
  next()
})

export default router
