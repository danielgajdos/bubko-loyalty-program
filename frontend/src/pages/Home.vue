<template>
  <div class="home">
    <div class="kebab-banner">
      <h1 class="title">🥙 Kebab na Kyjevskom</h1>
      <p class="subtitle">Vernostný program</p>
    </div>
    
    <div class="container">
      <div class="hero text-center">
        <p class="tagline">Chutné jedlo, skvelé odmeny! 🌟</p>
        
        <div class="card hero-card">
          <h2 style="color: #333; margin-bottom: 20px;">Ako to funguje?</h2>
          <p style="color: #666; margin-bottom: 30px; font-size: 18px;">
            Kúp 10 produktov, 11. dostaneš zadarmo! 🎁
          </p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">📱</div>
              <h3>Tvoj QR kód</h3>
              <p>Každý zákazník dostane svoj jedinečný QR kód</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🎁</div>
              <h3>Zbieraj pečiatky</h3>
              <p>Za každý produkt získaš pečiatku - 10 pečiatok = 1 produkt zadarmo</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🥙</div>
              <h3>Osobné sledovanie</h3>
              <p>Každý produkt má vlastné pečiatky - Kebab, Pizza, Burger...</p>
            </div>
          </div>
          
          <div class="cta-buttons">
            <router-link to="/register" class="btn btn-primary">
              🚀 Zaregistruj sa
            </router-link>
            <router-link to="/login" class="btn btn-secondary">
              👤 Prihlásenie
            </router-link>
          </div>
          
          <div class="admin-link mt-20">
            <router-link to="/admin" style="color: #666; text-decoration: none;">
              🔐 Admin prístup
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
}

.kebab-banner {
  width: 100%;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #B71C1C 0%, #C62828 25%, #D32F2F 50%, #E64A19 75%, #FF6F00 100%);
  padding: 40px 20px;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.kebab-banner .title {
  margin-bottom: 10px;
}

.kebab-banner .subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.container {
  padding-top: 0;
}



.hero-card {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.tagline {
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.feature {
  text-align: center;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
  animation: bounce 2s ease-in-out infinite;
}

.feature:nth-child(1) .feature-icon { animation-delay: 0s; }
.feature:nth-child(2) .feature-icon { animation-delay: 0.5s; }
.feature:nth-child(3) .feature-icon { animation-delay: 1s; }

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.feature h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.feature p {
  color: #666;
  font-size: 14px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-buttons .btn {
  min-width: 180px;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
}

.cta-buttons .btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.cta-buttons .btn:hover::before {
  left: 100%;
}

.admin-link {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .bubko-banner {
    padding: 15px;
  }
  
  .banner-image {
    max-height: 250px;
  }
  
}
</style>