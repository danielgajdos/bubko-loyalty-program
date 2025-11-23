<template>
  <div class="container">
    <div class="text-center mb-20">
      <h1 class="title">🥙 Scan & Add Products</h1>
      <p class="subtitle">Scan customer QR code and add multiple products</p>
    </div>

    <div class="card">
      <!-- Step 1: Scan QR Code -->
      <div v-if="!scannedUser" class="scan-section">
        <h2>Step 1: Scan Customer QR Code</h2>
        <div id="qr-reader" style="width: 100%; max-width: 500px; margin: 20px auto;"></div>
        <p class="text-center">or</p>
        <div class="form-group">
          <input 
            v-model="manualQR" 
            @keyup.enter="scanManualQR"
            placeholder="Enter QR code manually"
            class="qr-input"
          />
          <button @click="scanManualQR" class="btn btn-secondary mt-20">Submit QR Code</button>
        </div>
      </div>

      <!-- Step 2: Customer Info & Product Selection -->
      <div v-else class="customer-section">
        <div class="customer-info">
          <h2>✅ Customer Found</h2>
          <p><strong>Name:</strong> {{ scannedUser.first_name }} {{ scannedUser.last_name }}</p>
          <p><strong>Email:</strong> {{ scannedUser.email }}</p>
          <button @click="resetScan" class="btn btn-secondary">Scan Different Customer</button>
        </div>

        <hr style="margin: 30px 0; border: 1px solid #eee;" />

        <h2>Step 2: Add Products</h2>
        
        <!-- Product Categories -->
        <div class="category-tabs">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="['category-tab', { active: selectedCategory === cat }]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="product-card"
            @click="addProduct(product)"
          >
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">€{{ product.price.toFixed(2) }}</div>
            <div class="product-stamps" v-if="getUserStamps(product.id)">
              {{ getUserStamps(product.id).stamps_count }}/10 stamps
              <span v-if="getUserStamps(product.id).free_products_earned > getUserStamps(product.id).free_products_used">
                ({{ getUserStamps(product.id).free_products_earned - getUserStamps(product.id).free_products_used }} free available)
              </span>
            </div>
          </div>
        </div>

        <!-- Selected Products -->
        <div v-if="selectedProducts.length > 0" class="selected-products">
          <h3>Selected Products:</h3>
          <div v-for="(item, index) in selectedProducts" :key="index" class="selected-item">
            <span>{{ item.product.name }}</span>
            <div class="quantity-controls">
              <button @click="decreaseQuantity(index)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQuantity(index)">+</button>
            </div>
            <label class="free-checkbox">
              <input type="checkbox" v-model="item.isFree" :disabled="!canUseFree(item.product.id)" />
              Free
            </label>
            <span class="item-total">€{{ (item.isFree ? 0 : item.product.price * item.quantity).toFixed(2) }}</span>
            <button @click="removeProduct(index)" class="btn-remove">×</button>
          </div>
          
          <div class="total-section">
            <strong>Total: €{{ totalPrice.toFixed(2) }}</strong>
          </div>

          <div class="form-group">
            <label>Notes (optional):</label>
            <textarea v-model="notes" placeholder="Add any notes about this visit..." rows="3"></textarea>
          </div>

          <button @click="submitVisit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Processing...' : 'Complete Visit' }}
          </button>
        </div>
      </div>

      <div v-if="error" class="error mt-20">{{ error }}</div>
      <div v-if="success" class="success mt-20">{{ success }}</div>
    </div>
  </div>
</template>

<script>
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

