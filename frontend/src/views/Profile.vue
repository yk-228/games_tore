<template>
  <div class="profile-page">
    <HeaderNav />
    
    <main class="profile-main">
      <div class="container">
        <div class="profile-header">
          <div class="user-card">
            <div class="user-avatar">
              <img :src="user.avatar" :alt="user.username" />
              <button class="edit-avatar-btn" @click="changeAvatar">
                ✏️
              </button>
            </div>
            <div class="user-info">
              <h1 class="username">{{ user.username }}</h1>
              <p class="user-email">{{ user.email }}</p>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ user.gamesCount || 0 }}</span>
                  <span class="stat-label">拥有游戏</span>
                </div>
              </div>
            </div>
            <div class="user-actions">
              <button class="action-btn edit-profile" @click="editProfile">
                ✏️ 编辑资料
              </button>
              <button class="action-btn settings" @click="goToSettings">
                ⚙️ 设置
              </button>
            </div>
          </div>
        </div>
        
        <div class="profile-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-text">{{ tab.name }}</span>
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 我的游戏库 -->
          <div v-if="activeTab === 'library'" class="library-section">
            <div class="section-header">
              <h2 class="section-title">我的游戏库</h2>
              <div class="library-filters">
                <select v-model="libraryFilter" class="filter-select">
                  <option value="all">全部游戏</option>
                  <option value="installed">已安装</option>
                  <option value="recent">最近游玩</option>
                  <option value="favorite">收藏</option>
                </select>
                <input
                  v-model="librarySearch"
                  type="text"
                  placeholder="搜索游戏..."
                  class="search-input"
                />
              </div>
            </div>
            
            <div class="games-grid">
              <div
                v-for="game in libraryGames"
                :key="game.id"
                class="library-game"
                @click="playGame(game.id)"
              >
                <img :src="game.image" :alt="game.title" class="game-cover" />
                <div class="game-overlay">
                  <div class="game-info">
                    <h3 class="game-title">{{ game.title }}</h3>
                    <div class="game-meta">
                      <span class="last-played">{{ game.lastPlayed }}</span>
                    </div>
                  </div>
                  <button class="play-btn" @click.stop="playGame(game.id)">
                    ▶ 开始游戏
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="libraryGames.length === 0" class="empty-library">
              <div class="empty-icon">🎮</div>
              <h3 class="empty-title">游戏库空空如也</h3>
              <p class="empty-description">快去商店购买一些游戏吧！</p>
              <router-link to="/games" class="browse-btn">
                浏览游戏
              </router-link>
            </div>
          </div>
          
          <!-- 愿望单 -->
          <div v-else-if="activeTab === 'wishlist'" class="wishlist-section">
            <div class="section-header">
              <h2 class="section-title">我的愿望单</h2>
              <div class="wishlist-stats">
                <span>{{ wishlistGames.length }} 个游戏</span>
              </div>
            </div>
            
            <div class="wishlist-grid">
              <div
                v-for="game in wishlistGames"
                :key="game.id"
                class="wishlist-game"
              >
                <img :src="game.image" :alt="game.title" class="game-cover" />
                <div class="game-info">
                  <h3 class="game-title">{{ game.title }}</h3>
                  <div class="game-price">
                    <span class="current-price">¥{{ game.price.toFixed(2) }}</span>
                    <span v-if="game.originalPrice" class="original-price">
                      ¥{{ game.originalPrice.toFixed(2) }}
                    </span>
                    <span v-if="game.discount" class="discount-tag">
                      {{ game.discount }}
                    </span>
                  </div>
                </div>
                <div class="game-actions">
                  <button class="action-btn buy-now" @click="buyGame(game.id)">
                    立即购买
                  </button>
                  <button class="action-btn remove" @click="removeFromWishlist(game.id)">
                    ❌ 移除
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="wishlistGames.length === 0" class="empty-wishlist">
              <div class="empty-icon">⭐</div>
              <h3 class="empty-title">愿望单是空的</h3>
              <p class="empty-description">把喜欢的游戏加入愿望单吧！</p>
              <router-link to="/games" class="browse-btn">
                浏览游戏
              </router-link>
            </div>
          </div>
          
          <!-- 购买历史 -->
          <div v-else-if="activeTab === 'history'" class="history-section">
            <div class="section-header">
              <h2 class="section-title">购买历史</h2>
              <div class="history-filter">
                <select v-model="historyFilter" class="filter-select">
                  <option value="all">全部订单</option>
                  <option value="month">本月</option>
                  <option value="year">今年</option>
                </select>
              </div>
            </div>
            
            <div class="history-list">
              <div
                v-for="order in purchaseHistory"
                :key="order.id"
                class="history-item"
              >
                <div class="order-header">
                  <div class="order-info">
                    <span class="order-id">订单号: {{ order.id }}</span>
                    <span class="order-date">{{ order.date }}</span>
                  </div>
                  <div class="order-status" :class="order.status">
                    {{ getStatusText(order.status) }}
                  </div>
                </div>
                
                <div class="order-games">
                  <div
                    v-for="game in order.games"
                    :key="game.id"
                    class="order-game"
                  >
                    <img :src="game.image" :alt="game.title" />
                    <div class="game-details">
                      <h4>{{ game.title }}</h4>
                      <div class="game-price">
                        ¥{{ game.price.toFixed(2) }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="order-footer">
                  <div class="order-total">
                    总计: ¥{{ order.total.toFixed(2) }}
                  </div>
                  <button class="view-details-btn" @click="viewOrderDetails(order.id)">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="purchaseHistory.length === 0" class="empty-history">
              <div class="empty-icon">📜</div>
              <h3 class="empty-title">暂无购买记录</h3>
              <p class="empty-description">您还没有购买过任何游戏</p>
            </div>
          </div>
          

          
          <!-- 设置 -->
          <div v-else-if="activeTab === 'settings'" class="settings-section">
            <div class="section-header">
              <h2 class="section-title">账户设置</h2>
            </div>
            
            <div class="settings-grid">
              <!-- 账户设置 -->
              <div class="settings-card">
                <h3 class="card-title">账户信息</h3>
                <form class="settings-form" @submit.prevent="updateProfile">
                  <div class="form-group">
                    <label>用户名</label>
                    <input v-model="editForm.username" type="text" />
                  </div>
                  <div class="form-group">
                    <label>邮箱</label>
                    <input v-model="editForm.email" type="email" />
                  </div>
                  <div class="form-group">
                    <label>手机号</label>
                    <input v-model="editForm.phone" type="tel" />
                  </div>
                  <button type="submit" class="save-btn">
                    保存更改
                  </button>
                </form>
              </div>
              
              <!-- 安全设置 -->
              <div class="settings-card">
                <h3 class="card-title">安全设置</h3>
                <div class="security-options">
                  <div class="security-item">
                    <div class="item-info">
                      <h4>修改密码</h4>
                      <p>定期修改密码保证账户安全</p>
                    </div>
                    <button class="change-btn" @click="changePassword">
                      修改
                    </button>
                  </div>
                  <div class="security-item">
                    <div class="item-info">
                      <h4>两步验证</h4>
                      <p>为账户增加额外的安全保护</p>
                    </div>
                    <label class="switch">
                      <input v-model="twoFactorAuth" type="checkbox" />
                      <span class="slider"></span>
                    </label>
                  </div>
                  <div class="security-item">
                    <div class="item-info">
                      <h4>登录设备管理</h4>
                      <p>管理已登录的设备</p>
                    </div>
                    <button class="manage-btn" @click="manageDevices">
                      管理
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 隐私设置 -->
              <div class="settings-card">
                <h3 class="card-title">隐私设置</h3>
                <div class="privacy-options">
                  <div class="privacy-item">
                    <label>游戏库可见性</label>
                    <select v-model="privacySettings.libraryVisibility">
                      <option value="public">公开</option>
                      <option value="private">私密</option>
                    </select>
                  </div>
                  <div class="privacy-item">
                    <label>在线状态</label>
                    <select v-model="privacySettings.onlineStatus">
                      <option value="visible">显示在线状态</option>
                      <option value="invisible">隐身</option>
                    </select>
                  </div>

                </div>
              </div>
              
              <!-- 通知设置 -->
              <div class="settings-card">
                <h3 class="card-title">通知设置</h3>
                <div class="notification-options">
                  <div class="notification-item">
                    <label>促销通知</label>
                    <label class="switch">
                      <input v-model="notificationSettings.promotions" type="checkbox" />
                      <span class="slider"></span>
                    </label>
                  </div>

                  <div class="notification-item">
                    <label>游戏更新</label>
                    <label class="switch">
                      <input v-model="notificationSettings.gameUpdates" type="checkbox" />
                      <span class="slider"></span>
                    </label>
                  </div>
                  <div class="notification-item">
                    <label>新游戏发布</label>
                    <label class="switch">
                      <input v-model="notificationSettings.newGames" type="checkbox" />
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderNav from '@/components/common/HeaderNav.vue'
import Footer from '@/components/common/Footer.vue'

const router = useRouter()

// 用户数据
const user = reactive({
  id: 1,
  username: '游戏玩家',
  email: 'player@example.com',
  avatar: '/images/avatars/default-avatar.png',
  gamesCount: 15
})

// 标签页
const tabs = [
  { id: 'library', name: '游戏库', icon: '🎮' },
  { id: 'wishlist', name: '愿望单', icon: '⭐' },
  { id: 'history', name: '购买历史', icon: '📜' },

  { id: 'settings', name: '设置', icon: '⚙️' }
]

const activeTab = ref('library')

// 游戏库相关
const libraryFilter = ref('all')
const librarySearch = ref('')
const libraryGames = ref([
  {
    id: 1,
    title: 'Cyberpunk 2077',
    image: '/images/games/cyberpunk-2077.jpg',
    lastPlayed: '2天前'
  },
  {
    id: 2,
    title: 'Elden Ring',
    image: '/images/games/elden-ring.jpg',
    lastPlayed: '昨天'
  },
  {
    id: 3,
    title: 'God of War',
    image: '/images/games/god-of-war.jpg',
    lastPlayed: '3天前'
  },
  {
    id: 4,
    title: 'Minecraft',
    image: '/images/games/minecraft.jpg',
    lastPlayed: '1小时前'
  }
])

// 愿望单相关
const wishlistGames = ref([
  {
    id: 5,
    title: 'STARFIELD',
    image: '/images/games/starfield.jpg',
    price: 178.80,
    originalPrice: 296.00,
    discount: '-40%'
  },
  {
    id: 6,
    title: 'Hogwarts Legacy',
    image: '/images/games/hogwarts-legacy.jpg',
    price: 208.60,
    originalPrice: 298.00,
    discount: '-30%'
  },
  {
    id: 7,
    title: 'FIFA 23',
    image: '/images/games/fifa23.jpg',
    price: 124.00,
    originalPrice: 248.00,
    discount: '-50%'
  }
])

// 购买历史相关
const historyFilter = ref('all')
const purchaseHistory = ref([
  {
    id: 'ORD20231215001',
    date: '2023-12-15',
    status: 'completed',
    total: 149.00,
    games: [
      {
        id: 1,
        title: 'Cyberpunk 2077',
        image: '/images/games/cyberpunk-2077.jpg',
        price: 149.00
      }
    ]
  },
  {
    id: 'ORD20231210002',
    date: '2023-12-10',
    status: 'completed',
    total: 327.10,
    games: [
      {
        id: 2,
        title: 'Elden Ring',
        image: '/images/games/elden-ring.jpg',
        price: 208.60
      },
      {
        id: 3,
        title: 'God of War',
        image: '/images/games/god-of-war.jpg',
        price: 118.50
      }
    ]
  }
])

// 好友相关


// 设置相关
const editForm = reactive({
  username: user.username,
  email: user.email,
  phone: ''
})

const twoFactorAuth = ref(false)
const privacySettings = reactive({
  libraryVisibility: 'public',
  onlineStatus: 'visible',
  showPlayTime: true
})

const notificationSettings = reactive({
  promotions: true,

  gameUpdates: true,
  newGames: false
})

// 方法
const editProfile = () => {
  // 打开编辑资料模态框
  activeTab.value = 'settings'
}

const goToSettings = () => {
  activeTab.value = 'settings'
}

const changeAvatar = () => {
  // 实现更改头像逻辑
  alert('选择新头像')
}

const updateProfile = () => {
  user.username = editForm.username
  user.email = editForm.email
  alert('资料已更新')
}

const playGame = (gameId) => {
  console.log('开始游戏:', gameId)
  // 这里可以跳转到游戏启动页面
}

const buyGame = (gameId) => {
  router.push(`/games/${gameId}`)
}

const removeFromWishlist = (gameId) => {
  const index = wishlistGames.value.findIndex(game => game.id === gameId)
  if (index !== -1) {
    wishlistGames.value.splice(index, 1)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    pending: '处理中',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const viewOrderDetails = (orderId) => {
  console.log('查看订单详情:', orderId)
  // 这里可以打开订单详情模态框
}



const changePassword = () => {
  const newPassword = prompt('请输入新密码:')
  if (newPassword) {
    alert('密码已更新')
  }
}

const manageDevices = () => {
  // 打开设备管理页面
  console.log('管理设备')
}

onMounted(() => {
  // 加载用户数据
  // 这里可以调用API获取真实的用户数据
})
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.profile-main {
  flex: 1;
  padding: 40px 0;
  background: linear-gradient(135deg, #0f111a 0%, #1a1d29 100%);
}

.profile-header {
  margin-bottom: 40px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 40px;
  background: #2a2d3a;
  border-radius: 20px;
  padding: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
}

.user-avatar {
  position: relative;
  
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #1a73e8;
  }
  
  .edit-avatar-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 36px;
    height: 36px;
    background: #1a73e8;
    border: 2px solid #2a2d3a;
    border-radius: 50%;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #0d47a1;
      transform: scale(1.1);
    }
  }
}

.user-info {
  flex: 1;
  
  .username {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
    color: white;
  }
  
  .user-email {
    font-size: 16px;
    color: #b0b3c1;
    margin-bottom: 24px;
  }
  
  .user-stats {
    display: flex;
    gap: 40px;
    
    @media (max-width: 768px) {
      justify-content: center;
      gap: 30px;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #1a73e8;
      }
      
      .stat-label {
        font-size: 14px;
        color: #8a8d9b;
        margin-top: 4px;
      }
    }
  }
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .action-btn {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &.edit-profile {
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
      }
    }
    
    &.settings {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.profile-tabs {
  display: flex;
  gap: 4px;
  background: #2a2d3a;
  border-radius: 12px;
  padding: 8px;
  margin-bottom: 40px;
  overflow-x: auto;
  
  .tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 24px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #b0b3c1;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    
    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    
    &.active {
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      color: white;
    }
    
    .tab-icon {
      font-size: 18px;
    }
  }
}

.tab-content {
  min-height: 400px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: white;
  }
  
  .library-filters {
    display: flex;
    gap: 12px;
    
    .filter-select {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: #1a73e8;
      }
    }
    
    .search-input {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
      font-size: 14px;
      min-width: 200px;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      &:focus {
        outline: none;
        border-color: #1a73e8;
      }
    }
  }
}

