<template>
  <div class="game-card" @click="$emit('click', game)">
    <div class="game-image-container">
      <img 
        :src="game.image" 
        :alt="game.title" 
        class="game-image"
        loading="lazy"
      />
      
      <!-- 折扣标签 -->
      <div v-if="game.discount" class="discount-tag" :style="{ background: discountColor }">
        {{ game.discount }}
      </div>
      
      <!-- 游戏标签 -->
      <div class="game-tags-overlay">
        <span v-for="tag in displayedTags" :key="tag" class="game-tag">
          {{ tag }}
        </span>
      </div>
      
      <!-- 悬停遮罩 -->
      <div class="game-hover-mask">
        <div class="hover-content">
          <button class="quick-view-btn" @click.stop="handleQuickView">
            <span class="btn-icon">👁️</span>
            <span>快速查看</span>
          </button>
          <button class="add-to-cart-btn" @click.stop="handleAddToCart">
            <span class="btn-icon">🛒</span>
            <span>加入购物车</span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="game-info">
      <h3 class="game-title">{{ game.title }}</h3>
      
      <div class="game-subtitle" v-if="game.subtitle">
        {{ game.subtitle }}
      </div>
      
      <div class="game-rating" v-if="game.rating">
        <div class="stars">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(game.rating) }">
            ★
          </span>
        </div>
        <span class="rating-value">{{ game.rating.toFixed(1) }}</span>
      </div>
      
      <div class="price-section">
        <div class="price-info">
          <span v-if="game.originalPrice" class="original-price">
            ¥{{ game.originalPrice.toFixed(2) }}
          </span>
          <span class="current-price">
            ¥{{ game.price.toFixed(2) }}
          </span>
        </div>
        
        <button class="buy-button" @click.stop="handleBuy">
          立即购买
        </button>
      </div>
      
      <div class="game-meta">
        <span class="meta-item" v-if="game.releaseDate">
          📅 {{ formatDate(game.releaseDate) }}
        </span>
        <span class="meta-item" v-if="game.players">
          👥 {{ formatPlayerCount(game.players) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DISCOUNT_TAGS } from '@/utils/constants'

const props = defineProps({
  game: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: '',
      image: '',
      price: 0,
      originalPrice: null,
      discount: '',
      tags: [],
      rating: 0,
      players: 0,
      releaseDate: null
    })
  }
})

const emit = defineEmits(['click', 'buy', 'add-to-cart', 'quick-view'])

const discountColor = computed(() => {
  const discount = DISCOUNT_TAGS.find(d => d.label === props.game.discount)
  return discount ? discount.color : '#ff6b6b'
})

const displayedTags = computed(() => {
  return props.game.tags ? props.game.tags.slice(0, 3) : []
})

const handleBuy = () => {
  emit('buy', props.game)
}

const handleAddToCart = () => {
  emit('add-to-cart', props.game)
}

const handleQuickView = () => {
  emit('quick-view', props.game)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

const formatPlayerCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
</script>

<style scoped lang="scss">
.game-card {
  background: #2a2d3a;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
    
    .game-hover-mask {
      opacity: 1;
    }
    
    .game-image {
      transform: scale(1.05);
    }
  }
}

.game-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  
  .game-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .discount-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #ff6b6b;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    z-index: 2;
  }
  
  .game-tags-overlay {
    position: absolute;
    bottom: 12px;
    left: 12px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    max-width: calc(100% - 24px);
    
    .game-tag {
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      backdrop-filter: blur(4px);
    }
  }
  
  .game-hover-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 3;
    
    .hover-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 80%;
      
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        
        .btn-icon {
          font-size: 16px;
        }
      }
      
      .quick-view-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
      
      .add-to-cart-btn {
        background: linear-gradient(45deg, #1a73e8, #0d47a1);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
        }
      }
    }
  }
}

.game-info {
  padding: 20px;
  
  .game-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #ffffff;
    line-height: 1.3;
    height: 46px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .game-subtitle {
    font-size: 14px;
    color: #b0b3c1;
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  .game-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    
    .stars {
      display: flex;
      
      .star {
        color: #8a8d9b;
        font-size: 16px;
        
        &.filled {
          color: #ffa502;
        }
      }
    }
    
    .rating-value {
      font-size: 14px;
      color: #b0b3c1;
    }
  }
  
  .price-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    
    .price-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .original-price {
        font-size: 14px;
        color: #8a8d9b;
        text-decoration: line-through;
      }
      
      .current-price {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
      }
    }
    
    .buy-button {
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(26, 115, 232, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
  
  .game-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #8a8d9b;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

@media (max-width: 768px) {
  .game-card {
    .game-info {
      padding: 16px;
      
      .game-title {
        font-size: 16px;
        height: 40px;
      }
      
      .current-price {
        font-size: 20px;
      }
      
      .buy-button {
        padding: 6px 16px;
        font-size: 12px;
      }
    }
  }
}
</style>