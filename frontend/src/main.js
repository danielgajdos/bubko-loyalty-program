import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Import components
import Home from './pages/Home.vue'
import Register from './pages/Register.vue'
import Login from './pages/Login.vue'
import Profile from './pages/Profile.vue'
import AdminLogin from './pages/AdminLogin.vue'
import AdminDashboard from './pages/AdminDashboard.vue'
import Scanner from './pages/Scanner.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAdmin: true } },
  { path: '/admin/scanner', component: Scanner, meta: { requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const adminToken = localStorage.getItem('adminToken')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin && !adminToken) {
    next('/admin')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')