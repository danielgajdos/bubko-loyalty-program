<template>
  <div class="admin-dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1 class="title">📊 Admin Dashboard</h1>
        <div class="header-actions">
          <router-link to="/admin/scanner" class="btn btn-primary">
            <i class="fas fa-qrcode"></i> QR Skener
          </router-link>
          <button @click="logout" class="btn btn-secondary">
            <i class="fas fa-sign-out-alt"></i> Odhlásiť
          </button>
        </div>
      </div>
      
      <div v-if="stats" class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">Registrovaní používatelia</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-number">{{ stats.todayVisits }}</div>
            <div class="stat-label">Dnešné návštevy</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-number">{{ stats.monthVisits }}</div>
            <div class="stat-label">Návštevy tento mesiac</div>
          </div>
        </div>
        
        <div class="card recent-visits">
          <h3 style="color: #333; margin-bottom: 20px;">
            <i class="fas fa-clock"></i> Posledné návštevy
          </h3>
          
          <div v-if="stats.recentVisits.length === 0" class="no-visits">
            <p style="color: #666; text-align: center; padding: 40px;">
              Zatiaľ žiadne návštevy dnes
            </p>
          </div>
          
          <div v-else class="visits-list">
            <div 
              v-for="visit in stats.recentVisits" 
              :key="visit.visit_date" 
              class="visit-item"
            >
              <div class="visit-info">
                <div class="visitor-name">
                  {{ visit.first_name }} {{ visit.last_name }}
                </div>
                <div class="visit-time">
                  {{ formatDateTime(visit.visit_date) }}
                </div>
              </div>
              <div class="visit-type">
                <span v-if="visit.is_free_visit" class="free-badge">
                  🎁 Voľná
                </span>
                <span v-else class="paid-badge">
                  💰 Platená
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="loading">
        <p>Načítavam údaje...</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: null,
      loading: true
    }
  },
  async mounted() {
    await this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      try {
        const response = await api.getDashboard()
        this.stats = response.data
      } catch (error) {
        console.error('Failed to load dashboard:', error)
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.$router.push('/admin')
        }
      } finally {
        this.loading = false
      }
    },
    formatDateTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('sk-SK', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    logout() {
      localStorage.removeItem('adminToken')
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  padding: 40px 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

.recent-visits {
  max-width: 800px;
  margin: 0 auto;
}

.visits-list {
  max-height: 400px;
  overflow-y: auto;
}

.visit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.visit-item:hover {
  background-color: #f8f9fa;
}

.visit-item:last-child {
  border-bottom: none;
}

.visitor-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.visit-time {
  color: #666;
  font-size: 0.9rem;
}

.free-badge {
  background: linear-gradient(45deg, #96ceb4, #feca57);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.paid-badge {
  background: linear-gradient(45deg, #45b7d1, #4ecdc4);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}

.no-visits {
  text-align: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .visit-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>