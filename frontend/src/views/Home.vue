<template>
  <div class="home-page">
    <!-- 头部导航 -->
    <HeaderNav />

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 轮播图 -->
      <BannerSwiper
        :banners="banners"
        @banner-click="handleBannerClick"
      />

      <div class="container">
        <!-- 热门推荐 -->
        <section class="section featured-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">🔥</span>
              热门推荐
            </h2>
            <router-link to="/games?sort=popular" class="view-all">
              查看全部 <span>→</span>
            </router-link>
          </div>

          <div class="games-grid">
            <GameCard
              v-for="game in featuredGames"
              :key="game.id"
              :game="game"
              @buy="handleBuyGame"
              @add-to-cart="handleAddToCart"
              @quick-view="handleQuickView"
            />
          </div>
        </section>

        <!-- 限时特惠 -->
        <section class="section discount-section">
          <div class="section-header">
            <div class="section-title-row">
              <h2 class="section-title">
                <span class="title-icon">⏰</span>
                限时特惠
              </h2>
              <div class="countdown" v-if="discountEndTime">
                <span class="countdown-label">距结束:</span>
                <span class="countdown-time">{{ formatCountdown }}</span>
              </div>
            </div>

            <div class="discount-tabs">
              <button
                v-for="tab in discountTabs"
                :key="tab.value"
                :class="['discount-tab', { active: activeDiscountTab === tab.value }]"
                @click="changeDiscountTab(tab.value)"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="games-grid">
            <GameCard
              v-for="game in discountedGames"
              :key="game.id"
              :game="game"
              @buy="handleBuyGame"
              @add-to-cart="handleAddToCart"
              @quick-view="handleQuickView"
            />
          </div>
        </section>

        <!-- 新品上架 -->
        <section class="section new-games-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">✨</span>
              新品上架
            </h2>
            <div class="new-game-filters">
              <button
                v-for="filter in newGameFilters"
                :key="filter.value"
                :class="['new-game-filter', { active: activeNewFilter === filter.value }]"
                @click="changeNewFilter(filter.value)"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <div class="games-grid">
            <GameCard
              v-for="game in newGames"
              :key="game.id"
              :game="game"
              @buy="handleBuyGame"
              @add-to-cart="handleAddToCart"
              @quick-view="handleQuickView"
            />
          </div>
        </section>

        <!-- 游戏分类 -->
        <section class="section categories-section">
          <h2 class="section-title">
            <span class="title-icon">📂</span>
            游戏分类
          </h2>

          <div class="categories-grid">
            <div
              v-for="category in gameCategories"
              :key="category.id"
              class="category-card"
              @click="filterByCategory(category.id)"
            >
              <div class="category-icon">{{ getCategoryIcon(category.id) }}</div>
              <h3 class="category-name">{{ category.name }}</h3>
              <p class="category-count">{{ getCategoryCount(category.id) }} 款游戏</p>
            </div>
          </div>
        </section>

        <!-- 精选合集 -->
        <section class="section collections-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">🎯</span>
              精选合集
            </h2>
            <div class="collection-nav">
              <button class="nav-btn prev" @click="prevCollection">←</button>
              <button class="nav-btn next" @click="nextCollection">→</button>
            </div>
          </div>

          <div class="collections-slider">
            <div
              class="collection-card"
              :style="{ transform: `translateX(-${currentCollectionIndex * 100}%)` }"
            >
              <div
                v-for="collection in collections"
                :key="collection.id"
                class="collection-item"
              >
                <img :src="collection.image" :alt="collection.title" class="collection-bg" />
                <div class="collection-overlay"></div>
                <div class="collection-content">
                  <h3 class="collection-title">{{ collection.title }}</h3>
                  <p class="collection-description">{{ collection.description }}</p>
                  <button class="collection-btn" @click="viewCollection(collection.id)">
                    查看合集
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="collection-dots">
            <div
              v-for="(collection, index) in collections"
              :key="collection.id"
              :class="['collection-dot', { active: currentCollectionIndex === index }]"
              @click="currentCollectionIndex = index"
            ></div>
          </div>
        </section>

        <!-- 游戏详情弹窗 -->
        <el-dialog
          v-model="showGameDetail"
          title="游戏详情"
          width="900px"
          :before-close="handleCloseDialog"
          class="game-detail-modal"
        >
          <GameDetail
            v-if="selectedGame"
            :game="selectedGame"
            @buy="handleBuyGame"
            @add-to-cart="handleAddToCart"
          />
        </el-dialog>
      </div>
    </main>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { GAME_CATEGORIES, GAMES_DATA } from '@/utils/constants'
