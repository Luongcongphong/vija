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
      path: '/qlbg',
      name: 'QLBG',
      component: () => import('../views/QLBG.vue'),
      meta: {
        title: 'Quản lý Báo giá',
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
    // {
    //   path: '/qlkho',
    //   name: 'QLKHO',
    //   component: () => import('../views/QLKHO.vue'),
    //   meta: {
    //     title: 'Quản lý Kho',
    //     requiresAuth: true,
    //   },
    // },
    {
      path: '/qlhl',
      name: 'QLHL',
      component: () => import('../views/QLHL.vue'),
      meta: {
        title: 'Quản lý Hàng Lỗi',
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
  ],
})

router.beforeEach((to, from, next) => {
  // Kiểm tra authentication
  const hasToken = !!localStorage.getItem('token')
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const isAuthValid = hasToken && isAuthenticated

  // Cập nhật title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Hệ thống quản lý`
  }

  // Xử lý trang signin
  if (to.path === '/signin') {
    // Nếu đã đăng nhập, redirect về home
    if (isAuthValid) {
      next({ path: '/', replace: true })
    } else {
      // Chưa đăng nhập, cho vào signin
      next()
    }
    return
  }

  // Xử lý các trang yêu cầu authentication
  if (to.meta.requiresAuth) {
    if (!isAuthValid) {
      // Chưa đăng nhập, redirect về signin
      next({ path: '/signin', replace: true })
    } else {
      // Đã đăng nhập, cho phép truy cập
      next()
    }
    return
  }

  // Các trang khác không yêu cầu auth
  next()
})

export default router