.library-section {
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .library-game {
    position: relative;
    background: #2a2d3a;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    height: 200px;
    
    &:hover {
      .game-overlay {
        opacity: 1;
      }
    }
    
    .game-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .game-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(0, 0, 0, 0.6) 50%,
        rgba(0, 0, 0, 0.8) 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;
      
      .game-info {
        .game-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          color: white;
        }
        
        .game-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #b0b3c1;
        }
      }
      
      .play-btn {
        align-self: flex-start;
        background: linear-gradient(45deg, #1a73e8, #0d47a1);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
        }
      }
    }
  }
}

.wishlist-section {
  .wishlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }
  
  .wishlist-game {
    display: grid;
    grid-template-columns: 100px 1fr auto;
    align-items: center;
    gap: 20px;
    background: #2a2d3a;
    border-radius: 12px;
    padding: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 80px 1fr;
      grid-template-rows: auto auto;
      
      .game-actions {
        grid-column: 1 / -1;
        grid-row: 2;
        justify-self: end;
      }
    }
    
    .game-cover {
      width: 100px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .game-info {
      .game-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: white;
      }
      
      .game-price {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .current-price {
          font-size: 18px;
          font-weight: 700;
          color: #1a73e8;
        }
        
        .original-price {
          font-size: 14px;
          color: #8a8d9b;
          text-decoration: line-through;
        }
        
        .discount-tag {
          background: #ff6b6b;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
      }
    }
    
    .game-actions {
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
        
        &.buy-now {
          background: linear-gradient(45deg, #1a73e8, #0d47a1);
          color: white;
          
          &:hover {
            transform: translateY(-2px);
          }
        }
        
        &.remove {
          background: rgba(255, 71, 87, 0.1);
          color: #ff4757;
          
          &:hover {
            background: rgba(255, 71, 87, 0.2);
          }
        }
      }
    }
  }
}

