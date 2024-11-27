<template>
  <div class="rules-container">
    <h1>海龟汤游戏规则</h1>
    <div class="rules-content">
      <section>
        <h2>游戏目标</h2>
        <p>通过有限的信息和提问，推断出故事的完整背景和细节。每个谜题由一个简短的描述开始，玩家需要通过提问与系统互动，逐步揭开故事的全貌。</p>
      </section>

      <section>
        <h2>基本规则</h2>
        <ul>
          <li>系统会提供一个简短、模糊或看似不合逻辑的故事开头</li>
          <li>玩家可以提出"是/否"问题来获取更多线索</li>
          <li>系统将只回答"是"或"否"</li>
          <li>根据获得的信息进行推理，尝试还原完整故事</li>
          <li>当成功推断出完整故事背景时，即可结束游戏</li>
        </ul>
      </section>

      <section>
        <h2>游戏流程</h2>
        <ol>
          <li>阅读初始故事描述</li>
          <li>思考并提出"是/否"问题</li>
          <li>根据系统回答进行推理</li>
          <li>适时提出完整故事猜测</li>
          <li>猜对后结束游戏</li>
        </ol>
      </section>

      <section>
        <h2>提示说明</h2>
        <ul>
          <li>注意观察故事中的细节和关键词</li>
          <li>提问时要有逻辑性和连贯性</li>
          <li>可以随时查看已获得的线索</li>
          <li>遇到困难可以使用提示功能</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.rules-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.rules-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

h2 {
  color: #444;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

ul, ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.5rem;
  color: #666;
  line-height: 1.6;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .rules-container {
    padding: 1rem;
  }

  .rules-content {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.2rem;
  }
}
</style> 