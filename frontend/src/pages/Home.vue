<template>
  <div class="home">
    <div class="bubko-banner">
      <div class="banner-content">
        <h1 class="banner-title">🚀 BUBKO</h1>
        <p class="banner-subtitle">DETSKÁ HERNIČKA</p>
        <div class="social-info">
          <div class="social-icons">
            <span class="social-icon">📘</span>
            <span class="social-icon">📷</span>
          </div>
          <p class="social-handle">bubko.detskahernička</p>
        </div>
      </div>
      <div class="space-elements">
        <div class="astronaut">👨‍🚀</div>
        <div class="astronaut astronaut-2">👩‍🚀</div>
        <div class="planet">🌙</div>
        <div class="planet planet-2">🪐</div>
      </div>
    </div>
    
    <div class="container">
      <div class="hero text-center">
        <p class="space-tagline">Vesmírne dobrodružstvo plné zábavy! 🌟</p>
        
        <div class="card hero-card">
          <h2 style="color: #333; margin-bottom: 20px;">Vernostný program</h2>
          <p style="color: #666; margin-bottom: 30px; font-size: 18px;">
            Zbieraj návštevy a získaj každú 6. návštevu zadarmo! 🎁
          </p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">🛸</div>
              <h3>Vesmírny QR kód</h3>
              <p>Každý astronaut dostane svoj jedinečný QR kód</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🎁</div>
              <h3>Kozmické odmeny</h3>
              <p>Po 5 misiách je 6. misia zadarmo</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🌟</div>
              <h3>Sledovanie misií</h3>
              <p>Sleduj svoj pokrok vo vesmírnom profile</p>
            </div>
          </div>
          
          <div class="cta-buttons">
            <router-link to="/register" class="btn btn-primary">
              🚀 Pripoj sa k misii
            </router-link>
            <router-link to="/login" class="btn btn-secondary">
              👨‍🚀 Prihlásenie astronauta
            </router-link>
          </div>
          
          <div class="admin-link mt-20">
            <router-link to="/admin" style="color: #666; text-decoration: none;">
              🛰️ Riadiace centrum
            </router-link>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #999;">
              API: {{ apiUrl }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    apiUrl() {
      return import.meta.env.VITE_API_URL || '/api'
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
}

.bubko-banner {
  width: 100%;
  height: 400px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #5c6bc0 75%, #7986cb 100%);
  border-radius: 0 0 30px 30px;
  position: relative;
  overflow: hidden;
}

.bubko-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #fff, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #fff, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: twinkle 3s ease-in-out infinite alternate;
  pointer-events: none;
}

.banner-content {
  text-align: center;
  z-index: 10;
  position: relative;
}

.banner-title {
  font-family: 'Fredoka One', cursive;
  font-size: 4rem;
  color: #fff;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(121, 134, 203, 1),
    4px 4px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  letter-spacing: 0.1em;
  animation: glow 3s ease-in-out infinite alternate;
}

.banner-subtitle {
  font-family: 'Fredoka One', cursive;
  font-size: 1.8rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  letter-spacing: 0.05em;
}

.social-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  font-size: 1.5rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.social-handle {
  color: #fff;
  font-size: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.space-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.astronaut {
  position: absolute;
  font-size: 3rem;
  animation: float 6s ease-in-out infinite;
}

.astronaut:first-child {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.astronaut-2 {
  bottom: 20%;
  right: 10%;
  animation-delay: 3s;
}

.planet {
  position: absolute;
  font-size: 2.5rem;
  animation: rotate 20s linear infinite;
}

.planet:first-of-type {
  top: 15%;
  right: 20%;
  animation-delay: 0s;
}

.planet-2 {
  bottom: 15%;
  left: 15%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

@keyframes glow {
  from {
    text-shadow: 
      0 0 20px rgba(255, 255, 255, 0.8),
      0 0 40px rgba(121, 134, 203, 1),
      4px 4px 8px rgba(0, 0, 0, 0.5);
  }
  to {
    text-shadow: 
      0 0 30px rgba(255, 255, 255, 1),
      0 0 60px rgba(121, 134, 203, 1),
      4px 4px 8px rgba(0, 0, 0, 0.5);
  }
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

.space-tagline {
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
    height: 300px;
  }
  
  .banner-title {
    font-size: 2.5rem;
  }
  
  .banner-subtitle {
    font-size: 1.2rem;
  }
  
  .astronaut {
    font-size: 2rem;
  }
  
  .planet {
    font-size: 1.8rem;
  }
}
</style>