.history-section {
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .history-item {
    background: #2a2d3a;
    border-radius: 12px;
    padding: 24px;
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .order-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .order-id {
          font-size: 16px;
          font-weight: 600;
          color: white;
        }
        
        .order-date {
          font-size: 14px;
          color: #b0b3c1;
        }
      }
      
      .order-status {
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        
        &.completed {
          background: rgba(46, 213, 115, 0.1);
          color: #2ed573;
        }
        
        &.pending {
          background: rgba(255, 165, 2, 0.1);
          color: #ffa502;
        }
        
        &.cancelled {
          background: rgba(255, 71, 87, 0.1);
          color: #ff4757;
        }
      }
    }
    
    .order-games {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
      
      .order-game {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        
        img {
          width: 60px;
          height: 40px;
          border-radius: 6px;
          object-fit: cover;
        }
        
        .game-details {
          flex: 1;
          
          h4 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
            color: white;
          }
          
          .game-price {
            font-size: 14px;
            color: #1a73e8;
            font-weight: 600;
          }
        }
      }
    }
    
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      
      .order-total {
        font-size: 18px;
        font-weight: 700;
        color: white;
      }
      
      .view-details-btn {
        background: rgba(26, 115, 232, 0.1);
        color: #1a73e8;
        border: 1px solid rgba(26, 115, 232, 0.3);
        padding: 8px 20px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(26, 115, 232, 0.2);
        }
      }
    }
  }
}


  .friend-search {
    display: flex;
    gap: 12px;
    
    .search-input {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
      font-size: 14px;
      min-width: 200px;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      &:focus {
        outline: none;
        border-color: #1a73e8;
      }
    }
    

}