import HeaderNav from '@/components/common/HeaderNav.vue'
import Footer from '@/components/common/Footer.vue'
import BannerSwiper from '@/components/common/BannerSwiper.vue'
import GameCard from '@/components/common/GameCard.vue'
import GameDetail from '@/components/common/GameDetail.vue'

const router = useRouter()
const store = useStore()

// 状态
const showGameDetail = ref(false)
const selectedGame = ref(null)
const activeDiscountTab = ref('all')
const activeNewFilter = ref('recent')
const currentCollectionIndex = ref(0)

// 折扣倒计时
const discountEndTime = ref(Date.now() + 48 * 60 * 60 * 1000) // 48小时后
const discountTimer = ref(null)

// 数据
const banners = [
  {
    id: 1,
    image: '/images/banners/banner1.jpg',
    title: 'RAFT THE FINAL CHAPTER',
    subtitle: '无尽的海洋冒险',
    description: '在广阔的海上生存并建立你的木筏帝国',
    tag: '新品上市',
    originalPrice: 98.00,
    price: 45.56,
    discount: '-33%',
    link: '/games/1'
  },
  {
    id: 2,
    image: '/images/banners/banner2.jpg',
    title: '无尽帝国2',
    subtitle: '建立你的永恒帝国',
    description: '在神秘的奇幻世界中建立你的帝国',
    tag: '热门推荐',
    originalPrice: 199.00,
    price: 119.40,
    discount: '-40%',
    link: '/games/2'
  },
  {
    id: 3,
    image: '/images/banners/banner3.jpg',
    title: 'The Elder Scrolls IV: OBLIVION',
    subtitle: '重制版现已推出',
    description: '经典奇幻RPG游戏重制版',
    tag: '经典重现',
    originalPrice: 249.00,
    price: 166.83,
    discount: '-33%',
    link: '/games/3'
  }
]

const collections = [
  {
    id: 1,
    image: '/images/games/cyberpunk-2077.jpg',
    title: '科幻未来世界',
    description: '探索赛博朋克、太空冒险等科幻题材游戏',
    count: 12
  },
  {
    id: 2,
    image: '/images/games/elden-ring.jpg',
    title: '史诗级开放世界',
    description: '沉浸在广阔无垠的游戏世界中',
    count: 8
  },
  {
    id: 3,
    image: '/images/games/valorant.jpg',
    title: '竞技对抗',
    description: '挑战极限，展现你的竞技实力',
    count: 15
  }
]

// 计算属性
const featuredGames = computed(() => {
  return GAMES_DATA
    .filter(game => game.rating >= 4.5)
    .slice(0, 8)
})

const discountedGames = computed(() => {
  let filtered = GAMES_DATA.filter(game => game.discount)

  if (activeDiscountTab.value !== 'all') {
    const discountValue = parseInt(activeDiscountTab.value)
    filtered = filtered.filter(game => {
      const gameDiscount = parseInt(game.discount.replace('%', ''))
      return gameDiscount >= discountValue
    })
  }

  return filtered.slice(0, 8)
})

const newGames = computed(() => {
  const sorted = [...GAMES_DATA].sort((a, b) => {
    const dateA = new Date(a.releaseDate || 0)
    const dateB = new Date(b.releaseDate || 0)
    return dateB - dateA
  })

  if (activeNewFilter.value === 'recent') {
    return sorted.slice(0, 8)
  } else if (activeNewFilter.value === 'free') {
    return sorted.filter(game => game.price === 0).slice(0, 8)
  }

  return sorted.slice(0, 8)
})

const gameCategories = GAME_CATEGORIES

const discountTabs = [
  { value: 'all', label: '全部特惠' },
  { value: '50', label: '5折及以上' },
  { value: '60', label: '6折及以上' },
  { value: '70', label: '7折及以上' }
]

const newGameFilters = [
  { value: 'recent', label: '最新上架' },
  { value: 'free', label: '免费游戏' }
]

