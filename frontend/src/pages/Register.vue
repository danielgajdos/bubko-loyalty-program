<template>
  <div class="register">
    <div class="container">
      <div class="register-form">
        <div class="text-center mb-20">
          <h1 class="title">🚀 Registrácia astronauta</h1>
          <p class="subtitle">Pripoj sa k našej vesmírnej posádke!</p>
        </div>
        
        <div class="card">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="firstName">Meno</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="form.firstName" 
                required
                placeholder="Zadaj svoje meno"
              >
            </div>
            
            <div class="form-group">
              <label for="lastName">Priezvisko</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="form.lastName" 
                required
                placeholder="Zadaj svoje priezvisko"
              >
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required
                placeholder="tvoj@email.sk"
                @blur="validateEmail"
              >
              <div v-if="emailError" class="field-error">
                {{ emailError }}
              </div>
            </div>
            
            <div class="form-group">
              <label for="phone">Telefón (voliteľné)</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="form.phone"
                placeholder="+421 xxx xxx xxx"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Heslo</label>
              <input 
                type="password" 
                id="password" 
                v-model="form.password" 
                required
                placeholder="Minimálne 6 znakov"
                minlength="6"
              >
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Potvrď heslo</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="form.confirmPassword" 
                required
                placeholder="Zopakuj heslo"
              >
            </div>
            
            <!-- GDPR Consent -->
            <div class="consent-section">
              <div class="consent-item required">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="form.gdprConsent" 
                    required
                    class="consent-checkbox"
                  >
                  <span class="checkbox-text">
                    <strong>Súhlasím so spracovaním osobných údajov *</strong>
                    <span class="consent-description">
                      Beriem na vedomie, že moje osobné údaje (meno, priezvisko, email, telefón) budú spracované za účelom evidencie návštev a správy vernostného programu v súlade s GDPR. Viac informácií o spracovaní osobných údajov nájdete v našich 
                      <a href="#" @click.prevent="showGdprInfo" class="consent-link">zásadách ochrany osobných údajov</a>.
                    </span>
                  </span>
                </label>
              </div>
              
              <div class="consent-item optional">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="form.newsletterConsent"
                    class="consent-checkbox"
                  >
                  <span class="checkbox-text">
                    <strong>Súhlasím s odberom newslettera (voliteľné)</strong>
                    <span class="consent-description">
                      Chcem dostávať informácie o špeciálnych akciách, zľavách a podujatiach v Bubko Kids Place.
                    </span>
                  </span>
                </label>
              </div>
              
              <p class="consent-note">
                * Povinné pole - bez súhlasu so spracovaním osobných údajov nie je možné dokončiť registráciu.
              </p>
            </div>
            
            <div v-if="error" class="error">
              {{ error }}
            </div>
            
            <div v-if="success" class="success">
              {{ success }}
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
              🚀
              {{ loading ? 'Pripájam k misii...' : 'Pripojiť sa k misii' }}
            </button>
          </form>
          
          <div class="text-center mt-20">
            <p>Už máš účet? 
              <router-link to="/login" style="color: #4ecdc4; text-decoration: none;">
                Prihlás sa tu
              </router-link>
            </p>
          </div>
          
          <div class="text-center mt-20">
            <router-link to="/" class="btn btn-secondary">
              🏠 Späť na vesmírnu stanicu
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
  name: 'Register',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gdprConsent: false,
        newsletterConsent: false
      },
      loading: false,
      error: '',
      success: '',
      emailError: ''
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email) {
        this.emailError = ''
        return false
      }
      if (!emailRegex.test(this.form.email)) {
        this.emailError = 'Zadajte platný email'
        return false
      }
      this.emailError = ''
      return true
    },
    
    showGdprInfo() {
      alert('Zásady ochrany osobných údajov:\n\nVaše osobné údaje (meno, priezvisko, email, telefón) spracovávame za účelom:\n- Evidencie návštev v našom zariadení\n- Správy vernostného programu\n- Identifikácie pri vstupe pomocou QR kódu\n\nVaše údaje sú chránené v súlade s nariadením GDPR (EU) 2016/679.\n\nMáte právo na prístup k svojim údajom, ich opravu alebo vymazanie.\n\nKontakt: admin@bubko.sk')
    },
    
    async handleRegister() {
      this.error = ''
      this.success = ''
      
      // Validate GDPR consent
      if (!this.form.gdprConsent) {
        this.error = 'Pre dokončenie registrácie musíte súhlasiť so spracovaním osobných údajov'
        return
      }
      
      // Validate email
      if (!this.validateEmail()) {
        return
      }
      
      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Heslá sa nezhodujú'
        return
      }
      
      if (this.form.password.length < 6) {
        this.error = 'Heslo musí mať minimálne 6 znakov'
        return
      }
      
      this.loading = true
      
      try {
        const response = await api.register({
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          phone: this.form.phone,
          password: this.form.password,
          gdprConsent: this.form.gdprConsent,
          newsletterConsent: this.form.newsletterConsent
        })
        
        localStorage.setItem('token', response.data.token)
        this.success = 'Registrácia úspešná! Presmerovávam...'
        
        setTimeout(() => {
          this.$router.push('/profile')
        }, 2000)
        
      } catch (error) {
        this.error = error.response?.data?.error || 'Registrácia zlyhala'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px 0;
}

.register-form {
  max-width: 500px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
}

.field-error {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 5px;
}

.consent-section {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px solid #e9ecef;
}

.consent-item {
  margin-bottom: 20px;
}

.consent-item:last-of-type {
  margin-bottom: 0;
}

.consent-item.required {
  border-left: 4px solid #ff6b6b;
  padding-left: 15px;
}

.consent-item.optional {
  border-left: 4px solid #4ecdc4;
  padding-left: 15px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  gap: 12px;
}

.consent-checkbox {
  margin-top: 4px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #333;
  line-height: 1.5;
}

.checkbox-text strong {
  font-size: 1rem;
  color: #333;
}

.consent-description {
  font-size: 0.9rem;
  color: #666;
  display: block;
}

.consent-link {
  color: #4ecdc4;
  text-decoration: underline;
  cursor: pointer;
}

.consent-link:hover {
  color: #45b7d1;
}

.consent-note {
  margin-top: 15px;
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
  text-align: center;
}
</style>