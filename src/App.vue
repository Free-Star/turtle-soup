<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <el-container class="app-container">
    <el-header height="64px">
      <nav class="nav-header">
        <router-link to="/" class="logo">
          <img src="/turtle.svg" alt="海龟汤" class="logo-img">
          <span class="logo-text">妙妙海龟汤</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">
            <el-icon><House /></el-icon>
            首页
          </router-link>
          <router-link to="/rules" class="nav-link">
            <el-icon><Document /></el-icon>
            规则
          </router-link>
        </div>
      </nav>
    </el-header>
    
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
    
    <el-footer height="60px">
      <div class="footer-content">
        <p>© 2024 妙妙海龟汤 - 让思维更有趣</p>
        <p>© author FreeStar</p>
        <div class="social-links">
          <a href="https://github.com/yourusername" target="_blank" class="social-link">
            <el-icon><Platform /></el-icon>
            GitHub
          </a>
          <a href="mailto:freestar666666@gmail.com" class="social-link">
            <el-icon><Message /></el-icon>
            Email
          </a>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(150deg, rgb(254, 245, 230) 0%, rgb(230, 244, 254) 62%, rgb(255, 255, 255) 90%, rgb(255, 255, 255) 100%);
}

/* 确保 html 和 body 也是 100% 高度 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app-container {
  min-height: 100vh;
  background: transparent;
  padding: 0 16px;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  background: #2c3e50;
  border-bottom: none;
  box-shadow: var(--shadow-light);
  border-radius: 12px;
  margin: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-img {
  height: 36px;
  width: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  -webkit-text-fill-color: white;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: transparent;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
}

.el-main {
  padding: 24px 0;
  background: transparent;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  background: #2c3e50;
  border-top: none;
  border-radius: 12px;
  margin: 16px;
  color: white;
}

.social-links {
  display: flex;
  gap: 20px;
  margin-top: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: white;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-header {
    padding: 0 16px;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .nav-links {
    gap: 16px;
  }
  
  .nav-link {
    padding: 6px 8px;
    font-size: 0.9rem;
  }
  
  .el-main {
    padding: 16px;
  }
}

/* 可以移除这些不再使用的样式 */
.footer-links,
.divider {
  display: none;
}
</style>
