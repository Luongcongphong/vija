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
  // Debug log
  console.log('Router navigation:', { to: to.path, from: from.path })
  
  // Kiểm tra authentication ngay từ đầu
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  const isAuthValid = isAuthenticated && hasToken

  // Cập nhật title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Hệ thống quản lý`
  }

  // Tránh redirect loop
  if (to.path === from.path) {
    console.log('Same path, skip')
    next()
    return
  }

  // Xử lý trang signin
  if (to.path === '/signin') {
    if (isAuthValid) {
      console.log('Already authenticated, redirect to home')
      next('/')
      return
    }
    console.log('Go to signin')
    next()
    return
  }

  // Xử lý các trang yêu cầu authentication - KIỂM TRA TRƯỚC KHI LOAD COMPONENT
  if (to.meta.requiresAuth) {
    if (!isAuthValid) {
      console.log('Not authenticated, redirect to signin immediately')
      // Sử dụng replace thay vì push để không tạo history entry
      next({ path: '/signin', replace: true })
      return
    }
    console.log('Authenticated, proceed')
    next()
    return
  }

  // Các trang khác
  console.log('Other page, proceed')
  next()
})

// Guard bổ sung để đảm bảo không load component khi chưa auth
router.beforeResolve((to, from, next) => {
  // Chỉ kiểm tra cho các trang yêu cầu auth
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const hasToken = !!localStorage.getItem('token')
    
    if (!isAuthenticated || !hasToken) {
      console.log('BeforeResolve: Not authenticated, block component loading')
      next('/signin')
      return
    }
  }
  
  next()
})

export default router
