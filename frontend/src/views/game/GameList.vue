<template>
  <div class="game-list-page">
    <HeaderNav />
    
    <main class="game-list-main">
      <div class="container">
        <!-- 页面标题和筛选 -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">游戏商店</h1>
            <p class="page-subtitle">探索精彩游戏世界</p>
          </div>
          
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalGames }}</span>
              <span class="stat-label">款游戏</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ discountedGames }}</span>
              <span class="stat-label">款特惠</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ newGames }}</span>
              <span class="stat-label">款新游</span>
            </div>
          </div>
        </div>
        
        <div class="game-list-content">
          <!-- 侧边栏筛选 -->
          <div class="sidebar-filters">
            
            <div class="filter-section">
              <h3 class="filter-title">游戏分类</h3>
              <div class="category-list">
                <label
                  v-for="category in categories"
                  :key="category.id"
                  :class="['category-item', { active: selectedCategories.includes(category.id) }]"
                >
                  <input
                    type="checkbox"
                    :value="category.id"
                    v-model="selectedCategories"
                    @change="filterGames"
                  />
                  <span class="checkmark"></span>
                  <span class="category-icon">{{ getCategoryIcon(category.id) }}</span>
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-count">({{ getCategoryCount(category.id) }})</span>
                </label>
              </div>
            </div>
            
            <div class="filter-section">
              <h3 class="filter-title">折扣力度</h3>
              <div class="discount-filters">
                <label
                  v-for="discount in discountOptions"
                  :key="discount.value"
                  :class="['discount-item', { active: selectedDiscounts.includes(discount.value) }]"
                >
                  <input
                    type="checkbox"
                    :value="discount.value"
                    v-model="selectedDiscounts"
                    @change="filterGames"
                  />
                  <span class="checkmark"></span>
                  <span class="discount-badge" :style="{ background: discount.color }">
                    {{ discount.label }}
                  </span>
                </label>
              </div>
            </div>
            
            <div class="filter-section">
              <h3 class="filter-title">游戏标签</h3>
              <div class="tag-filters">
                <span
                  v-for="tag in popularTags"
                  :key="tag"
                  :class="['tag-item', { active: selectedTags.includes(tag) }]"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <div class="filter-section">
              <h3 class="filter-title">排序方式</h3>
              <div class="sort-options">
                <label
                  v-for="option in sortOptions"
                  :key="option.value"
                  :class="['sort-item', { active: sortBy === option.value }]"
                >
                  <input
                    type="radio"
                    name="sort"
                    :value="option.value"
                    v-model="sortBy"
                    @change="sortGames"
                  />
                  <span class="radio-mark"></span>
                  <span class="sort-label">{{ option.label }}</span>
                </label>
              </div>
            </div>
            
            <div class="filter-actions">
              <button class="filter-btn reset" @click="resetFilters">
                ↺ 重置筛选
              </button>
              <button class="filter-btn apply" @click="applyFilters">
                ✅ 应用筛选
              </button>
            </div>
          </div>
          
          <!-- 游戏列表 -->
          <div class="games-container">
            <!-- 搜索和排序栏 -->
            <div class="games-header">
              <div class="search-box">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索游戏..."
                  @input="filterGames"
                  @keyup.enter="searchGames"
                />
                <button class="search-btn" @click="searchGames">
                  🔍
                </button>
              </div>
              
              <div class="view-controls">
                <span class="results-count">{{ filteredGames.length }} 个结果</span>
                <div class="view-toggle">
                  <button
                    :class="['view-btn', { active: viewMode === 'grid' }]"
                    @click="viewMode = 'grid'"
                  >
                    ▦
                  </button>
                  <button
                    :class="['view-btn', { active: viewMode === 'list' }]"
                    @click="viewMode = 'list'"
                  >
                    ≡
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 游戏列表 -->
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>加载游戏中...</p>
            </div>
            
            <div v-else-if="filteredGames.length > 0" class="games-section">
              <!-- 网格视图 -->
              <div v-if="viewMode === 'grid'" class="games-grid-view">
                <GameCard
                  v-for="game in paginatedGames"
                  :key="game.id"
                  :game="game"
                  @buy="handleBuyGame"
                  @add-to-cart="handleAddToCart"
                  @quick-view="handleQuickView"
                />
              </div>
              
              <!-- 列表视图 -->
              <div v-else class="games-list-view">
                <div
                  v-for="game in paginatedGames"
                  :key="game.id"
                  class="game-list-item"
                  @click="viewGameDetail(game.id)"
                >
                  <div class="item-image">
                    <img :src="game.image" :alt="game.title" />
                    <div v-if="game.discount" class="item-discount">
                      {{ game.discount }}
                    </div>
                  </div>
                  
                  <div class="item-info">
                    <h3 class="item-title">{{ game.title }}</h3>
                    <p class="item-subtitle">{{ game.subtitle }}</p>
                    
                    <div class="item-tags">
                      <span v-for="tag in game.tags.slice(0, 4)" :key="tag" class="tag">
                        {{ tag }}
                      </span>
                    </div>
                    
                    <div class="item-meta">
                      <div class="rating">
                        <span class="stars">
                          <span
                            v-for="n in 5"
                            :key="n"
                            class="star"
                            :class="{ filled: n <= Math.round(game.rating) }"
                          >
                            ★
                          </span>
                        </span>
                        <span class="rating-value">{{ game.rating.toFixed(1) }}</span>
                      </div>
                      <div class="release-date">
                        📅 {{ formatDate(game.releaseDate) }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="item-price-section">
                    <div class="price-info">
                      <span v-if="game.originalPrice" class="original-price">
                        ¥{{ game.originalPrice.toFixed(2) }}
                      </span>
                      <span class="current-price">
                        ¥{{ game.price.toFixed(2) }}
                      </span>
                    </div>
                    
                    <div class="item-actions">
                      <button class="action-btn wishlist" @click.stop="addToWishlist(game)">
                        ❤️
                      </button>
                      <button class="action-btn cart" @click.stop="handleAddToCart(game)">
                        🛒
                      </button>
                      <button class="action-btn buy" @click.stop="handleBuyGame(game)">
                        购买
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 分页 -->
              <div class="pagination" v-if="totalPages > 1">
                <button
                  class="pagination-btn prev"
                  :disabled="currentPage === 1"
                  @click="prevPage"
                >
                  ← 上一页
                </button>
                
                <div class="pagination-pages">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    :class="['page-btn', { active: page === currentPage }]"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                  
                  <span v-if="showEllipsis" class="page-ellipsis">...</span>
                </div>
                
                <button
                  class="pagination-btn next"
                  :disabled="currentPage === totalPages"
                  @click="nextPage"
                >
                  下一页 →
                </button>
              </div>
            </div>
            
            <!-- 无结果 -->
            <div v-else class="no-results">
              <div class="no-results-icon">🎮</div>
              <h3 class="no-results-title">未找到相关游戏</h3>
              <p class="no-results-description">尝试调整筛选条件或搜索关键词</p>
              <button class="reset-filters-btn" @click="resetFilters">
                🔄 重置所有筛选
              </button>
            </div>
          </div>
        </div>
        
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
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { GAME_CATEGORIES, GAMES_DATA, SORT_OPTIONS } from '@/utils/constants'
import HeaderNav from '@/components/common/HeaderNav.vue'
import Footer from '@/components/common/Footer.vue'
import GameCard from '@/components/common/GameCard.vue'
import GameDetail from '@/components/common/GameDetail.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

// 数据
const allGames = GAMES_DATA

// 状态
const loading = ref(false)
const searchQuery = ref('')
const viewMode = ref('grid')
const showGameDetail = ref(false)
const selectedGame = ref(null)

// 筛选状态
const selectedCategories = ref([])
const selectedDiscounts = ref([])
const selectedTags = ref([])
const sortBy = ref('popular')

// 分页状态
const currentPage = ref(1)
const pageSize = ref(12)

// 计算属性
const totalGames = computed(() => allGames.length)

const discountedGames = computed(() => {
  return allGames.filter(game => game.discount).length
})

const newGames = computed(() => {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  return allGames.filter(game => {
    const releaseDate = new Date(game.releaseDate || 0)
    return releaseDate > threeMonthsAgo
  }).length
})

const categories = GAME_CATEGORIES

const discountOptions = [
  { value: '30', label: '-30%', color: '#ff6b6b' },
  { value: '40', label: '-40%', color: '#ffa502' },
  { value: '50', label: '-50%', color: '#2ed573' },
  { value: '60', label: '-60%', color: '#1e90ff' },
  { value: '70', label: '-70%', color: '#9b59b6' }
]

const popularTags = computed(() => {
  const tagCounts = {}
  allGames.forEach(game => {
    game.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag)
})

const sortOptions = SORT_OPTIONS

// 筛选游戏
const filteredGames = computed(() => {
  let games = [...allGames]
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    games = games.filter(game =>
      game.title.toLowerCase().includes(query) ||
      game.subtitle?.toLowerCase().includes(query) ||
      game.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 分类筛选
  if (selectedCategories.value.length > 0) {
    games = games.filter(game =>
      game.categories?.some(category => selectedCategories.value.includes(category))
    )
  }
  
  // 折扣筛选
  if (selectedDiscounts.value.length > 0) {
    games = games.filter(game => {
      if (!game.discount) return false
      const discountValue = parseInt(game.discount.replace('%', ''))
      return selectedDiscounts.value.some(selected => discountValue >= parseInt(selected))
    })
  }
  
  // 标签筛选
  if (selectedTags.value.length > 0) {
    games = games.filter(game =>
      game.tags?.some(tag => selectedTags.value.includes(tag))
    )
  }
  
  // 排序
  games = sortGamesList(games, sortBy.value)
  
  return games
})

// 分页计算
const totalPages = computed(() => {
  return Math.ceil(filteredGames.value.length / pageSize.value)
})

const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGames.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = start + maxVisible - 1
  
  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const showEllipsis = computed(() => {
  return totalPages.value > 5 && visiblePages.value[visiblePages.value.length - 1] < totalPages.value
})

// 方法
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
  return allGames.filter(game => 
    game.categories?.includes(categoryId)
  ).length
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
  filterGames()
}

const sortGamesList = (games, sortType) => {
  const sorted = [...games]
  
  switch (sortType) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'discount_desc':
      return sorted.sort((a, b) => {
        const discountA = a.discount ? parseInt(a.discount.replace('%', '')) : 0
        const discountB = b.discount ? parseInt(b.discount.replace('%', '')) : 0
        return discountB - discountA
      })
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.releaseDate || 0)
        const dateB = new Date(b.releaseDate || 0)
        return dateB - dateA
      })
    case 'popular':
      return sorted.sort((a, b) => {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        const playersA = a.players || 0
        const playersB = b.players || 0
        return (ratingB * 1000 + playersB) - (ratingA * 1000 + playersA)
      })
    default:
      return sorted
  }
}

