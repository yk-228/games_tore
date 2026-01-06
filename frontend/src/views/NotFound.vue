<template>
  <div class="not-found-page">
    <HeaderNav />
    
    <main class="not-found-main">
      <div class="container">
        <div class="not-found-content">
          <div class="error-code">404</div>
          
          <div class="error-message">
            <h1 class="error-title">页面未找到</h1>
            <p class="error-description">
              抱歉，您访问的页面不存在或已被移除
            </p>
          </div>
          
          <div class="error-illustration">
            <div class="illustration-container">
              <!-- 游戏控制器图标 -->
              <div class="controller">
                <div class="controller-body">
                  <div class="d-pad">
                    <div class="d-pad-up"></div>
                    <div class="d-pad-down"></div>
                    <div class="d-pad-left"></div>
                    <div class="d-pad-right"></div>
                  </div>
                  <div class="buttons">
                    <div class="button a"></div>
                    <div class="button b"></div>
                    <div class="button x"></div>
                    <div class="button y"></div>
                  </div>
                </div>
              </div>
              
              <!-- 游戏角色 -->
              <div class="game-character">
                <div class="character-body">
                  <div class="character-head"></div>
                  <div class="character-torso"></div>
                  <div class="character-arms">
                    <div class="arm left"></div>
                    <div class="arm right"></div>
                  </div>
                  <div class="character-legs">
                    <div class="leg left"></div>
                    <div class="leg right"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="error-suggestions">
            <h2 class="suggestions-title">试试以下操作：</h2>
            <div class="suggestion-cards">
              <router-link to="/" class="suggestion-card">
                <div class="card-icon">🏠</div>
                <div class="card-content">
                  <h3>返回首页</h3>
                  <p>回到游戏商店主页</p>
                </div>
              </router-link>
              
              <router-link to="/games" class="suggestion-card">
                <div class="card-icon">🎮</div>
                <div class="card-content">
                  <h3>浏览游戏</h3>
                  <p>发现精彩的游戏</p>
                </div>
              </router-link>
              
              <button class="suggestion-card" @click="goBack">
                <div class="card-icon">↩️</div>
                <div class="card-content">
                  <h3>返回上一页</h3>
                  <p>回到之前的页面</p>
                </div>
              </button>
              
              <a href="javascript:location.reload()" class="suggestion-card">
                <div class="card-icon">🔄</div>
                <div class="card-content">
                  <h3>刷新页面</h3>
                  <p>重新加载当前页面</p>
                </div>
              </a>
            </div>
          </div>
          
          <div class="search-section">
            <h3 class="search-title">搜索您想要的内容</h3>
            <div class="search-box">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索游戏、分类、帮助..."
                @keyup.enter="handleSearch"
              />
              <button class="search-btn" @click="handleSearch">
                🔍 搜索
              </button>
            </div>
            
            <div class="popular-searches">
              <span class="popular-title">热门搜索：</span>
              <div class="search-tags">
                <span class="search-tag" @click="searchTag('赛博朋克')">赛博朋克</span>
                <span class="search-tag" @click="searchTag('动作游戏')">动作游戏</span>
                <span class="search-tag" @click="searchTag('RPG')">RPG</span>
                <span class="search-tag" @click="searchTag('多人游戏')">多人游戏</span>
                <span class="search-tag" @click="searchTag('免费游戏')">免费游戏</span>
              </div>
            </div>
          </div>
          
          <div class="help-section">
            <h3 class="help-title">需要帮助？</h3>
            <div class="help-links">
              <a href="#" class="help-link">帮助中心</a>
              <a href="#" class="help-link">联系客服</a>
              <a href="#" class="help-link">常见问题</a>
              <a href="#" class="help-link">社区论坛</a>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderNav from '@/components/common/HeaderNav.vue'
import Footer from '@/components/common/Footer.vue'

const router = useRouter()
const searchQuery = ref('')

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/games?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

const searchTag = (tag) => {
  searchQuery.value = tag
  handleSearch()
}
</script>

<style scoped lang="scss">
.not-found-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.not-found-main {
  flex: 1;
  padding: 60px 0;
  background: linear-gradient(135deg, #0f111a 0%, #1a1d29 100%);
}

.not-found-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #ffa502, #1a73e8, #2ed573);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 80px;
  }
}

.error-message {
  margin-bottom: 40px;
  
  .error-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 16px;
    color: white;
    
    @media (max-width: 768px) {
      font-size: 24px;
    }
  }
  
  .error-description {
    font-size: 18px;
    color: #b0b3c1;
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
}

