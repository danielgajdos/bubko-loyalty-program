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
            
            <!-- One Child Stats -->
            <div class="product-section">
              <h3 style="color: #333; margin-bottom: 15px;">👶 Vstup pre 1 dieťa</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon">🚀</div>
                  <div class="stat-number">{{ user.oneChildVisits }}</div>
                  <div class="stat-label">Návštevy</div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">🎁</div>
                  <div class="stat-number">{{ user.oneChildFreeAvailable }}</div>
                  <div class="stat-label">Voľné vstupy (1h)</div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">⭐</div>
                  <div class="stat-number">{{ nextFreeOneChild }}</div>
                  <div class="stat-label">Do ďalšej voľnej</div>
                </div>
              </div>
              
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progressOneChild + '%' }"></div>
                </div>
                <p style="color: #666; margin-top: 10px;">
                  {{ user.oneChildVisits % 5 }}/5 návštev
                </p>
              </div>
            </div>

            <!-- Two Kids Stats -->
            <div class="product-section">
              <h3 style="color: #333; margin-bottom: 15px;">👶👶 Vstup pre 2 deti (špeciálna cena)</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon">🚀</div>
                  <div class="stat-number">{{ user.twoKidsVisits }}</div>
                  <div class="stat-label">Návštevy</div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">🎁</div>
                  <div class="stat-number">{{ user.twoKidsFreeAvailable }}</div>
                  <div class="stat-label">Voľné vstupy (1h)</div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">⭐</div>
                  <div class="stat-number">{{ nextFreeTwoKids }}</div>
                  <div class="stat-label">Do ďalšej voľnej</div>
                </div>
              </div>
              
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progressTwoKids + '%' }"></div>
                </div>
                <p style="color: #666; margin-top: 10px;">
                  {{ user.twoKidsVisits % 5 }}/5 návštev
                </p>
              </div>
            </div>
            
            <div class="info-note">
              ℹ️ Každá 6. návšteva je zadarmo - 1 hodina vstupu!
            </div>
          </div>
        </div>
        
        <div class="card codes-card">
          <h3 style="color: #333; margin-bottom: 20px; text-align: center;">
            Tvoje vesmírne kódy 🛸
          </h3>
          
          <div class="codes-tabs">
            <button 
              @click="activeTab = 'qr'" 
              :class="['tab-btn', { active: activeTab === 'qr' }]"
            >
              📱 QR Kód
            </button>
            <button 
              @click="activeTab = 'barcode'" 
              :class="['tab-btn', { active: activeTab === 'barcode' }]"
            >
              📊 Čiarový kód
            </button>
          </div>

          <div v-if="activeTab === 'qr'" class="code-container">
            <div class="code-display">
              <img :src="user.qrCode" alt="QR Code" class="qr-code">
            </div>
            <div class="code-text-backup">
              <p style="color: #333; font-weight: 600; margin: 15px 0 5px 0;">
                Záložný kód (ak nefunguje skenovanie):
              </p>
              <div class="code-text">
                {{ user.qrCodeText }}
              </div>
              <button @click="copyCode(user.qrCodeText)" class="btn-copy">
                <i class="fas fa-copy"></i> Kopírovať kód
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'barcode'" class="code-container">
            <div class="code-display">
              <canvas ref="barcodeCanvas" class="barcode"></canvas>
            </div>
            <div class="code-text-backup">
              <p style="color: #333; font-weight: 600; margin: 15px 0 5px 0;">
                Čiarový kód:
              </p>
              <div class="code-text">
                {{ user.qrCodeText }}
              </div>
              <button @click="copyCode(user.qrCodeText)" class="btn-copy">
                <i class="fas fa-copy"></i> Kopírovať kód
              </button>
            </div>
          </div>
          
          <p style="color: #666; text-align: center; margin-top: 15px;">
            Ukáž tento kód pri vstupe do vesmírnej stanice
          </p>
        </div>
        
        <div class="card visits-card" v-if="visits.length > 0">
          <h3 style="color: #333; margin-bottom: 20px;">História vesmírnych misií</h3>
          <div class="visits-list">
            <div 
              v-for="visit in visits" 
              :key="visit.visit_date" 
              class="visit-item"
            >
              <div class="visit-info-left">
                <div class="visit-date">
                  {{ formatDate(visit.visit_date) }}
                </div>
                <div class="visit-product">
                  {{ visit.product_type === 'one_child' ? '👶 1 dieťa' : '👶👶 2 deti' }}
                </div>
              </div>
              <div class="visit-type">
                <span v-if="visit.is_free_visit" class="free-badge">
                  🎁 Voľný vstup (1h)
                </span>
                <span v-else class="paid-badge">
                  🚀 Platený vstup
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
import JsBarcode from 'jsbarcode'