const filterGames = () => {
  currentPage.value = 1
}

const sortGames = () => {
  filterGames()
}

const searchGames = () => {
  filterGames()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  selectedDiscounts.value = []
  selectedTags.value = []
  sortBy.value = 'popular'
  currentPage.value = 1
}

const applyFilters = () => {
  filterGames()
}

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// 游戏操作
const handleBuyGame = (game) => {
  console.log('购买游戏:', game.title)
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

const viewGameDetail = (gameId) => {
  router.push(`/games/${gameId}`)
}

const addToWishlist = (game) => {
  console.log('添加到愿望单:', game.title)
  // 这里可以调用添加到愿望单的API
  alert(`已将 ${game.title} 添加到愿望单`)
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

onMounted(() => {
  // 从URL参数初始化
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  
  if (route.query.category) {
    selectedCategories.value = [route.query.category]
  }
  
  if (route.query.tag) {
    selectedTags.value = [route.query.tag]
  }
  
  // 加载完成后滚动到顶部
  window.scrollTo(0, 0)
})
</script>

<style scoped lang="scss">
.game-list-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.game-list-main {
  flex: 1;
  padding: 40px 0;
  background: linear-gradient(135deg, #0f111a 0%, #1a1d29 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
  
  .header-content {
    .page-title {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(45deg, #1a73e8, #ff4757);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    
    .page-subtitle {
      font-size: 18px;
      color: #b0b3c1;
    }
  }
  
  .header-stats {
    display: flex;
    gap: 24px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 16px;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: white;
      }
      
      .stat-label {
        font-size: 14px;
        color: #8a8d9b;
        margin-top: 4px;
      }
    }
  }
}

.game-list-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.sidebar-filters {
  background: #2a2d3a;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 100px;
  
  @media (max-width: 1024px) {
    position: static;
    margin-bottom: 24px;
  }
}

.filter-section {
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .filter-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
    color: white;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
  
  .category-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    &.active {
      background: rgba(26, 115, 232, 0.1);
      
      .checkmark {
        background: #1a73e8;
        border-color: #1a73e8;
        
        &:after {
          display: block;
        }
      }
    }
    
    input {
      display: none;
    }
    
    .checkmark {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      position: relative;
      
      &:after {
        content: "✓";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 10px;
        display: none;
      }
    }
    
    .category-icon {
      font-size: 16px;
      width: 24px;
      text-align: center;
    }
    
    .category-name {
      flex: 1;
      font-size: 14px;
      color: white;
    }
    
    .category-count {
      font-size: 12px;
      color: #8a8d9b;
    }
  }
}

.discount-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .discount-item {
    position: relative;
    cursor: pointer;
    
    &.active {
      .discount-badge {
        border-color: #1a73e8;
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
      }
    }
    
    input {
      display: none;
      
      &:checked + .checkmark {
        opacity: 1;
      }
    }
    
    .checkmark {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 16px;
      height: 16px;
      background: #1a73e8;
      border: 2px solid #2a2d3a;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 2;
      
      &:after {
        content: "✓";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 10px;
      }
    }
    
    .discount-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: white;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }
  }
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .tag-item {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    font-size: 12px;
    color: #b0b3c1;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    &.active {
      background: rgba(26, 115, 232, 0.2);
      border-color: #1a73e8;
      color: #1a73e8;
    }
  }
}

