<template>
  <header class="header-nav">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo" @click="goHome">
          <img src="/images/icons/logo.png" alt="游戏商店" class="logo-img" />
          <span class="logo-text">游戏商店</span>
        </div>

        <!-- 搜索栏 -->
        <div class="search-container">
          <div class="search-box">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索游戏、分类、标签..."
              class="search-input"
              @keyup.enter="handleSearch"
              @focus="showSearchSuggestions = true"
              @blur="onSearchBlur"
            />
            <button class="search-button" @click="handleSearch">
              🔍
            </button>
            
            <!-- 搜索建议 -->
            <div v-if="showSearchSuggestions && searchKeyword" class="search-suggestions">
              <div 
                v-for="suggestion in searchSuggestions" 
                :key="suggestion.id"
                class="suggestion-item"
                @mousedown="selectSuggestion(suggestion)"
              >
                <div class="suggestion-content">
                  <span class="suggestion-title">{{ suggestion.title }}</span>
                  <span class="suggestion-price">¥{{ suggestion.price.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <router-link to="/" class="nav-link" exact-active-class="active">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">首页</span>
          </router-link>
          
          <router-link to="/games" class="nav-link" active-class="active">
            <span class="nav-icon">🎮</span>
            <span class="nav-text">游戏商店</span>
          </router-link>
          
          <div class="nav-link categories-link" 
               @mouseenter="openCategories" 
               @mouseleave="closeCategories">
            <span class="nav-icon">📂</span>
            <span class="nav-text">分类</span>
            <span class="dropdown-arrow">▼</span>
            
            <!-- 分类下拉菜单 -->
            <div v-if="showCategories" 
                 class="categories-dropdown"
                 @mouseenter="clearCategoriesClose"
                 @mouseleave="closeCategories">
              <div class="dropdown-content">
                <div 
                  v-for="category in gameCategories" 
                  :key="category.id"
                  class="category-item"
                  @click="filterByCategory(category.id)"
                >
                  <span class="category-icon">{{ getCategoryIcon(category.id) }}</span>
                  <span class="category-name">{{ category.name }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <router-link to="/cart" class="nav-link cart-link" active-class="active">
            <span class="nav-icon">🛒</span>
            <span class="nav-text">购物车</span>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
        </nav>

        <!-- 用户操作 -->
        <div class="user-actions">
          <template v-if="isAuthenticated">
            <div class="user-dropdown" 
                 @mouseenter="openUserMenu" 
                 @mouseleave="closeUserMenu">
              <div class="user-avatar">
                <img :src="userAvatar" alt="用户头像" />
              </div>
              <span class="username">{{ userName }}</span>
              
              <!-- 用户菜单 -->
              <div v-if="showUserMenu" 
                   class="user-menu"
                   @mouseenter="clearUserMenuClose"
                   @mouseleave="closeUserMenu">
                <div class="menu-item" @click="goToProfile">
                  <span class="menu-icon">👤</span>
                  <span>个人中心</span>
                </div>
                <div class="menu-item" @click="goToLibrary">
                  <span class="menu-icon">📚</span>
                  <span>游戏库</span>
                </div>
                <div class="menu-item" @click="goToWishlist">
                  <span class="menu-icon">❤️</span>
                  <span>愿望单</span>
                </div>
                <div class="menu-item" @click="goToSettings">
                  <span class="menu-icon">⚙️</span>
                  <span>设置</span>
                </div>
                <div class="menu-divider"></div>
                <div class="menu-item logout" @click="handleLogout">
                  <span class="menu-icon">🚪</span>
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </template>
          
          <template v-else>
            <button class="auth-btn login-btn" @click="goToLogin">
              登录
            </button>
            <button class="auth-btn register-btn" @click="goToRegister">
              注册
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { GAME_CATEGORIES, GAMES_DATA } from '@/utils/constants'

const router = useRouter()
const store = useStore()

const searchKeyword = ref('')
const showSearchSuggestions = ref(false)
const showCategories = ref(false)
const showUserMenu = ref(false)

// 添加延迟关闭的定时器
const categoriesTimeout = ref(null)
const userMenuTimeout = ref(null)

// 计算属性
const isAuthenticated = computed(() => store.isAuthenticated)
const cartCount = computed(() => store.cartCount)
const userName = computed(() => store.user?.username || '用户')
const userAvatar = computed(() => store.user?.avatar || '/images/avatars/default-avatar.png')

const gameCategories = GAME_CATEGORIES

// 搜索建议
const searchSuggestions = computed(() => {
  if (!searchKeyword.value.trim()) return []
  const keyword = searchKeyword.value.toLowerCase()
  return GAMES_DATA
    .filter(game => 
      game.title.toLowerCase().includes(keyword) || 
      game.tags?.some(tag => tag.toLowerCase().includes(keyword))
    )
    .slice(0, 5)
})

// 搜索相关事件
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/games?search=${encodeURIComponent(searchKeyword.value)}`)
    showSearchSuggestions.value = false
  }
}

const selectSuggestion = (suggestion) => {
  router.push(`/games/${suggestion.id}`)
  searchKeyword.value = suggestion.title
  showSearchSuggestions.value = false
}

const onSearchBlur = () => {
  setTimeout(() => {
    showSearchSuggestions.value = false
  }, 200)
}

// 分类菜单相关事件
const openCategories = () => {
  clearTimeout(categoriesTimeout.value)
  showCategories.value = true
}

const closeCategories = () => {
  categoriesTimeout.value = setTimeout(() => {
    showCategories.value = false
  }, 300) // 300ms延迟关闭
}

const clearCategoriesClose = () => {
  clearTimeout(categoriesTimeout.value)
}

// 用户菜单相关事件
const openUserMenu = () => {
  clearTimeout(userMenuTimeout.value)
  showUserMenu.value = true
}

const closeUserMenu = () => {
  userMenuTimeout.value = setTimeout(() => {
    showUserMenu.value = false
  }, 300) // 300ms延迟关闭，给用户足够时间移动到菜单
}

const clearUserMenuClose = () => {
  clearTimeout(userMenuTimeout.value)
}

// 其他功能
const goHome = () => {
  router.push('/')
}

const filterByCategory = (categoryId) => {
  router.push(`/games?category=${categoryId}`)
  showCategories.value = false
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

// 用户操作
const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const goToProfile = () => {
  router.push('/profile')
  showUserMenu.value = false
}

const goToLibrary = () => {
  router.push('/profile?tab=library')
  showUserMenu.value = false
}

const goToWishlist = () => {
  router.push('/profile?tab=wishlist')
  showUserMenu.value = false
}

const goToSettings = () => {
  router.push('/profile?tab=settings')
  showUserMenu.value = false
}

const handleLogout = () => {
  store.setToken(null)
  store.setUser(null)
  router.push('/login')
  showUserMenu.value = false
}

onMounted(() => {
  // 点击外部关闭下拉菜单
  const handleClickOutside = (e) => {
    if (!e.target.closest('.categories-link')) {
      showCategories.value = false
    }
    if (!e.target.closest('.user-dropdown')) {
      showUserMenu.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  // 清理定时器
  onUnmounted(() => {
    clearTimeout(categoriesTimeout.value)
    clearTimeout(userMenuTimeout.value)
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped lang="scss">
.header-nav {
  background: rgba(26, 29, 41, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 12px 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  
  @media (max-width: 1024px) {
    gap: 20px;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;
  
  .logo-img {
    height: 40px;
    width: auto;
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: 800;
    background: linear-gradient(45deg, #1a73e8, #ff4757);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.search-container {
  flex: 1;
  max-width: 500px;
  
  .search-box {
    position: relative;
    
    .search-input {
      width: 100%;
      padding: 12px 20px;
      padding-right: 50px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      color: white;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #1a73e8;
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    
    .search-button {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
    }
    
    .search-suggestions {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: #2a2d3a;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      
      .suggestion-item {
        padding: 12px 20px;
        cursor: pointer;
        transition: background 0.2s ease;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .suggestion-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .suggestion-title {
            font-size: 14px;
            color: white;
          }
          
          .suggestion-price {
            font-size: 14px;
            color: #1a73e8;
            font-weight: 600;
          }
        }
      }
    }
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    color: #b0b3c1;
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    &.active {
      background: linear-gradient(45deg, rgba(26, 115, 232, 0.2), rgba(255, 71, 87, 0.2));
      color: white;
      
      .nav-icon {
        color: #1a73e8;
      }
    }
    
    .nav-icon {
      font-size: 18px;
    }
    
    .nav-text {
      font-size: 14px;
      font-weight: 500;
    }
  }
  
  .categories-link {
    position: relative;
    cursor: pointer;
    
    .dropdown-arrow {
      font-size: 10px;
      margin-left: 2px;
      transition: transform 0.3s ease;
    }
    
    &:hover .dropdown-arrow {
      transform: rotate(180deg);
    }
    
    .categories-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 200px;
      background: #2a2d3a;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      margin-top: 8px;
      
      /* 添加悬停连接区域 */
      &::before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 20px;
        background: transparent;
      }
      
      .dropdown-content {
        padding: 8px 0;
        
        .category-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .category-icon {
            font-size: 18px;
            width: 24px;
            text-align: center;
          }
          
          .category-name {
            font-size: 14px;
            color: white;
          }
        }
      }
    }
  }
  
  .cart-link {
    position: relative;
    
    .cart-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #ff4757;
      color: white;
      font-size: 11px;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }
  }
}

.user-actions {
  flex-shrink: 0;
  
  .auth-btn {
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    
    &.login-btn {
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-right: 10px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: white;
      }
    }
    
    &.register-btn {
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
      }
    }
  }
  
  .user-dropdown {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    
    /* 创建悬停连接区域 - 关键修复 */
    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 20px; /* 增大悬停区域高度 */
      background: transparent;
      z-index: 999; /* 确保在菜单上方 */
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .username {
      font-size: 14px;
      font-weight: 500;
      color: white;
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .user-menu {
      position: absolute;
      top: 100%;
      right: 0;
      width: 200px;
      background: #2a2d3a;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      margin-top: 8px;
      padding: 8px 0;
      
      /* 菜单顶部连接区域 */
      &::before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 20px;
        background: transparent;
      }
      
      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 20px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        &.logout {
          color: #ff4757;
          
          &:hover {
            background: rgba(255, 71, 87, 0.1);
          }
        }
        
        .menu-icon {
          font-size: 16px;
          width: 24px;
          text-align: center;
        }
      }
      
      .menu-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 8px 0;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }
  
  .logo {
    order: 1;
  }
  
  .user-actions {
    order: 2;
  }
  
  .search-container {
    order: 3;
    width: 100%;
    max-width: none;
    margin-top: 12px;
  }
}
</style>