<template>
  <div class="user-management">
    <div class="container">
      <div class="header">
        <h1 class="title">👥 Správa používateľov</h1>
        <div class="header-actions">
          <button @click="exportUsers" class="btn btn-success">
            <i class="fas fa-download"></i> Export CSV
          </button>
          <button @click="showQuickRegister = true" class="btn btn-primary">
            <i class="fas fa-user-plus"></i> Rýchla registrácia
          </button>
          <router-link to="/admin/dashboard" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Späť na dashboard
          </router-link>
        </div>
      </div>

      <!-- Quick Register Modal -->
      <div v-if="showQuickRegister" class="modal-overlay" @click="closeQuickRegister">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>⚡ Rýchla registrácia</h3>
            <button @click="closeQuickRegister" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleQuickRegister">
              <div class="form-group">
                <label>Meno *</label>
                <input 
                  v-model="quickRegForm.firstName" 
                  type="text" 
                  required 
                  placeholder="Zadajte meno"
                >
              </div>
              <div class="form-group">
                <label>Priezvisko *</label>
                <input 
                  v-model="quickRegForm.lastName" 
                  type="text" 
                  required 
                  placeholder="Zadajte priezvisko"
                >
              </div>
              <div class="form-group">
                <label>QR kód *</label>
                <div class="qr-input-group">
                  <input 
                    v-model="quickRegForm.qrCode" 
                    type="text" 
                    required 
                    placeholder="Naskenujte alebo zadajte QR kód"
                  >
                  <button type="button" @click="showQRScanner = 'register'" class="scan-btn">
                    <i class="fas fa-qrcode"></i> Skenovať
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label>Telefón</label>
                <input 
                  v-model="quickRegForm.phone" 
                  type="tel" 
                  placeholder="+421..."
                >
              </div>
              <div class="form-group">
                <label>Email</label>
                <input 
                  v-model="quickRegForm.email" 
                  type="email" 
                  placeholder="email@example.com (voliteľné)"
                >
              </div>
              <div class="modal-actions">
                <button type="button" @click="closeQuickRegister" class="btn btn-secondary">
                  Zrušiť
                </button>
                <button type="submit" class="btn btn-primary" :disabled="quickRegLoading">
                  <i class="fas fa-user-plus"></i>
                  {{ quickRegLoading ? 'Registrujem...' : 'Registrovať' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit User Modal -->
      <div v-if="editingUser" class="modal-overlay" @click="closeEditUser">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>✏️ Upraviť používateľa</h3>
            <button @click="closeEditUser" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleUpdateUser">
              <div class="form-group">
                <label>Celkový počet návštev</label>
                <input 
                  v-model.number="editForm.totalVisits" 
                  type="number" 
                  min="0"
                >
              </div>
              <div class="form-group">
                <label>Získané voľné návštevy</label>
                <input 
                  v-model.number="editForm.freeVisitsEarned" 
                  type="number" 
                  min="0"
                >
              </div>
              <div class="form-group">
                <label>Použité voľné návštevy</label>
                <input 
                  v-model.number="editForm.freeVisitsUsed" 
                  type="number" 
                  min="0"
                >
              </div>
              <div class="modal-actions">
                <button type="button" @click="closeEditUser" class="btn btn-secondary">
                  Zrušiť
                </button>
                <button type="submit" class="btn btn-primary" :disabled="updateLoading">
                  <i class="fas fa-save"></i>
                  {{ updateLoading ? 'Ukladám...' : 'Uložiť' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- QR Code Assignment Modal -->
      <div v-if="assigningQR" class="modal-overlay" @click="closeAssignQR">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>🔖 Priradiť QR kód</h3>
            <button @click="closeAssignQR" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p>Priraďujete nový QR kód pre: <strong>{{ assigningUser?.first_name }} {{ assigningUser?.last_name }}</strong></p>
            <form @submit.prevent="handleAssignQR">
              <div class="form-group">
                <label>Nový QR kód *</label>
                <div class="qr-input-group">
                  <input 
                    v-model="assignQRForm.qrCode" 
                    type="text" 
                    required 
                    placeholder="Naskenujte alebo zadajte nový QR kód"
                  >
                  <button type="button" @click="showQRScanner = 'assign'" class="scan-btn">
                    <i class="fas fa-qrcode"></i> Skenovať
                  </button>
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" @click="closeAssignQR" class="btn btn-secondary">
                  Zrušiť
                </button>
                <button type="submit" class="btn btn-primary" :disabled="assignLoading">
                  <i class="fas fa-qrcode"></i>
                  {{ assignLoading ? 'Priraďujem...' : 'Priradiť' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card">
        <div class="card-header">
          <h3>📋 Zoznam používateľov</h3>
          <div class="search-and-actions">
            <div class="search-box">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Hľadať používateľa..."
                class="search-input"
              >
            </div>
            <div v-if="selectedUsers.length > 0" class="bulk-actions">
              <span class="selected-count">{{ selectedUsers.length }} vybraných</span>
              <button @click="bulkDelete" class="btn btn-danger btn-sm">
                <i class="fas fa-trash"></i> Zmazať vybrané
              </button>
              <button @click="clearSelection" class="btn btn-secondary btn-sm">
                Zrušiť výber
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading">
          <p>Načítavam používateľov...</p>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="no-users">
          <p>Žiadni používatelia nenájdení</p>
        </div>

        <div v-else class="table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    @change="toggleSelectAll"
                    :checked="allSelected"
                    :indeterminate="someSelected"
                  >
                </th>
                <th>Meno</th>
                <th>Email</th>
                <th>Telefón</th>
                <th>Návštevy</th>
                <th>Voľné návštevy</th>
                <th>QR kód</th>
                <th>Registrácia</th>
                <th>Akcie</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
                <td class="user-select">
                  <input 
                    type="checkbox" 
                    :value="user.id"
                    v-model="selectedUsers"
                  >
                </td>
                <td class="user-name">
                  <div class="name-info">
                    <strong>{{ user.first_name }} {{ user.last_name }}</strong>
                  </div>
                </td>
                <td class="user-email">{{ user.email }}</td>
                <td class="user-phone">{{ user.phone || '-' }}</td>
                <td class="visits-info">
                  <div class="visit-stats">
                    <span class="total-visits">{{ user.total_visits }}</span>
                  </div>
                </td>
                <td class="free-visits-info">
                  <div class="free-visit-stats">
                    <span class="earned">{{ user.free_visits_earned }}</span> /
                    <span class="used">{{ user.free_visits_used }}</span> /
                    <span class="available">{{ user.available_free_visits }}</span>
                  </div>
                  <div class="free-visit-labels">
                    <small>získané / použité / dostupné</small>
                  </div>
                </td>
                <td class="qr-code">
                  <code class="qr-display">{{ user.qr_code.substring(0, 8) }}...</code>
                </td>
                <td class="created-date">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="actions">
                  <div class="action-buttons">
                    <button 
                      @click="startEditUser(user)" 
                      class="btn-icon btn-edit"
                      title="Upraviť návštevy"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="startAssignQR(user)" 
                      class="btn-icon btn-qr"
                      title="Priradiť QR kód"
                    >
                      <i class="fas fa-qrcode"></i>
                    </button>
                    <button 
                      @click="confirmDeleteUser(user)" 
                      class="btn-icon btn-delete"
                      title="Zmazať používateľa"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- QR Scanner Modal -->
      <div v-if="showQRScanner" class="modal-overlay" @click="closeQRScanner">
        <QRScanner 
          @close="closeQRScanner" 
          @scan="handleQRScan"
          @click.stop
        />
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api'
import QRScanner from '../components/QRScanner.vue'

export default {
  name: 'UserManagement',
  components: {
    QRScanner
  },
  data() {
    return {
      users: [],
      loading: true,
      searchQuery: '',
      message: '',
      messageType: 'success',
      
      // Quick Registration
      showQuickRegister: false,
      quickRegLoading: false,
      quickRegForm: {
        firstName: '',
        lastName: '',
        qrCode: '',
        phone: '',
        email: ''
      },
      
      // Edit User
      editingUser: null,
      updateLoading: false,
      editForm: {
        totalVisits: 0,
        freeVisitsEarned: 0,
        freeVisitsUsed: 0
      },
      
      // QR Assignment
      assigningQR: false,
      assigningUser: null,
      assignLoading: false,
      assignQRForm: {
        qrCode: ''
      },
      
      // QR Scanner
      showQRScanner: null, // 'register' or 'assign'
      
      // Bulk actions
      selectedUsers: []
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users
      
      const query = this.searchQuery.toLowerCase()
      return this.users.filter(user => 
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.qr_code.toLowerCase().includes(query)
      )
    },
    allSelected() {
      return this.filteredUsers.length > 0 && this.selectedUsers.length === this.filteredUsers.length
    },
    someSelected() {
      return this.selectedUsers.length > 0 && this.selectedUsers.length < this.filteredUsers.length
    }
  },
  async mounted() {
    await this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        this.loading = true
        const response = await api.getAllUsers()
        this.users = response.data.users
      } catch (error) {
        console.error('Failed to load users:', error)
        this.showMessage('Chyba pri načítaní používateľov', 'error')
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.$router.push('/admin')
        }
      } finally {
        this.loading = false
      }
    },
    
    // Quick Registration
    async handleQuickRegister() {
      try {
        this.quickRegLoading = true
        await api.quickRegister(this.quickRegForm)
        this.showMessage('Používateľ úspešne registrovaný!', 'success')
        this.closeQuickRegister()
        await this.loadUsers()
      } catch (error) {
        console.error('Quick registration failed:', error)
        this.showMessage(error.response?.data?.error || 'Chyba pri registrácii', 'error')
      } finally {
        this.quickRegLoading = false
      }
    },
    
    closeQuickRegister() {
      this.showQuickRegister = false
      this.quickRegForm = {
        firstName: '',
        lastName: '',
        qrCode: '',
        phone: '',
        email: ''
      }
    },
    
    // Edit User
    startEditUser(user) {
      this.editingUser = user
      this.editForm = {
        totalVisits: user.total_visits,
        freeVisitsEarned: user.free_visits_earned,
        freeVisitsUsed: user.free_visits_used
      }
    },
    
    async handleUpdateUser() {
      try {
        this.updateLoading = true
        await api.updateUser(this.editingUser.id, this.editForm)
        this.showMessage('Používateľ úspešne aktualizovaný!', 'success')
        this.closeEditUser()
        await this.loadUsers()
      } catch (error) {
        console.error('Update user failed:', error)
        this.showMessage(error.response?.data?.error || 'Chyba pri aktualizácii', 'error')
      } finally {
        this.updateLoading = false
      }
    },
    
    closeEditUser() {
      this.editingUser = null
      this.editForm = {
        totalVisits: 0,
        freeVisitsEarned: 0,
        freeVisitsUsed: 0
      }
    },
    
    // QR Assignment
    startAssignQR(user) {
      this.assigningQR = true
      this.assigningUser = user
      this.assignQRForm.qrCode = ''
    },
    
    async handleAssignQR() {
      try {
        this.assignLoading = true
        await api.assignQRCode(this.assigningUser.id, this.assignQRForm.qrCode)
        this.showMessage('QR kód úspešne priradený!', 'success')
        this.closeAssignQR()
        await this.loadUsers()
      } catch (error) {
        console.error('Assign QR failed:', error)
        this.showMessage(error.response?.data?.error || 'Chyba pri priraďovaní QR kódu', 'error')
      } finally {
        this.assignLoading = false
      }
    },
    
    closeAssignQR() {
      this.assigningQR = false
      this.assigningUser = null
      this.assignQRForm.qrCode = ''
    },
    
    // Delete User
    async confirmDeleteUser(user) {
      if (confirm(`Naozaj chcete zmazať používateľa ${user.first_name} ${user.last_name}?`)) {
        try {
          await api.deleteUser(user.id)
          this.showMessage('Používateľ úspešne zmazaný!', 'success')
          await this.loadUsers()
        } catch (error) {
          console.error('Delete user failed:', error)
          this.showMessage(error.response?.data?.error || 'Chyba pri mazaní používateľa', 'error')
        }
      }
    },
    
    // QR Scanner
    handleQRScan(qrCode) {
      if (this.showQRScanner === 'register') {
        this.quickRegForm.qrCode = qrCode
      } else if (this.showQRScanner === 'assign') {
        this.assignQRForm.qrCode = qrCode
      }
      this.closeQRScanner()
    },
    
    closeQRScanner() {
      this.showQRScanner = null
    },
    
    // Bulk actions
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedUsers = []
      } else {
        this.selectedUsers = this.filteredUsers.map(user => user.id)
      }
    },
    
    clearSelection() {
      this.selectedUsers = []
    },
    
    async bulkDelete() {
      if (this.selectedUsers.length === 0) return
      
      const confirmed = confirm(`Naozaj chcete zmazať ${this.selectedUsers.length} používateľov?`)
      if (!confirmed) return
      
      try {
        // Delete users one by one (in real app, you'd want a bulk delete endpoint)
        for (const userId of this.selectedUsers) {
          await api.deleteUser(userId)
        }
        
        this.showMessage(`${this.selectedUsers.length} používateľov úspešne zmazaných!`, 'success')
        this.selectedUsers = []
        await this.loadUsers()
      } catch (error) {
        console.error('Bulk delete error:', error)
        this.showMessage('Chyba pri mazaní používateľov', 'error')
      }
    },
    
    // Export functionality
    exportUsers() {
      try {
        // Create CSV content
        const headers = [
          'ID',
          'Meno',
          'Priezvisko', 
          'Email',
          'Telefón',
          'QR Kód',
          'Celkové návštevy',
          'Získané voľné návštevy',
          'Použité voľné návštevy',
          'Dostupné voľné návštevy',
          'Dátum registrácie'
        ]
        
        const csvContent = [
          headers.join(','),
          ...this.users.map(user => [
            user.id,
            `"${user.first_name}"`,
            `"${user.last_name}"`,
            `"${user.email}"`,
            `"${user.phone || ''}"`,
            `"${user.qr_code}"`,
            user.total_visits,
            user.free_visits_earned,
            user.free_visits_used,
            user.available_free_visits,
            `"${this.formatDate(user.created_at)}"`
          ].join(','))
        ].join('\n')
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `bubko-users-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        this.showMessage('Export úspešne stiahnutý!', 'success')
      } catch (error) {
        console.error('Export error:', error)
        this.showMessage('Chyba pri exporte dát', 'error')
      }
    },
    
    // Utilities
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('sk-SK')
    },
    
    showMessage(text, type = 'success') {
      this.message = text
      this.messageType = type
      setTimeout(() => {
        this.message = ''
      }, 5000)
    }
  }
}
</script>

<style scoped>
.user-management {
  min-height: 100vh;
  padding: 40px 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px 30px;
}

.search-and-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.selected-count {
  color: white;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-danger {
  background: linear-gradient(45deg, #dc3545, #c82333);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
}

.search-input {
  padding: 10px 15px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  placeholder-color: rgba(255, 255, 255, 0.7);
  min-width: 250px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

.users-table th:first-child {
  width: 50px;
  text-align: center;
}

.user-select {
  text-align: center;
  width: 50px;
}

.users-table td {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
}

.user-row:hover {
  background-color: #f8f9fa;
}

.user-name strong {
  color: #333;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
}

.visit-stats {
  font-weight: 600;
  color: #333;
}

.free-visit-stats {
  font-weight: 600;
}

.free-visit-stats .earned {
  color: #28a745;
}

.free-visit-stats .used {
  color: #dc3545;
}

.free-visit-stats .available {
  color: #007bff;
}

.free-visit-labels {
  font-size: 0.75rem;
  color: #666;
  margin-top: 2px;
}

.qr-display {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.8rem;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #ffc107;
  color: white;
}

.btn-edit:hover {
  background: #e0a800;
  transform: scale(1.1);
}

.btn-qr {
  background: #17a2b8;
  color: white;
}

.btn-qr:hover {
  background: #138496;
  transform: scale(1.1);
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
  transform: scale(1.1);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.modal-body {
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

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.qr-input-group {
  display: flex;
  gap: 10px;
}

.qr-input-group input {
  flex: 1;
}

.scan-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.scan-btn:hover {
  background: #138496;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.loading, .no-users {
  text-align: center;
  padding: 60px;
  color: #666;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #28a745;
}

.message.error {
  background: #dc3545;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
  }
  
  .search-input {
    min-width: 200px;
  }
  
  .users-table {
    font-size: 0.9rem;
  }
  
  .users-table th,
  .users-table td {
    padding: 10px 8px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .modal {
    width: 95%;
    margin: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
}
</style>