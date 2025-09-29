<template>
  <div class="scanner">
    <div class="container">
      <div class="scanner-header">
        <h1 class="title">📱 QR Skener</h1>
        <div class="header-actions">
          <router-link to="/admin/dashboard" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Dashboard
          </router-link>
        </div>
      </div>
      
      <div class="scanner-content">
        <div class="card scanner-card">
          <div class="scanner-section">
            <h3 style="color: #333; margin-bottom: 20px; text-align: center;">
              Naskenuj QR kód zákazníka
            </h3>
            
            <!-- Manual QR input -->
            <div class="manual-input">
              <div class="form-group">
                <label for="qrInput">Alebo zadaj QR kód manuálne:</label>
                <div class="input-group">
                  <input 
                    type="text" 
                    id="qrInput" 
                    v-model="manualQrCode" 
                    placeholder="Vlož QR kód..."
                    @keyup.enter="scanQrCode"
                  >
                  <button @click="scanQrCode" class="btn btn-primary" :disabled="!manualQrCode || loading">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Camera scanner would go here -->
            <div class="camera-placeholder">
              <div class="camera-icon">
                <i class="fas fa-camera"></i>
              </div>
              <p>Kamera skener bude dostupný v plnej verzii</p>
              <p style="font-size: 0.9rem; color: #666;">
                Zatiaľ použite manuálne zadanie QR kódu
              </p>
            </div>
          </div>
        </div>
        
        <!-- Scan Results -->
        <div v-if="scanResult" class="card result-card">
          <div v-if="scanResult.hasFreeVisit" class="free-visit-prompt">
            <h3 style="color: #333; margin-bottom: 20px;">
              🎁 Zákazník má voľné návštevy!
            </h3>
            
            <div class="customer-info">
              <p><strong>Meno:</strong> {{ scanResult.user.name }}</p>
              <p><strong>Celkové návštevy:</strong> {{ scanResult.user.totalVisits }}</p>
              <p><strong>Dostupné voľné návštevy:</strong> {{ scanResult.user.availableFreeVisits }}</p>
            </div>
            
            <div class="action-buttons">
              <button @click="confirmVisit(true)" class="btn btn-success" :disabled="processing">
                <i class="fas fa-gift"></i> Použiť voľnú návštevu
              </button>
              <button @click="confirmVisit(false)" class="btn btn-primary" :disabled="processing">
                <i class="fas fa-money-bill"></i> Platenú návštevu
              </button>
            </div>
          </div>
          
          <div v-else-if="scanResult.success" class="success-result">
            <h3 style="color: #4ecdc4; margin-bottom: 20px;">
              ✅ Návšteva zaznamenaná!
            </h3>
            
            <div class="customer-info">
              <p><strong>Meno:</strong> {{ scanResult.user.name }}</p>
              <p><strong>Celkové návštevy:</strong> {{ scanResult.user.totalVisits }}</p>
              <p><strong>Získané voľné návštevy:</strong> {{ scanResult.user.freeVisitsEarned }}</p>
              <p v-if="scanResult.user.nextFreeVisitIn">
                <strong>Do ďalšej voľnej:</strong> {{ scanResult.user.nextFreeVisitIn }} návštev
              </p>
            </div>
            
            <button @click="resetScanner" class="btn btn-primary">
              <i class="fas fa-plus"></i> Ďalší zákazník
            </button>
          </div>
        </div>
        
        <div v-if="error" class="error">
          {{ error }}
          <button @click="resetScanner" class="btn btn-secondary" style="margin-top: 10px;">
            Skúsiť znovu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'

export default {
  name: 'Scanner',
  data() {
    return {
      manualQrCode: '',
      scanResult: null,
      loading: false,
      processing: false,
      error: ''
    }
  },
  methods: {
    async scanQrCode() {
      if (!this.manualQrCode.trim()) return
      
      this.loading = true
      this.error = ''
      this.scanResult = null
      
      try {
        const response = await api.scanQR(this.manualQrCode.trim())
        this.scanResult = response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Neplatný QR kód'
      } finally {
        this.loading = false
      }
    },
    
    async confirmVisit(useFreeVisit) {
      this.processing = true
      this.error = ''
      
      try {
        const response = await api.confirmFreeVisit(this.manualQrCode.trim(), useFreeVisit)
        this.scanResult = response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Chyba pri spracovaní návštevy'
      } finally {
        this.processing = false
      }
    },
    
    resetScanner() {
      this.manualQrCode = ''
      this.scanResult = null
      this.error = ''
      this.loading = false
      this.processing = false
    }
  }
}
</script>

<style scoped>
.scanner {
  min-height: 100vh;
  padding: 40px 0;
}

.scanner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.scanner-content {
  max-width: 600px;
  margin: 0 auto;
}

.scanner-card {
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  gap: 10px;
}

.input-group input {
  flex: 1;
}

.input-group .btn {
  padding: 15px 20px;
  white-space: nowrap;
}

.camera-placeholder {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 15px;
  margin-top: 30px;
  border: 2px dashed #ddd;
}

.camera-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 20px;
}

.result-card {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.customer-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.customer-info p {
  margin-bottom: 10px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.success-result {
  text-align: center;
}

.free-visit-prompt {
  text-align: center;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .scanner-header {
    flex-direction: column;
    text-align: center;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
</style>