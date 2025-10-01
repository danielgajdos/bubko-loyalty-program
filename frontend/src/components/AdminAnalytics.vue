<template>
  <div class="admin-analytics">
    <div class="analytics-grid">
      <!-- Visit Trends -->
      <div class="card analytics-card">
        <h4><i class="fas fa-chart-line"></i> Trendy návštev</h4>
        <div class="trend-stats">
          <div class="trend-item">
            <span class="trend-label">Dnes</span>
            <span class="trend-value">{{ stats.todayVisits }}</span>
            <span class="trend-change" :class="getTrendClass(todayTrend)">
              <i :class="getTrendIcon(todayTrend)"></i>
              {{ Math.abs(todayTrend) }}%
            </span>
          </div>
          <div class="trend-item">
            <span class="trend-label">Tento týždeň</span>
            <span class="trend-value">{{ weekVisits }}</span>
            <span class="trend-change" :class="getTrendClass(weekTrend)">
              <i :class="getTrendIcon(weekTrend)"></i>
              {{ Math.abs(weekTrend) }}%
            </span>
          </div>
          <div class="trend-item">
            <span class="trend-label">Tento mesiac</span>
            <span class="trend-value">{{ stats.monthVisits }}</span>
            <span class="trend-change" :class="getTrendClass(monthTrend)">
              <i :class="getTrendIcon(monthTrend)"></i>
              {{ Math.abs(monthTrend) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- User Growth -->
      <div class="card analytics-card">
        <h4><i class="fas fa-users"></i> Rast používateľov</h4>
        <div class="growth-stats">
          <div class="growth-item">
            <span class="growth-number">{{ stats.totalUsers }}</span>
            <span class="growth-label">Celkovo registrovaných</span>
          </div>
          <div class="growth-item">
            <span class="growth-number">{{ newUsersThisMonth }}</span>
            <span class="growth-label">Nových tento mesiac</span>
          </div>
          <div class="growth-item">
            <span class="growth-number">{{ activeUsersThisMonth }}</span>
            <span class="growth-label">Aktívnych tento mesiac</span>
          </div>
        </div>
      </div>

      <!-- Visit Types -->
      <div class="card analytics-card">
        <h4><i class="fas fa-chart-pie"></i> Typy návštev</h4>
        <div class="visit-types">
          <div class="visit-type-item">
            <div class="visit-type-bar">
              <div 
                class="visit-type-fill paid" 
                :style="{ width: paidVisitPercentage + '%' }"
              ></div>
            </div>
            <div class="visit-type-info">
              <span class="visit-type-label">Platené návštevy</span>
              <span class="visit-type-count">{{ paidVisits }} ({{ paidVisitPercentage }}%)</span>
            </div>
          </div>
          <div class="visit-type-item">
            <div class="visit-type-bar">
              <div 
                class="visit-type-fill free" 
                :style="{ width: freeVisitPercentage + '%' }"
              ></div>
            </div>
            <div class="visit-type-info">
              <span class="visit-type-label">Voľné návštevy</span>
              <span class="visit-type-count">{{ freeVisits }} ({{ freeVisitPercentage }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Peak Hours -->
      <div class="card analytics-card">
        <h4><i class="fas fa-clock"></i> Najrušnejšie hodiny</h4>
        <div class="peak-hours">
          <div v-for="hour in peakHours" :key="hour.hour" class="hour-item">
            <span class="hour-time">{{ hour.hour }}:00</span>
            <div class="hour-bar">
              <div 
                class="hour-fill" 
                :style="{ width: (hour.visits / maxHourVisits * 100) + '%' }"
              ></div>
            </div>
            <span class="hour-count">{{ hour.visits }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAnalytics',
  props: {
    stats: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Mock data for demonstration - in real app, this would come from API
    weekVisits() {
      return Math.floor(this.stats.todayVisits * 7 * 0.8)
    },
    newUsersThisMonth() {
      return Math.floor(this.stats.totalUsers * 0.15)
    },
    activeUsersThisMonth() {
      return Math.floor(this.stats.totalUsers * 0.6)
    },
    paidVisits() {
      return Math.floor(this.stats.monthVisits * 0.75)
    },
    freeVisits() {
      return Math.floor(this.stats.monthVisits * 0.25)
    },
    paidVisitPercentage() {
      const total = this.paidVisits + this.freeVisits
      return total > 0 ? Math.round((this.paidVisits / total) * 100) : 0
    },
    freeVisitPercentage() {
      const total = this.paidVisits + this.freeVisits
      return total > 0 ? Math.round((this.freeVisits / total) * 100) : 0
    },
    todayTrend() {
      // Mock trend calculation
      return Math.floor(Math.random() * 20) - 10
    },
    weekTrend() {
      return Math.floor(Math.random() * 30) - 15
    },
    monthTrend() {
      return Math.floor(Math.random() * 25) - 5
    },
    peakHours() {
      // Mock peak hours data
      const hours = []
      for (let i = 9; i <= 20; i++) {
        hours.push({
          hour: i,
          visits: Math.floor(Math.random() * 15) + 1
        })
      }
      return hours.sort((a, b) => b.visits - a.visits).slice(0, 6)
    },
    maxHourVisits() {
      return Math.max(...this.peakHours.map(h => h.visits))
    }
  },
  methods: {
    getTrendClass(trend) {
      return trend >= 0 ? 'trend-up' : 'trend-down'
    },
    getTrendIcon(trend) {
      return trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
    }
  }
}
</script>

<style scoped>
.admin-analytics {
  margin-top: 30px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.analytics-card {
  padding: 25px;
}

.analytics-card h4 {
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.analytics-card h4 i {
  color: #667eea;
}

/* Trend Stats */
.trend-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.trend-item:last-child {
  border-bottom: none;
}

.trend-label {
  color: #666;
  font-weight: 500;
}

.trend-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.trend-change {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
}

.trend-up {
  background: #d4edda;
  color: #155724;
}

.trend-down {
  background: #f8d7da;
  color: #721c24;
}

/* Growth Stats */
.growth-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.growth-item {
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 10px;
}

.growth-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.growth-label {
  color: #666;
  font-size: 0.9rem;
}

/* Visit Types */
.visit-types {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.visit-type-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.visit-type-bar {
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.visit-type-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.visit-type-fill.paid {
  background: linear-gradient(45deg, #45b7d1, #4ecdc4);
}

.visit-type-fill.free {
  background: linear-gradient(45deg, #96ceb4, #feca57);
}

.visit-type-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.visit-type-label {
  color: #333;
  font-weight: 500;
}

.visit-type-count {
  color: #666;
  font-size: 0.9rem;
}

/* Peak Hours */
.peak-hours {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hour-item {
  display: grid;
  grid-template-columns: 60px 1fr 40px;
  align-items: center;
  gap: 15px;
}

.hour-time {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.hour-bar {
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.hour-fill {
  height: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.hour-count {
  color: #666;
  font-size: 0.9rem;
  text-align: right;
}

@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-card {
    padding: 20px;
  }
  
  .trend-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .hour-item {
    grid-template-columns: 50px 1fr 30px;
    gap: 10px;
  }
}
</style>