const formatCountdown = computed(() => {
  const now = Date.now()
  const diff = Math.max(0, discountEndTime.value - now)

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 方法

const handleBannerClick = (banner) => {
  router.push(banner.link)
}

const handleBuyGame = (game) => {
  console.log('购买游戏:', game.title)
  // 实际应用中这里会调用购买API
  store.addToCart(game)
  showGameDetail.value = false
}

const handleAddToCart = (game) => {
  console.log('加入购物车:', game.title)
  store.addToCart(game)
}

const handleQuickView = (game) => {
  selectedGame.value = game
  showGameDetail.value = true
}

const handleCloseDialog = () => {
  showGameDetail.value = false
  selectedGame.value = null
}

const changeDiscountTab = (tab) => {
  activeDiscountTab.value = tab
}

const changeNewFilter = (filter) => {
  activeNewFilter.value = filter
}

const filterByCategory = (categoryId) => {
  router.push(`/games?category=${categoryId}`)
}

const getCategoryIcon = (categoryId) => {
  const icons = {
    action: '👊',
    adventure: '🧭',
    rpg: '⚔️',
    shooter: '🔫',
    strategy: '♟️',
    sports: '⚽',
    racing: '🏎️',
    simulation: '🛩️',
    indie: '🎨',
    multiplayer: '👥'
  }
  return icons[categoryId] || '🎮'
}

const getCategoryCount = (categoryId) => {
  return GAMES_DATA.filter(game =>
    game.categories?.includes(categoryId)
  ).length
}

const prevCollection = () => {
  currentCollectionIndex.value = (currentCollectionIndex.value - 1 + collections.length) % collections.length
}

const nextCollection = () => {
  currentCollectionIndex.value = (currentCollectionIndex.value + 1) % collections.length
}

const viewCollection = (collectionId) => {
  router.push(`/games?collection=${collectionId}`)
}

// 生命周期
onMounted(() => {
  store.setGames(GAMES_DATA)

  // 启动倒计时
  discountTimer.value = setInterval(() => {
    // 倒计时每秒更新
  }, 1000)
})

onUnmounted(() => {
  if (discountTimer.value) {
    clearInterval(discountTimer.value)
  }
})
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 20px;
}

.search-section {
  margin-bottom: 40px;

  .search-box-large {
    display: flex;
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: #1a73e8;
      box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
    }

    .search-input-large {
      flex: 1;
      padding: 20px 30px;
      background: transparent;
      border: none;
      color: white;
      font-size: 18px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:focus {
        outline: none;
      }
    }

    .search-button-large {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 40px;
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      border: none;
      color: white;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(45deg, #0d47a1, #1a73e8);
        padding-right: 45px;
      }

      .search-icon {
        font-size: 20px;
      }
    }
  }
}

.section {
  margin-bottom: 60px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .section-title {
      font-size: 28px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;

      .title-icon {
        font-size: 32px;
      }
    }

    .view-all {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #1a73e8;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        gap: 10px;
        color: #0d47a1;
      }
    }
  }
}

