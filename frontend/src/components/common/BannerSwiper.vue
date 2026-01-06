<template>
  <!-- 添加外层容器 -->
  <div class="banner-section">
    <div class="simple-banner-container">
      <!-- 轮播图主体 -->
      <div class="simple-banner">
        <div 
          v-for="(banner, index) in banners" 
          :key="banner.id"
          class="banner-item"
          :class="{ active: activeIndex === index }"
          :style="{ backgroundImage: 'url(' + banner.image + ')' }" 
        >
          <!-- 黑色半透明遮罩，让文字更清晰 -->
          <div class="image-overlay"></div>
          
          <!-- 内容边界容器 -->
          <div class="content-boundary">
            <div class="banner-content">
              <!-- 标签 -->
              <div class="banner-tag-container">
                <div class="banner-tag" v-if="banner.tag">
                  {{ banner.tag }}
                </div>
              </div>
              
              <!-- 标题部分 - 限制每行字数 -->
              <div class="title-section">
                <div class="title-line">{{ getTitleFirstLine(banner.title) }}</div>
                <div class="title-line" v-if="getTitleSecondLine(banner.title)">
                  {{ getTitleSecondLine(banner.title) }}
                </div>
                <div class="subtitle-line">{{ banner.subtitle }}</div>
              </div>
              
              <!-- 描述 - 限制行数 -->
              <div class="description-container">
                <p class="banner-description">
                  {{ truncateDescription(banner.description) }}
                </p>
              </div>
              
              <!-- 价格部分 -->
              <div class="banner-price" v-if="banner.price">
                <div class="price-row">
                  <!-- 折扣标签 -->
                  <div class="discount-tag" v-if="banner.discount">
                    {{ banner.discount }}
                  </div>
                  
                  <!-- 价格显示 -->
                  <div class="price-display">
                    <div class="price-line">
                      <span class="price-symbol">￥</span>
                      <span class="original-price">
                        {{ formatPrice(banner.originalPrice) }}
                      </span>
                    </div>
                    <div class="price-line current">
                      <span class="price-symbol">￥</span>
                      <span class="current-price">
                        {{ formatPrice(banner.price) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 购买按钮 -->
              <div class="button-container">
                <button class="banner-button" @click="handleBannerClick(banner)">
                  立即购买
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页器 -->
      <div class="pagination">
        <div 
          v-for="(banner, index) in banners" 
          :key="index"
          :class="['pagination-dot', { active: activeIndex === index }]"
          @click="changeSlide(index)"
        ></div>
      </div>
      
      <!-- 导航按钮 -->
      <button class="nav-button prev" @click="prevSlide">
        ‹
      </button>
      <button class="nav-button next" @click="nextSlide">
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 轮播图数据 - 改为使用图片
const banners = ref([
  {
    id: 1,
    image: '/images/banners/nba2k26.jpg', // NBA 2K26 图片
    title: 'NBA2K26',
    subtitle: 'MAMBA MOMENTS EDITION',
    description: '体验最真实的篮球游戏，重返赛场',
    tag: '新品上市',
    originalPrice: 449.00,
    price: 67.05,
    discount: '-55%'
  },
  {
    id: 2,
    image: '/images/banners/fifa23.jpg', // FIFA 23 图片
    title: 'FIFA23',
    subtitle: 'ULTIMATE TEAM EDITION',
    description: '足球世界的终极体验，掌控球场',
    tag: '特惠',
    originalPrice: 449.00,
    price: 209.60,
    discount: '-50%'
  },
  {
    id: 3,
    image: '/images/banners/minecraft.jpg', // Minecraft 图片
    title: 'MINECRAFT',
    subtitle: 'JAVA & BEDROCK EDITION',
    description: '无限创造，探索方块世界的无限可能',
    tag: '限时优惠',
    originalPrice: 98.00,
    price: 45.56,
    discount: '-53%'
  }
])

const activeIndex = ref(0)
let autoSlideInterval = null

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0.00'
  return price.toFixed(2)
}

// 处理标题分行
const getTitleFirstLine = (title) => {
  const words = title.split(' ')
  if (words.length <= 2) return title
  // 取前两个词作为第一行
  return words.slice(0, 2).join(' ')
}

const getTitleSecondLine = (title) => {
  const words = title.split(' ')
  if (words.length <= 2) return ''
  // 剩余的词作为第二行
  return words.slice(2).join(' ')
}

// 截断描述文本
const truncateDescription = (description) => {
  const maxLength = 24 // 限制字符数
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength) + '...'
}

