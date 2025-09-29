<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Open Sans', sans-serif;
  background: linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #5c6bc0 75%, #7986cb 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
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
  z-index: 1;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

#app {
  min-height: 100vh;
  position: relative;
  z-index: 2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #7986cb, #5c6bc0, #3949ab, #283593);
  border-radius: 25px;
  z-index: -1;
  opacity: 0.1;
}

.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(45deg, #7986cb, #5c6bc0);
  color: white;
  box-shadow: 0 8px 25px rgba(121, 134, 203, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(121, 134, 203, 0.6);
  background: linear-gradient(45deg, #8e99f3, #6d7ce0);
}

.btn-secondary {
  background: linear-gradient(45deg, #3949ab, #283593);
  color: white;
  box-shadow: 0 8px 25px rgba(57, 73, 171, 0.4);
}

.btn-secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(57, 73, 171, 0.6);
}

.btn-success {
  background: linear-gradient(45deg, #66bb6a, #4caf50);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 187, 106, 0.4);
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
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #7986cb;
  box-shadow: 0 0 15px rgba(121, 134, 203, 0.3);
}

.title {
  font-family: 'Fredoka One', cursive;
  font-size: 3rem;
  color: #fff;
  text-shadow: 
    0 0 10px rgba(255, 255, 255, 0.5),
    0 0 20px rgba(121, 134, 203, 0.8),
    2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 
      0 0 10px rgba(255, 255, 255, 0.5),
      0 0 20px rgba(121, 134, 203, 0.8),
      2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  to {
    text-shadow: 
      0 0 15px rgba(255, 255, 255, 0.8),
      0 0 30px rgba(121, 134, 203, 1),
      2px 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.subtitle {
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 30px;
}

.text-center {
  text-align: center;
}

.mt-20 {
  margin-top: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.error {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.success {
  color: #96ceb4;
  background: rgba(150, 206, 180, 0.1);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>