export default {
  name: 'Profile',
  data() {
    return {
      user: null,
      visits: [],
      loading: true,
      activeTab: 'qr'
    }
  },
  computed: {
    nextFreeOneChild() {
      if (!this.user) return 0
      return 5 - (this.user.oneChildVisits % 5)
    },
    progressOneChild() {
      if (!this.user) return 0
      return ((this.user.oneChildVisits % 5) / 5) * 100
    },
    nextFreeTwoKids() {
      if (!this.user) return 0
      return 5 - (this.user.twoKidsVisits % 5)
    },
    progressTwoKids() {
      if (!this.user) return 0
      return ((this.user.twoKidsVisits % 5) / 5) * 100
    }
  },
  async mounted() {
    await this.loadProfile()
    await this.loadVisits()
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'barcode' && this.user) {
        this.$nextTick(() => {
          this.generateBarcode()
        })
      }
    },
    user(newUser) {
      if (newUser && this.activeTab === 'barcode') {
        this.$nextTick(() => {
          this.generateBarcode()
        })
      }
    }
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
    },
    generateBarcode() {
      if (this.$refs.barcodeCanvas && this.user?.qrCodeText) {
        try {
          JsBarcode(this.$refs.barcodeCanvas, this.user.qrCodeText, {
            format: "CODE128",
            width: 2,
            height: 100,
            displayValue: false,
            background: "#ffffff",
            lineColor: "#000000",
            margin: 10
          })
        } catch (error) {
          console.error('Failed to generate barcode:', error)
        }
      }
    },
    async copyCode(text) {
      try {
        await navigator.clipboard.writeText(text)
        // Show success feedback
        const button = event.target.closest('.btn-copy')
        const originalText = button.innerHTML
        button.innerHTML = '<i class="fas fa-check"></i> Skopírované!'
        button.style.background = '#4caf50'
        
        setTimeout(() => {
          button.innerHTML = originalText
          button.style.background = ''
        }, 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
        // Fallback: select text
        const textElement = document.querySelector('.code-text')
        const range = document.createRange()
        range.selectNode(textElement)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
      }
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

.product-section {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 15px;
  border: 2px solid #dee2e6;
}

.product-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-section {
  margin-top: 20px;
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

.info-note {
  background: #fff3cd;
  color: #856404;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  border: 2px solid #ffc107;
}

.codes-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.tab-btn {
  padding: 10px 20px;
  border: 2px solid #4ecdc4;
  background: white;
  color: #4ecdc4;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.tab-btn.active {
  background: linear-gradient(45deg, #4ecdc4, #96ceb4);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
}

.tab-btn:hover:not(.active) {
  background: #f0f9ff;
  transform: translateY(-1px);
}

.code-container {
  text-align: center;
}

.code-display {
  margin-bottom: 20px;
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

.barcode {
  border: 3px solid #4ecdc4;
  border-radius: 15px;
  padding: 10px;
  background: white;
  max-width: 100%;
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

.visit-info-left {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.visit-date {
  color: #333;
  font-weight: 600;
}

.visit-product {
  color: #666;
  font-size: 0.9rem;
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

.code-text-backup {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px dashed #ddd;
}

.code-text {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  background: white;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  text-align: center;
  margin: 10px 0;
  word-break: break-all;
  user-select: all;
}

.btn-copy {
  background: linear-gradient(45deg, #7986cb, #5c6bc0);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 10px auto 0;
}

.btn-copy:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(121, 134, 203, 0.4);
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