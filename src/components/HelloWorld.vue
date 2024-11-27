<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToRules = () => {
  router.push('/rules')
}
</script>

<template>
  <div class="container">
    <div class="cards-grid">
      <div class="card" @click="router.push('/')">
        <div class="card-content">
          <h3>开始游戏</h3>
          <p>体验智力挑战</p>
        </div>
      </div>

      <div class="card" @click="navigateToRules">
        <div class="card-content">
          <h3>游戏规则</h3>
          <p>了解玩法说明</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 1.5rem;
}

.card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.card p {
  margin: 0;
  color: #666;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem;
  }

  .card-content {
    padding: 1rem;
  }

  .card h3 {
    font-size: 1.1rem;
  }
}

/* 确保在较小的手机屏幕上也能正常显示 */
@media (max-width: 320px) {
  .cards-grid {
    padding: 0.25rem;
  }

  .card-content {
    padding: 0.75rem;
  }
}
</style>
