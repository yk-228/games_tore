<template>
  <div v-if="game" class="game-detail">
    <div class="detail-header">
      <div class="game-cover">
        <img :src="game.image" :alt="game.title" class="cover-image" />
        <div v-if="game.discount" class="discount-badge">
          {{ game.discount }}
        </div>
      </div>
      
      <div class="game-header-info">
        <div class="game-title-section">
          <h1 class="game-title">{{ game.title }}</h1>
          <p class="game-subtitle" v-if="game.subtitle">{{ game.subtitle }}</p>
        </div>
        
        <div class="game-meta">
          <div class="meta-item">
            <span class="meta-label">发行日期</span>
            <span class="meta-value">{{ formatDate(game.releaseDate) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">评分</span>
            <div class="rating">
              <span class="rating-stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(game.rating) }">
                  ★
                </span>
              </span>
              <span class="rating-value">{{ game.rating.toFixed(1) }}</span>
              <span class="rating-count" v-if="game.players">({{ formatPlayerCount(game.players) }} 玩家)</span>
            </div>
          </div>
          <div class="meta-item">
            <span class="meta-label">类别</span>
            <div class="game-categories">
              <span v-for="category in game.categories" :key="category" class="category-tag">
                {{ category }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="price-section">
          <div class="price-info">
            <div class="discount-price" v-if="game.originalPrice">
              <span class="original-price">原价: ¥{{ game.originalPrice.toFixed(2) }}</span>
              <span class="discount-amount" v-if="game.discount">{{ game.discount }}</span>
            </div>
            <div class="current-price">
              ¥{{ game.price.toFixed(2) }}
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn-add-to-cart" @click="handleAddToCart">
              <span class="btn-icon">🛒</span>
              加入购物车
            </button>
            <button class="btn-buy-now" @click="handleBuyNow">
              <span class="btn-icon">⚡</span>
              立即购买
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="detail-content">
      <div class="content-left">
        <div class="section description-section">
          <h2 class="section-title">游戏介绍</h2>
          <p class="game-description">{{ game.description }}</p>
        </div>
        
        <div class="section tags-section">
          <h2 class="section-title">游戏标签</h2>
          <div class="tags-container">
            <span v-for="tag in game.tags" :key="tag" class="tag-item">
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="section requirements-section" v-if="game.requirements">
          <h2 class="section-title">系统需求</h2>
          <div class="requirements">
            <div class="requirement" v-for="(req, index) in game.requirements" :key="index">
              <h3>{{ req.type }}</h3>
              <p>{{ req.detail }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="content-right">
        <div class="sidebar-section">
          <h3 class="sidebar-title">支付方式</h3>
          <div class="payment-methods">
            <div v-for="method in paymentMethods" :key="method.id" class="payment-method">
              <img :src="`/images/icons/${method.icon}`" :alt="method.name" />
              <span>{{ method.name }}</span>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <h3 class="sidebar-title">特别提醒</h3>
          <ul class="reminders">
            <li>购买后可永久拥有</li>
            <li>支持多平台下载</li>
            <li>提供退款保障</li>
            <li>24/7 在线客服</li>
          </ul>
        </div>
        
        <div class="sidebar-section">
          <h3 class="sidebar-title">其他玩家也购买了</h3>
          <div class="related-games">
            <div v-for="relatedGame in relatedGames" :key="relatedGame.id" class="related-game">
              <img :src="relatedGame.image" :alt="relatedGame.title" />
              <div class="related-info">
                <h4>{{ relatedGame.title }}</h4>
                <div class="related-price">¥{{ relatedGame.price.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="loading-state">
    <div class="loading-spinner"></div>
    <p>加载游戏中...</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PAYMENT_METHODS, GAMES_DATA } from '@/utils/constants'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['buy', 'add-to-cart'])

const paymentMethods = PAYMENT_METHODS

const relatedGames = computed(() => {
  return GAMES_DATA
    .filter(g => g.id !== props.game.id && g.categories?.some(c => props.game.categories?.includes(c)))
    .slice(0, 3)
})

const handleBuyNow = () => {
  emit('buy', props.game)
}

const handleAddToCart = () => {
  emit('add-to-cart', props.game)
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPlayerCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)} 百万`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)} 千`
  }
  return count.toString()
}
</script>

<style scoped lang="scss">
.game-detail {
  background: #1a1d29;
  border-radius: 16px;
  overflow: hidden;
}

.detail-header {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  padding: 40px;
  background: linear-gradient(135deg, #1a1d29 0%, #2a2d3a 100%);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
}

.game-cover {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  .cover-image {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .discount-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #ff6b6b;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: 700;
    z-index: 2;
  }
}

.game-header-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.game-title-section {
  .game-title {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 8px;
    color: #ffffff;
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 28px;
    }
  }
  
  .game-subtitle {
    font-size: 18px;
    color: #b0b3c1;
  }
}

.game-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  
  .meta-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    
    .meta-label {
      font-weight: 600;
      color: #b0b3c1;
      min-width: 80px;
    }
    
    .meta-value {
      color: #ffffff;
    }
    
    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .rating-stars {
        .star {
          color: #8a8d9b;
          font-size: 18px;
          
          &.filled {
            color: #ffa502;
          }
        }
      }
      
      .rating-value {
        font-weight: 700;
        color: #ffffff;
      }
      
      .rating-count {
        color: #b0b3c1;
        font-size: 14px;
      }
    }
    
    .game-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .category-tag {
        background: rgba(26, 115, 232, 0.2);
        color: #1a73e8;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 14px;
      }
    }
  }
}