.sort-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .sort-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    &.active {
      background: rgba(26, 115, 232, 0.1);
      
      .radio-mark {
        border-color: #1a73e8;
        
        &:after {
          background: #1a73e8;
        }
      }
    }
    
    input {
      display: none;
    }
    
    .radio-mark {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      position: relative;
      
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background: transparent;
        border-radius: 50%;
        transition: background 0.3s ease;
      }
    }
    
    .sort-label {
      font-size: 14px;
      color: white;
    }
  }
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  
  .filter-btn {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.reset {
      background: rgba(255, 71, 87, 0.1);
      color: #ff4757;
      border: 1px solid rgba(255, 71, 87, 0.2);
      
      &:hover {
        background: rgba(255, 71, 87, 0.2);
      }
    }
    
    &.apply {
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
      }
    }
  }
}

.games-container {
  background: #2a2d3a;
  border-radius: 16px;
  padding: 24px;
}

.games-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
  
  .search-box {
    flex: 1;
    min-width: 300px;
    display: flex;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    overflow: hidden;
    
    input {
      flex: 1;
      padding: 12px 16px;
      background: transparent;
      border: none;
      color: white;
      font-size: 14px;
      
      &:focus {
        outline: none;
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    
    .search-btn {
      padding: 0 20px;
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(45deg, #0d47a1, #1a73e8);
      }
    }
  }
  
  .view-controls {
    display: flex;
    align-items: center;
    gap: 20px;
    
    .results-count {
      font-size: 14px;
      color: #b0b3c1;
    }
    
    .view-toggle {
      display: flex;
      gap: 4px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 4px;
      
      .view-btn {
        width: 40px;
        height: 40px;
        background: transparent;
        border: none;
        border-radius: 6px;
        color: #8a8d9b;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        &.active {
          background: rgba(26, 115, 232, 0.2);
          color: #1a73e8;
        }
      }
    }
  }
}

