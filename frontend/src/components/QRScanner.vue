<template>
  <div class="qr-scanner-modal">
    <div class="scanner-content">
      <div class="scanner-header">
        <h3>📱 Skenovať QR kód</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <div class="scanner-body">
        <!-- Manual input -->
        <div class="manual-input">
          <div class="form-group">
            <label>Zadajte QR kód manuálne:</label>
            <div class="input-group">
              <input 
                v-model="manualCode" 
                type="text" 
                placeholder="Vlož QR kód..."
                @keyup.enter="submitCode"
              >
              <button @click="submitCode" class="btn btn-primary" :disabled="!manualCode.trim()">
                <i class="fas fa-check"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Camera scanner -->
        <div class="camera-section">
          <div v-if="!cameraActive && cameraSupported" class="camera-controls">
            <button @click="startCamera" class="btn btn-success">
              <i class="fas fa-camera"></i> Spustiť kameru
            </button>
          </div>
          
          <div v-if="cameraActive" class="camera-container">
            <div id="qr-scanner-reader" class="qr-reader"></div>
            <div class="camera-controls">
              <button @click="stopCamera" class="btn btn-secondary">
                <i class="fas fa-stop"></i> Zastaviť kameru
              </button>
            </div>
          </div>
          
          <div v-if="!cameraSupported" class="camera-placeholder">
            <div class="camera-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <p>Kamera nie je podporovaná</p>
            <p style="font-size: 0.9rem; color: #666;">
              Použite manuálne zadanie QR kódu
            </p>
          </div>
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Html5QrcodeScanner } from 'html5-qrcode'

export default {
  name: 'QRScanner',
  emits: ['close', 'scan'],
  data() {
    return {
      manualCode: '',
      cameraActive: false,
      cameraSupported: true,
      qrScanner: null,
      error: ''
    }
  },
  mounted() {
    this.checkCameraSupport()
  },
  beforeUnmount() {
    this.stopCamera()
  },
  methods: {
    checkCameraSupport() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.cameraSupported = false
        return
      }
      
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        this.cameraSupported = false
        this.error = 'Kamera vyžaduje HTTPS pripojenie'
      }
    },

    async startCamera() {
      try {
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
          this.error = 'Kamera vyžaduje HTTPS pripojenie'
          return
        }

        this.cameraActive = true
        this.error = ''
        
        try {
          await navigator.mediaDevices.getUserMedia({ video: true })
        } catch (permissionError) {
          this.error = 'Prístup ke kamere bol zamietnutý'
          this.cameraActive = false
          return
        }
        
        this.qrScanner = new Html5QrcodeScanner(
          "qr-scanner-reader",
          { 
            fps: 10,
            qrbox: { width: 200, height: 200 },
            aspectRatio: 1.0
          },
          false
        )
        
        this.qrScanner.render(
          (decodedText) => {
            this.onScanSuccess(decodedText)
          },
          (error) => {
            if (error.includes('Permission') || error.includes('NotAllowed')) {
              this.error = 'Prístup ke kamere bol zamietnutý'
              this.stopCamera()
            }
          }
        )
      } catch (error) {
        console.error('Camera error:', error)
        this.error = 'Chyba kamery. Skúste manuálne zadanie.'
        this.cameraActive = false
      }
    },

    stopCamera() {
      if (this.qrScanner) {
        this.qrScanner.clear()
        this.qrScanner = null
      }
      this.cameraActive = false
    },

    onScanSuccess(decodedText) {
      this.stopCamera()
      this.$emit('scan', decodedText)
    },

    submitCode() {
      if (this.manualCode.trim()) {
        this.$emit('scan', this.manualCode.trim())
      }
    }
  }
}
</script>

<style scoped>
.qr-scanner-modal {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.scanner-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px 15px 0 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-body {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.input-group {
  display: flex;
  gap: 10px;
}

.input-group input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
}

.camera-section {
  margin-top: 20px;
}

.camera-container {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.qr-reader {
  max-width: 100%;
  margin: 0 auto;
}

.camera-controls {
  text-align: center;
  margin-top: 15px;
}

.camera-placeholder {
  text-align: center;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px dashed #ddd;
}

.camera-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 15px;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 10px 15px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

.btn-secondary {
  background: linear-gradient(45deg, #6c757d, #495057);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 117, 125, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

@media (max-width: 768px) {
  .qr-scanner-modal {
    width: 95%;
    margin: 20px;
  }
  
  .scanner-body {
    padding: 20px;
  }
  
  .input-group {
    flex-direction: column;
  }
}
</style>