.settings-section {
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
  
  .settings-card {
    background: #2a2d3a;
    border-radius: 12px;
    padding: 24px;
    
    .card-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 20px;
      color: white;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
  
  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      label {
        font-size: 14px;
        font-weight: 600;
        color: white;
      }
      
      input {
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: white;
        font-size: 14px;
        
        &:focus {
          outline: none;
          border-color: #1a73e8;
        }
      }
    }
    
    .save-btn {
      align-self: flex-start;
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
      }
    }
  }
  
  .security-options,
  .privacy-options,
  .notification-options {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .security-item,
  .privacy-item,
  .notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .item-info {
      h4 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        color: white;
      }
      
      p {
        font-size: 14px;
        color: #b0b3c1;
      }
    }
    
    .change-btn,
    .manage-btn {
      background: rgba(26, 115, 232, 0.1);
      color: #1a73e8;
      border: 1px solid rgba(26, 115, 232, 0.3);
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(26, 115, 232, 0.2);
      }
    }
  }
  
  .privacy-item,
  .notification-item {
    label:first-child {
      font-size: 16px;
      font-weight: 600;
      color: white;
    }
    
    select {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
      font-size: 14px;
      min-width: 150px;
      
      &:focus {
        outline: none;
        border-color: #1a73e8;
      }
    }
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
    
    input {
      opacity: 0;
      width: 0;
      height: 0;
      
      &:checked + .slider {
        background: #1a73e8;
      }
      
      &:checked + .slider:before {
        transform: translateX(26px);
      }
    }
    
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.2);
      transition: .4s;
      border-radius: 24px;
      
      &:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 2px;
        bottom: 2px;
        background: white;
        transition: .4s;
        border-radius: 50%;
      }
    }
  }
}

.empty-library,
.empty-wishlist,
.empty-history {
  text-align: center;
  padding: 80px 0;
  
  .empty-icon {
    font-size: 60px;
    margin-bottom: 24px;
    opacity: 0.5;
  }
  
  .empty-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
    color: white;
  }
  
  .empty-description {
    font-size: 16px;
    color: #b0b3c1;
    margin-bottom: 30px;
  }
  
  .browse-btn {
    display: inline-block;
    background: linear-gradient(45deg, #1a73e8, #0d47a1);
    color: white;
    padding: 12px 32px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
    }
  }
}

@media (max-width: 768px) {
  .profile-header {
    margin-bottom: 30px;
  }
  
  .user-card {
    padding: 30px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .library-filters {
    width: 100%;
    
    .search-input {
      flex: 1;
      min-width: 0;
    }
  }
  
  .wishlist-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>