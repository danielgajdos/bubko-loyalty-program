<template>
  <div class="admin-login">
    <div class="container">
      <div class="login-form">
        <div class="text-center mb-20">
          <h1 class="title">🔐 Administrácia</h1>
          <p class="subtitle">Prihlásenie pre personál</p>
        </div>
        
        <div class="card">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">Používateľské meno</label>
              <input 
                type="text" 
                id="username" 
                v-model="form.username" 
                required
                placeholder="admin"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Heslo</label>
              <input 
                type="password" 
                id="password" 
                v-model="form.password" 
                required
                placeholder="Heslo"
              >
            </div>
            
            <div v-if="error" class="error">
              {{ error }}
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
              <i class="fas fa-sign-in-alt"></i>
              {{ loading ? 'Prihlasovanie...' : 'Prihlásiť sa' }}
            </button>
          </form>
          
          <div class="text-center mt-20">
            <router-link to="/" class="btn btn-secondary">
              <i class="fas fa-home"></i> Späť na hlavnú
            </router-link>
          </div>
          
          <div class="admin-info mt-20">
            <p style="color: #666; font-size: 0.9rem; text-align: center;">
              <strong>Demo prístup:</strong><br>
              Používateľ: admin<br>
              Heslo: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'

export default {
  name: 'AdminLogin',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.loading = true
      
      try {
        const response = await api.adminLogin(this.form)
        localStorage.setItem('adminToken', response.data.token)
        this.$router.push('/admin/dashboard')
      } catch (error) {
        this.error = error.response?.data?.error || 'Prihlásenie zlyhalo'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.login-form {
  max-width: 400px;
  margin: 0 auto;
}

.admin-info {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
}
</style>