.featured-section {
  .section-title {
    background: linear-gradient(45deg, #ff6b6b, #ffa502);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
}

.discount-section {
  .section-header {
    .section-title-row {
      display: flex;
      align-items: center;
      gap: 24px;

      .section-title {
        background: linear-gradient(45deg, #ff4757, #ff6b6b);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }

      .countdown {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 71, 87, 0.1);
        padding: 8px 16px;
        border-radius: 20px;

        .countdown-label {
          font-size: 14px;
          color: #ff4757;
        }

        .countdown-time {
          font-family: monospace;
          font-size: 18px;
          font-weight: 700;
          color: white;
          letter-spacing: 2px;
        }
      }
    }

    .discount-tabs {
      display: flex;
      gap: 8px;

      .discount-tab {
        padding: 8px 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        color: #b0b3c1;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        &.active {
          background: linear-gradient(45deg, #ff4757, #ff6b6b);
          color: white;
          border-color: transparent;
        }
      }
    }
  }
}

.new-games-section {
  .section-title {
    background: linear-gradient(45deg, #1a73e8, #64b5f6);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .new-game-filters {
    display: flex;
    gap: 8px;

    .new-game-filter {
      padding: 8px 20px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: #b0b3c1;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }

      &.active {
        background: linear-gradient(45deg, #1a73e8, #64b5f6);
        color: white;
        border-color: transparent;
      }
    }
  }
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.categories-section {
  .section-title {
    margin-bottom: 30px;
    background: linear-gradient(45deg, #2ed573, #00cec9);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;

    .category-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 30px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }

      .category-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .category-name {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
        color: white;
      }

      .category-count {
        font-size: 14px;
        color: #b0b3c1;
      }
    }
  }
}

.collections-section {
  .section-header {
    .section-title {
      background: linear-gradient(45deg, #9b59b6, #8e44ad);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }

    .collection-nav {
      display: flex;
      gap: 8px;

      .nav-btn {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        color: white;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  .collections-slider {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    height: 300px;
    margin-bottom: 20px;

    .collection-card {
      display: flex;
      transition: transform 0.5s ease;
      height: 100%;
    }

    .collection-item {
      flex: 0 0 100%;
      position: relative;

      .collection-bg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .collection-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.8) 0%,
          rgba(0, 0, 0, 0.4) 50%,
          rgba(0, 0, 0, 0.2) 100%
        );
      }

      .collection-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 60px;
        color: white;
        z-index: 2;

        .collection-title {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 16px;
          max-width: 500px;
        }

        .collection-description {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 30px;
          max-width: 500px;
        }

        .collection-btn {
          align-self: flex-start;
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          color: white;
          border: none;
          padding: 14px 40px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3);
          }
        }
      }
    }
  }

  .collection-dots {
    display: flex;
    justify-content: center;
    gap: 8px;

    .collection-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.5);
      }

      &.active {
        width: 30px;
        border-radius: 5px;
        background: #9b59b6;
      }
    }
  }
}

// 游戏详情弹窗
:deep(.game-detail-modal) {
  .el-dialog {
    background: #1a1d29;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 85vh;
    overflow-y: auto;
  }

  .el-dialog__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0;
    padding: 20px;

    .el-dialog__title {
      color: white;
      font-size: 20px;
      font-weight: 600;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: #b0b3c1;
        font-size: 20px;

        &:hover {
          color: white;
        }
      }
    }
  }

  .el-dialog__body {
    padding: 0;

    // 新增：修复游戏详情弹窗中的图片显示问题
    .game-detail {
      .game-image-container {
        width: 100%;
        height: 400px; // 设置固定的高度
        overflow: hidden;
        border-radius: 12px;
        margin-bottom: 20px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover; // 关键：确保图片填充容器
          object-position: center;
        }
      }

      // 确保其他内容正常显示
      .game-content {
        padding: 20px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
  }

  .collections-slider .collection-item .collection-content {
    padding: 40px;

    .collection-title {
      font-size: 28px;
    }

    .collection-description {
      font-size: 16px;
    }
  }
}

@media (max-width: 768px) {
  .section .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .discount-section .section-header {
    .section-title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }

  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
  }

  .search-box-large {
    flex-direction: column;
    border-radius: 20px !important;

    .search-input-large {
      padding: 15px 20px !important;
    }

    .search-button-large {
      padding: 15px !important;
      justify-content: center;
    }
  }

  .collections-slider {
    height: 250px;

    .collection-item .collection-content {
      padding: 30px;

      .collection-title {
        font-size: 24px;
      }

      .collection-description {
        font-size: 14px;
      }
    }
  }

  // 移动端调整游戏详情弹窗
  :deep(.game-detail-modal) {
    .el-dialog {
      width: 95% !important;
      margin: 10px !important;
    }

    .el-dialog__body .game-detail .game-image-container {
      height: 300px; // 移动端调整高度
    }
  }
}

@media (max-width: 480px) {
  .games-grid {
    grid-template-columns: 1fr;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .collections-slider {
    height: 200px;

    .collection-item .collection-content {
      padding: 20px;

      .collection-title {
        font-size: 20px;
      }

      .collection-btn {
        padding: 10px 20px;
        font-size: 14px;
      }
    }
  }

  // 小屏幕调整
  :deep(.game-detail-modal) {
    .el-dialog__body .game-detail .game-image-container {
      height: 250px;
    }
  }
}
</style>