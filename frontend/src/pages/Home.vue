<template>
  <div class="home">
    <div class="space-banner">
      <div class="astronaut astronaut-left">👨‍🚀</div>
      <div class="astronaut astronaut-right">👩‍🚀</div>
      <div class="planet planet-1">🌙</div>
      <div class="planet planet-2">🪐</div>
      <div class="constellation constellation-1"></div>
      <div class="constellation constellation-2"></div>
      <div class="clouds"></div>
      
      <div class="banner-content">
        <h1 class="banner-title">BUBKO</h1>
        <p class="banner-subtitle">DETSKÁ HERNIČKA</p>
        <div class="social-info">
          <div class="social-icons">
            <span class="social-icon">📘</span>
            <span class="social-icon">📷</span>
          </div>
          <p class="social-handle">bubko.detskahernička</p>
        </div>
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

.space-banner {
  height: 60vh;
  background: linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #5c6bc0 75%, #7986cb 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.space-banner::before {
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
    radial-gradient(2px 2px at 160px 30px, #fff, transparent),
    radial-gradient(1px 1px at 200px 60px, #fff, transparent),
    radial-gradient(2px 2px at 250px 20px, rgba(255,255,255,0.7), transparent);
  background-repeat: repeat;
  background-size: 300px 150px;
  animation: twinkle 3s ease-in-out infinite alternate;
  pointer-events: none;
}

.astronaut {
  position: absolute;
  font-size: 4rem;
  animation: float 6s ease-in-out infinite;
}

.astronaut-left {
  left: 10%;
  top: 20%;
  animation-delay: 0s;
}

.astronaut-right {
  right: 10%;
  bottom: 20%;
  animation-delay: 2s;
}

.planet {
  position: absolute;
  font-size: 3rem;
  animation: rotate 20s linear infinite;
}

.planet-1 {
  top: 15%;
  right: 25%;
  animation-delay: 0s;
}

.planet-2 {
  bottom: 15%;
  left: 20%;
  animation-delay: 10s;
}

.constellation {
  position: absolute;
  width: 100px;
  height: 100px;
}

.constellation::before,
.constellation::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 
    10px 10px 0 white,
    20px 5px 0 white,
    30px 15px 0 white,
    15px 25px 0 white;
}

.constellation-1 {
  top: 10%;
  left: 30%;
  animation: twinkle 4s ease-in-out infinite;
}

.constellation-2 {
  bottom: 10%;
  right: 35%;
  animation: twinkle 4s ease-in-out infinite reverse;
  animation-delay: 2s;
}

.clouds {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 100%);
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
}

.banner-content {
  text-align: center;
  z-index: 10;
  position: relative;
}

.banner-title {
  font-family: 'Fredoka One', cursive;
  font-size: 5rem;
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
  font-size: 2rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
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
  font-size: 2rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.social-handle {
  color: #fff;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(10deg); }
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
  
  .banner-title {
    font-size: 3.5rem;
  }
  
  .banner-subtitle {
    font-size: 1.5rem;
  }
  
  .astronaut {
    font-size: 3rem;
  }
  
  .planet {
    font-size: 2rem;
  }
  
  .space-banner {
    height: 50vh;
  }
}
</style>