// 切换轮播图
const changeSlide = (index) => {
  activeIndex.value = index
  resetAutoSlide()
}

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % banners.value.length
  resetAutoSlide()
}

const prevSlide = () => {
  activeIndex.value = activeIndex.value === 0 
    ? banners.value.length - 1 
    : activeIndex.value - 1
  resetAutoSlide()
}

// 自动轮播
const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
}

const resetAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
  startAutoSlide()
}

// 点击事件
const handleBannerClick = (banner) => {
  console.log('点击了轮播图:', banner.title)
  alert(`点击了: ${banner.title}`)
}

// 生命周期
onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
})
</script>

<style scoped lang="scss">
/* 外层容器 - 添加页边距 */
.banner-section {
  width: 100%;
  padding: 0 200px; /* 左右边距 */
  margin: 0 auto 32px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0 15px;
  }
}

.simple-banner-container {
  position: relative;
  width: 100%;
  height: 480px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  /* 响应式高度 */
  @media (max-width: 1024px) {
    height: 400px;
  }
  
  @media (max-width: 768px) {
    height: 350px;
  }
  
  @media (max-width: 480px) {
    height: 280px;
  }
}

.simple-banner {
  width: 100%;
  height: 100%;
  position: relative;
  
  .banner-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.8s ease;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    
    /* 背景图片样式 */
    background-size: cover;      /* 覆盖整个区域 */
    background-position: center; /* 居中显示 */
    background-repeat: no-repeat; /* 不重复 */
    
    &.active {
      opacity: 1;
      z-index: 1;
    }
    
    /* 图片遮罩层 - 让文字更清晰 */
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0.3) 100%
      );
      z-index: 1;
    }
    
    /* 内容边界容器 */
    .content-boundary {
      position: relative; /* 确保在遮罩层之上 */
      z-index: 2;
      width: 100%;
      max-width: 600px;
      margin: 0 0 0 60px;
      padding: 20px;
      box-sizing: border-box;
      
      @media (max-width: 1024px) {
        margin-left: 40px;
        max-width: 500px;
      }
      
      @media (max-width: 768px) {
        margin-left: 30px;
        max-width: 400px;
      }
      
      @media (max-width: 480px) {
        margin-left: 20px;
        max-width: 280px;
        padding: 10px;
      }
      
      .banner-content {
        position: relative;
        color: white;
        width: 100%;
        
        /* 标签 */
        .banner-tag-container {
          width: fit-content;
          margin-bottom: 15px;
          
          .banner-tag {
            display: inline-block;
            background: linear-gradient(45deg, #ff6b6b, #ffa502);
            color: white;
            padding: 6px 16px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            white-space: nowrap;
            
            @media (max-width: 480px) {
              padding: 4px 12px;
              font-size: 12px;
            }
          }
        }
        
        /* 标题部分 - 单行显示 */
        .title-section {
          margin-bottom: 20px;
          line-height: 1.2;
          
          .title-line {
            font-size: 42px;
            font-weight: 900;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 400px;
            
            @media (max-width: 1024px) {
              font-size: 32px;
              max-width: 350px;
            }
            
            @media (max-width: 768px) {
              font-size: 26px;
              max-width: 280px;
            }
            
            @media (max-width: 480px) {
              font-size: 20px;
              max-width: 200px;
            }
          }
          
          .subtitle-line {
            font-size: 24px;
            color: #b0b3c1;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 400px;
            
            @media (max-width: 1024px) {
              font-size: 20px;
              max-width: 350px;
            }
            
            @media (max-width: 768px) {
              font-size: 16px;
              max-width: 280px;
            }
            
            @media (max-width: 480px) {
              font-size: 14px;
              max-width: 200px;
            }
          }
        }
        
        /* 描述 - 单行 */
        .description-container {
          margin-bottom: 25px;
          max-width: 400px;
          
          @media (max-width: 480px) {
            display: none;
          }
          
          .banner-description {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            
            @media (max-width: 768px) {
              font-size: 14px;
            }
          }
        }
        
        /* 价格部分 - 紧凑布局 */
        .banner-price {
          margin-bottom: 25px;
          
          @media (max-width: 480px) {
            margin-bottom: 15px;
          }
          
          .price-row {
            display: flex;
            align-items: center;
            gap: 20px;
            
            @media (max-width: 768px) {
              gap: 15px;
            }
            
            @media (max-width: 480px) {
              gap: 10px;
            }
            
            /* 折扣标签 */
            .discount-tag {
              background: #ff6b6b;
              color: white;
              padding: 10px 16px;
              border-radius: 8px;
              font-size: 28px;
              font-weight: 900;
              min-width: 90px;
              height: 50px;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              
              @media (max-width: 1024px) {
                font-size: 24px;
                min-width: 80px;
                height: 45px;
              }
              
              @media (max-width: 768px) {
                font-size: 20px;
                min-width: 70px;
                height: 40px;
                padding: 8px 12px;
              }
              
              @media (max-width: 480px) {
                font-size: 16px;
                min-width: 60px;
                height: 35px;
                padding: 6px 10px;
              }
            }
            
            /* 价格显示 */
            .price-display {
              display: flex;
              flex-direction: column;
              gap: 4px;
              
              .price-line {
                display: flex;
                align-items: baseline;
                gap: 4px;
                
                &.current {
                  .price-symbol {
                    font-size: 24px;
                    font-weight: 700;
                    
                    @media (max-width: 480px) {
                      font-size: 18px;
                    }
                  }
                  
                  .current-price {
                    font-size: 40px;
                    font-weight: 900;
                    line-height: 1;
                    
                    @media (max-width: 1024px) {
                      font-size: 34px;
                    }
                    
                    @media (max-width: 768px) {
                      font-size: 28px;
                    }
                    
                    @media (max-width: 480px) {
                      font-size: 22px;
                    }
                  }
                }
                
                &:not(.current) {
                  .price-symbol {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                    
                    @media (max-width: 480px) {
                      font-size: 12px;
                    }
                  }
                  
                  .original-price {
                    font-size: 22px;
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: line-through;
                    font-weight: 600;
                    
                    @media (max-width: 768px) {
                      font-size: 18px;
                    }
                    
                    @media (max-width: 480px) {
                      font-size: 14px;
                    }
                  }
                }
              }
            }
          }
        }
        
        /* 购买按钮 */
        .button-container {
          .banner-button {
            background: linear-gradient(45deg, #1a73e8, #0d47a1);
            color: white;
            border: none;
            padding: 14px 40px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            width: 180px;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 25px rgba(26, 115, 232, 0.4);
            }
            
            @media (max-width: 768px) {
              width: 160px;
              height: 46px;
              font-size: 16px;
              padding: 12px 30px;
            }
            
            @media (max-width: 480px) {
              width: 140px;
              height: 40px;
              font-size: 14px;
              padding: 10px 20px;
            }
          }
        }
      }
    }
  }
}

// 分页器
.pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 8px;
  
  .pagination-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.active {
      width: 25px;
      border-radius: 5px;
      background: #1a73e8;
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.8);
    }
  }
}

// 导航按钮
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
  
  &.prev {
    left: 15px;
    
    @media (max-width: 768px) {
      left: 10px;
    }
  }
  
  &.next {
    right: 15px;
    
    @media (max-width: 768px) {
      right: 10px;
    }
  }
}
</style>