.error-illustration {
  margin: 60px 0;
  
  .illustration-container {
    position: relative;
    width: 300px;
    height: 200px;
    margin: 0 auto;
    
    // 游戏控制器
    .controller {
      position: absolute;
      left: 50px;
      bottom: 0;
      width: 150px;
      height: 100px;
      
      .controller-body {
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #2a2d3a, #3a3d4a);
        border-radius: 20px;
        position: relative;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        
        &::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          background: #1a1d29;
          border-radius: 15px;
        }
      }
      
      .d-pad {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 60px;
        height: 60px;
        
        div {
          position: absolute;
          background: #8a8d9b;
        }
        
        .d-pad-up {
          top: 0;
          left: 20px;
          width: 20px;
          height: 20px;
          border-radius: 4px 4px 0 0;
        }
        
        .d-pad-down {
          bottom: 0;
          left: 20px;
          width: 20px;
          height: 20px;
          border-radius: 0 0 4px 4px;
        }
        
        .d-pad-left {
          top: 20px;
          left: 0;
          width: 20px;
          height: 20px;
          border-radius: 4px 0 0 4px;
        }
        
        .d-pad-right {
          top: 20px;
          right: 0;
          width: 20px;
          height: 20px;
          border-radius: 0 4px 4px 0;
        }
      }
      
      .buttons {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 60px;
        height: 60px;
        
        .button {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ff4757;
          
          &.a {
            right: 0;
            top: 10px;
          }
          
          &.b {
            left: 0;
            top: 10px;
          }
          
          &.x {
            right: 0;
            bottom: 10px;
          }
          
          &.y {
            left: 0;
            bottom: 10px;
          }
        }
      }
    }
    
    // 游戏角色
    .game-character {
      position: absolute;
      right: 50px;
      bottom: 0;
      width: 100px;
      height: 150px;
      
      .character-body {
        position: relative;
        width: 100%;
        height: 100%;
        
        div {
          position: absolute;
          background: #1a73e8;
        }
        
        .character-head {
          top: 0;
          left: 30px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        .character-torso {
          top: 40px;
          left: 25px;
          width: 50px;
          height: 60px;
          border-radius: 10px;
        }
        
        .character-arms {
          .arm {
            top: 50px;
            width: 10px;
            height: 40px;
            border-radius: 5px;
            
            &.left {
              left: 15px;
              transform: rotate(45deg);
            }
            
            &.right {
              right: 15px;
              transform: rotate(-45deg);
            }
          }
        }
        
        .character-legs {
          top: 100px;
          left: 30px;
          width: 40px;
          height: 50px;
          
          .leg {
            position: absolute;
            width: 10px;
            height: 40px;
            background: #0d47a1;
            border-radius: 5px;
            bottom: 0;
            
            &.left {
              left: 10px;
              transform: rotate(15deg);
            }
            
            &.right {
              right: 10px;
              transform: rotate(-15deg);
            }
          }
        }
      }
    }
  }
}

.error-suggestions {
  margin: 60px 0;
  
  .suggestions-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 30px;
    color: white;
  }
  
  .suggestion-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .suggestion-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: #2a2d3a;
      border-radius: 16px;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid transparent;
      
      &:hover {
        transform: translateY(-5px);
        border-color: #1a73e8;
        box-shadow: 0 8px 24px rgba(26, 115, 232, 0.2);
        
        .card-icon {
          transform: scale(1.1);
        }
      }
      
      .card-icon {
        font-size: 40px;
        transition: transform 0.3s ease;
      }
      
      .card-content {
        text-align: left;
        flex: 1;
        
        h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
          color: white;
        }
        
        p {
          font-size: 14px;
          color: #8a8d9b;
        }
      }
    }
  }
}

.search-section {
  margin: 60px 0;
  background: #2a2d3a;
  border-radius: 16px;
  padding: 40px;
  
  .search-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
    color: white;
  }
  
  .search-box {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    
    input {
      flex: 1;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 16px;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #1a73e8;
        box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    
    .search-btn {
      background: linear-gradient(45deg, #1a73e8, #0d47a1);
      color: white;
      border: none;
      padding: 0 32px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(45deg, #0d47a1, #1a73e8);
        transform: translateY(-2px);
      }
    }
  }
  
  .popular-searches {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .popular-title {
      font-size: 14px;
      color: #b0b3c1;
    }
    
    .search-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      
      .search-tag {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        font-size: 14px;
        color: #b0b3c1;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(26, 115, 232, 0.1);
          border-color: #1a73e8;
          color: #1a73e8;
        }
      }
    }
  }
}

.help-section {
  .help-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
    color: white;
  }
  
  .help-links {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    
    .help-link {
      color: #1a73e8;
      text-decoration: none;
      font-size: 16px;
      transition: all 0.3s ease;
      
      &:hover {
        color: #0d47a1;
        text-decoration: underline;
      }
    }
  }
}
</style>