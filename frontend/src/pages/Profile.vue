<template>
  <div class="profile">
    <div class="container">
      <div class="profile-header text-center mb-20">
        <h1 class="title">🚀 Môj vesmírny profil</h1>
        <p class="subtitle">Tvoje kozmické misie v Bubko</p>
      </div>
      
      <div v-if="user" class="profile-content">
        <div class="card profile-card">
          <div class="profile-info">
            <h2 style="color: #333; margin-bottom: 20px;">
              Ahoj astronaut {{ user.firstName }}! 👨‍🚀
            </h2>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">🚀</div>
                <div class="stat-number">{{ user.totalVisits }}</div>
                <div class="stat-label">Dokončené misie</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">🎁</div>
                <div class="stat-number">{{ user.availableFreeVisits }}</div>
                <div class="stat-label">Bonusové misie</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-number">{{ nextFreeIn }}</div>
                <div class="stat-label">Do ďalšej bonusovej</div>
              </div>
            </div>
            
            <div class="progress-section">
              <h3 style="color: #333; margin-bottom: 15px;">Pokrok k ďalšej bonusovej misii</h3>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
              <p style="color: #666; margin-top: 10px;">
                {{ user.totalVisits % 5 }}/5 misií
              </p>
            </div>
          </div>
        </div>
        
        <div class="card qr-card">
          <h3 style="color: #333; margin-bottom: 20px; text-align: center;">
            Tvoj vesmírny QR kód 🛸
          </h3>
          <div class="qr-container">
            <img :src="user.qrCode" alt="QR Code" class="qr-code">
            <p style="color: #666; text-align: center; margin-top: 15px;">
              Ukáž tento kód pri vstupe do vesmírnej stanice
            </p>
          </div>
        </div>
        
        <div class="card visits-card" v-if="visits.length > 0">
          <h3 style="color: #333; margin-bottom: 20px;">História vesmírnych misií</h3>
          <div class="visits-list">
            <div 
              v-for="visit in visits" 
              :key="visit.visit_date" 
              class="visit-item"
            >
              <div class="visit-date">
                {{ formatDate(visit.visit_date) }}
              </div>
              <div class="visit-type">
                <span v-if="visit.is_free_visit" class="free-badge">
                  🎁 Bonusová misia
                </span>
                <span v-else class="paid-badge">
                  🚀 Štandardná misia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions text-center">
        <button @click="logout" class="btn btn-secondary">
          <i class="fas fa-sign-out-alt"></i> Odhlásiť sa
        </button>
        <router-link to="/" class="btn btn-primary">
          <i class="fas fa-home"></i> Domov
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'

export default {
  name: 'Profile',
  data() {
    return {
      user: null,
      visits: [],
      loading: true
    }
  },
  computed: {
    nextFreeIn() {
      if (!this.user) return 0
      return 5 - (this.user.totalVisits % 5)
    },
    progressPercentage() {
      if (!this.user) return 0
      return ((this.user.totalVisits % 5) / 5) * 100
    }
  },
  async mounted() {
    await this.loadProfile()
    await this.loadVisits()
  },
  methods: {
    async loadProfile() {
      try {
        const response = await api.getProfile()
        this.user = response.data
      } catch (error) {
        console.error('Failed to load profile:', error)
        this.$router.push('/login')
      }
    },
    async loadVisits() {
      try {
        const response = await api.getVisits()
        this.visits = response.data
      } catch (error) {
        console.error('Failed to load visits:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('sk-SK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  padding: 40px 0;
}

.profile-content {
  display: grid;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.progress-section {
  margin-top: 30px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, #4ecdc4, #96ceb4);
  transition: width 0.3s ease;
}

.qr-container {
  text-align: center;
}

.qr-code {
  max-width: 200px;
  width: 100%;
  height: auto;
  border: 3px solid #4ecdc4;
  border-radius: 15px;
  padding: 10px;
  background: white;
}

.visits-list {
  max-height: 300px;
  overflow-y: auto;
}

.visit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.visit-item:last-child {
  border-bottom: none;
}

.visit-date {
  color: #333;
  font-weight: 600;
}

.free-badge {
  background: linear-gradient(45deg, #96ceb4, #feca57);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.paid-badge {
  background: linear-gradient(45deg, #45b7d1, #4ecdc4);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.actions {
  margin-top: 30px;
}

.actions .btn {
  margin: 0 10px;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions .btn {
    display: block;
    margin: 10px auto;
    max-width: 200px;
  }
}
</style>