.loading-state {
  text-align: center;
  padding: 80px 0;
  
  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(26, 115, 232, 0.1);
    border-top-color: #1a73e8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
  
  p {
    color: #b0b3c1;
    font-size: 16px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.games-grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.games-list-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
  
  .game-list-item {
    display: grid;
    grid-template-columns: 120px 1fr 200px;
    gap: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    @media (max-width: 768px) {
      grid-template-columns: 100px 1fr;
      grid-template-rows: auto auto;
      
      .item-price-section {
        grid-column: 1 / -1;
        grid-row: 2;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }
    
    .item-image {
      position: relative;
      
      img {
        width: 100%;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
      }
      
      .item-discount {
        position: absolute;
        top: 8px;
        left: 8px;
        background: #ff6b6b;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }
    }
    
    .item-info {
      .item-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 4px;
        color: white;
        line-height: 1.3;
      }
      
      .item-subtitle {
        font-size: 14px;
        color: #b0b3c1;
        margin-bottom: 12px;
      }
      
      .item-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
        
        .tag {
          font-size: 11px;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #8a8d9b;
        }
      }
      
      .item-meta {
        display: flex;
        gap: 16px;
        
        .rating {
          display: flex;
          align-items: center;
          gap: 6px;
          
          .stars {
            .star {
              color: #8a8d9b;
              font-size: 14px;
              
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
        
        .release-date {
          font-size: 12px;
          color: #8a8d9b;
        }
      }
    }
    
    .item-price-section {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      
      .price-info {
        text-align: right;
        
        .original-price {
          display: block;
          font-size: 14px;
          color: #8a8d9b;
          text-decoration: line-through;
          margin-bottom: 4px;
        }
        
        .current-price {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }
      }
      
      .item-actions {
        display: flex;
        gap: 8px;
        
        .action-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &.wishlist {
            background: rgba(255, 71, 87, 0.1);
            color: #ff4757;
            
            &:hover {
              background: rgba(255, 71, 87, 0.2);
            }
          }
          
          &.cart {
            background: rgba(26, 115, 232, 0.1);
            color: #1a73e8;
            
            &:hover {
              background: rgba(26, 115, 232, 0.2);
            }
          }
          
          &.buy {
            background: linear-gradient(45deg, #1a73e8, #0d47a1);
            color: white;
            
            &:hover {
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .pagination-btn {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .pagination-pages {
    display: flex;
    gap: 8px;
    
    .page-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      &.active {
        background: linear-gradient(45deg, #1a73e8, #0d47a1);
        border-color: transparent;
      }
    }
    
    .page-ellipsis {
      display: flex;
      align-items: center;
      color: #8a8d9b;
    }
  }
}

.no-results {
  text-align: center;
  padding: 80px 0;
  
  .no-results-icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.5;
  }
  
  .no-results-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
    color: white;
  }
  
  .no-results-description {
    font-size: 16px;
    color: #b0b3c1;
    margin-bottom: 32px;
  }
  
  .reset-filters-btn {
    background: linear-gradient(45deg, #1a73e8, #0d47a1);
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
    }
  }
}

// 游戏详情弹窗 - 新增图片显示修复
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

@media (max-width: 1024px) {
  .page-header {
    .header-stats {
      width: 100%;
      justify-content: space-around;
    }
  }
  
  .games-header {
    .search-box {
      min-width: 100%;
    }
  }
  
  .games-grid-view {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
    
    .pagination-pages {
      order: -1;
    }
  }
  
  // 平板端调整游戏详情弹窗
  :deep(.game-detail-modal) {
    .el-dialog {
      width: 95% !important;
    }
    
    .el-dialog__body .game-detail .game-image-container {
      height: 350px;
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
  
  .games-grid-view {
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
  
  // 移动端调整游戏详情弹窗
  :deep(.game-detail-modal) {
    .el-dialog {
      width: 95% !important;
      margin: 10px !important;
    }
    
    .el-dialog__body .game-detail .game-image-container {
      height: 300px;
    }
  }
}

@media (max-width: 480px) {
  .games-grid-view {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  // 小屏幕调整
  :deep(.game-detail-modal) {
    .el-dialog__body .game-detail .game-image-container {
      height: 250px;
    }
  }
}
</style>