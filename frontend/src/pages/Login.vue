<template>
  <div class="login">
    <div class="container">
      <div class="login-form">
        <div class="text-center mb-20">
          <h1 class="title">🥙 Prihlásenie</h1>
          <p class="subtitle">Vitaj späť v Kebab na Kyjevskom!</p>
        </div>
        
        <div class="card">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required
                placeholder="tvoj@email.sk"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Heslo</label>
              <input 
                type="password" 
                id="password" 
                v-model="form.password" 
                required
                placeholder="Tvoje heslo"
              >
            </div>
            
            <div v-if="error" class="error">
              {{ error }}
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
              {{ loading ? 'Prihlasovanie...' : 'Prihlásiť sa' }}
            </button>
          </form>
          
          <div class="text-center mt-20">
            <p>Nemáš ešte účet? 
              <router-link to="/register" style="color: #4ecdc4; text-decoration: none;">
                Registruj sa tu
              </router-link>
            </p>
          </div>
          
          <div class="text-center mt-20">
            <router-link to="/" class="btn btn-secondary">
              🏠 Späť na hlavnú stránku
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
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
        const response = await api.login(this.form)
        localStorage.setItem('token', response.data.token)
        this.$router.push('/profile')
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
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.login-form {
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
}
</style>