export default {
  name: 'AdminScanMultiple',
  data() {
    return {
      html5QrCode: null,
      manualQR: '',
      scannedUser: null,
      userStamps: [],
      products: [],
      selectedCategory: 'all',
      selectedProducts: [],
      notes: '',
      error: '',
      success: '',
      submitting: false
    };
  },
  computed: {
    categories() {
      const cats = ['all', ...new Set(this.products.map(p => p.category))];
      return cats;
    },
    filteredProducts() {
      if (this.selectedCategory === 'all') {
        return this.products;
      }
      return this.products.filter(p => p.category === this.selectedCategory);
    },
    totalPrice() {
      return this.selectedProducts.reduce((sum, item) => {
        return sum + (item.isFree ? 0 : item.product.price * item.quantity);
      }, 0);
    }
  },
  async mounted() {
    await this.loadProducts();
    this.startScanner();
  },
  beforeUnmount() {
    this.stopScanner();
  },
  methods: {
    async loadProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        this.products = response.data;
      } catch (error) {
        this.error = 'Failed to load products';
      }
    },
    startScanner() {
      this.html5QrCode = new Html5Qrcode("qr-reader");
      this.html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        this.onScanSuccess,
        this.onScanError
      ).catch(err => {
        console.error("Scanner start error:", err);
      });
    },
    stopScanner() {
      if (this.html5QrCode) {
        this.html5QrCode.stop().catch(err => console.error("Scanner stop error:", err));
      }
    },
    async onScanSuccess(decodedText) {
      this.stopScanner();
      await this.loadUser(decodedText);
    },
    onScanError(error) {
      // Ignore scan errors
    },
    async scanManualQR() {
      if (!this.manualQR) return;
      await this.loadUser(this.manualQR);
    },
    async loadUser(qrCode) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/user-by-qr/${qrCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.scannedUser = response.data;
        await this.loadUserStamps();
        this.error = '';
      } catch (error) {
        this.error = 'User not found';
      }
    },
    async loadUserStamps() {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/user-stamps/${this.scannedUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.userStamps = response.data;
      } catch (error) {
        console.error('Failed to load stamps:', error);
      }
    },
    getUserStamps(productId) {
      return this.userStamps.find(s => s.product_id === productId);
    },
    canUseFree(productId) {
      const stamps = this.getUserStamps(productId);
      if (!stamps) return false;
      return stamps.free_products_earned > stamps.free_products_used;
    },
    addProduct(product) {
      const existing = this.selectedProducts.find(item => item.product.id === product.id && !item.isFree);
      if (existing) {
        existing.quantity++;
      } else {
        this.selectedProducts.push({
          product,
          quantity: 1,
          isFree: false
        });
      }
    },
    removeProduct(index) {
      this.selectedProducts.splice(index, 1);
    },
    increaseQuantity(index) {
      this.selectedProducts[index].quantity++;
    },
    decreaseQuantity(index) {
      if (this.selectedProducts[index].quantity > 1) {
        this.selectedProducts[index].quantity--;
      } else {
        this.removeProduct(index);
      }
    },
    async submitVisit() {
      if (this.selectedProducts.length === 0) {
        this.error = 'Please add at least one product';
        return;
      }

      this.submitting = true;
      this.error = '';
      this.success = '';

      try {
        const token = localStorage.getItem('adminToken');
        const products = this.selectedProducts.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          isFree: item.isFree,
          price: item.product.price
        }));

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/visits`,
          {
            userId: this.scannedUser.id,
            products,
            notes: this.notes
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.success = 'Visit recorded successfully!';
        setTimeout(() => {
          this.resetScan();
        }, 2000);
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to record visit';
      } finally {
        this.submitting = false;
      }
    },
    resetScan() {
      this.scannedUser = null;
      this.userStamps = [];
      this.selectedProducts = [];
      this.notes = '';
      this.manualQR = '';
      this.error = '';
      this.success = '';
      this.selectedCategory = 'all';
      this.$nextTick(() => {
        this.startScanner();
      });
    }
  }
};
</script>

<style scoped>
.scan-section {
  text-align: center;
}

.qr-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
}

.customer-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.category-tabs {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.category-tab {
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.3s;
}

.category-tab.active {
  background: linear-gradient(45deg, #D32F2F, #C62828);
  color: white;
  border-color: #D32F2F;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.product-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.product-card:hover {
  background: #fff;
  border-color: #D32F2F;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.2);
}

.product-name {
  font-weight: 600;
  margin-bottom: 5px;
}

.product-price {
  color: #D32F2F;
  font-size: 18px;
  font-weight: bold;
}

.product-stamps {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.selected-products {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  margin-bottom: 10px;
}

.selected-item > span:first-child {
  flex: 1;
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border: none;
  background: #D32F2F;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
}

.free-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
}

.item-total {
  font-weight: bold;
  color: #D32F2F;
  min-width: 60px;
  text-align: right;
}

.btn-remove {
  width: 30px;
  height: 30px;
  border: none;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.total-section {
  text-align: right;
  font-size: 24px;
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
}
</style>