.price-section {
  background: rgba(26, 115, 232, 0.1);
  border: 2px solid rgba(26, 115, 232, 0.3);
  border-radius: 12px;
  padding: 24px;
  
  .price-info {
    margin-bottom: 24px;
    
    .discount-price {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
      
      .original-price {
        font-size: 18px;
        color: #8a8d9b;
        text-decoration: line-through;
      }
      
      .discount-amount {
        background: #ff6b6b;
        color: white;
        padding: 4px 12px;
        border-radius: 6px;
        font-weight: 600;
      }
    }
    
    .current-price {
      font-size: 42px;
      font-weight: 800;
      color: #ffffff;
      
      @media (max-width: 768px) {
        font-size: 32px;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 16px;
    
    @media (max-width: 480px) {
      flex-direction: column;
    }
    
    button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      .btn-icon {
        font-size: 20px;
      }
      
      &.btn-add-to-cart {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
      }
      
      &.btn-buy-now {
        background: linear-gradient(45deg, #1a73e8, #0d47a1);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(26, 115, 232, 0.3);
        }
      }
    }
  }
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
  padding: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 30px;
  }
}

.content-left {
  .section {
    margin-bottom: 40px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .section-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #ffffff;
      padding-bottom: 12px;
      border-bottom: 2px solid rgba(26, 115, 232, 0.3);
    }
  }
  
  .game-description {
    font-size: 16px;
    line-height: 1.8;
    color: #b0b3c1;
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .tag-item {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(26, 115, 232, 0.3);
      }
    }
  }
  
  .requirements {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .requirement {
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 8px;
      
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
        color: #ffffff;
      }
      
      p {
        font-size: 14px;
        color: #b0b3c1;
        line-height: 1.6;
      }
    }
  }
}

.content-right {
  .sidebar-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .sidebar-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #ffffff;
    }
  }
  
  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .payment-method {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }
      
      span {
        color: #ffffff;
        font-size: 14px;
      }
    }
  }
  
  .reminders {
    list-style: none;
    padding: 0;
    
    li {
      padding: 10px 0;
      color: #b0b3c1;
      font-size: 14px;
      position: relative;
      padding-left: 24px;
      
      &:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #2ed573;
        font-weight: bold;
      }
      
      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
    }
  }
  
  .related-games {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .related-game {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(4px);
      }
      
      img {
        width: 60px;
        height: 40px;
        border-radius: 6px;
        object-fit: cover;
      }
      
      .related-info {
        flex: 1;
        
        h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #ffffff;
          line-height: 1.3;
        }
        
        .related-price {
          font-size: 16px;
          font-weight: 700;
          color: #1a73e8;
        }
      }
    }
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 20px;
  
  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(26, 115, 232, 0.1);
    border-top-color: #1a73e8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  p {
    color: #b0b3c1;
    font-size: 18px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>