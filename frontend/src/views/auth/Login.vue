<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-content">
          <router-link to="/" class="auth-logo">
            <img src="/images/icons/logo.png" alt="游戏商店" />
            <span>游戏商店</span>
          </router-link>

          <div class="auth-header">
            <h1 class="auth-title">欢迎回来</h1>
            <p class="auth-subtitle">登录您的账户继续体验精彩游戏</p>
          </div>

          <form class="auth-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email" class="form-label">邮箱地址</label>
              <div class="input-with-icon">
                <span class="input-icon">📧</span>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="请输入邮箱地址"
                    required
                    :class="{ 'error': errors.email }"
                    @input="clearError('email')"
                />
              </div>
              <div v-if="errors.email" class="error-message">
                {{ errors.email }}
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="input-with-icon">
                <span class="input-icon">🔒</span>
                <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="请输入密码"
                    required
                    :class="{ 'error': errors.password }"
                    @input="clearError('password')"
                />
                <button
                    type="button"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div v-if="errors.password" class="error-message">
                {{ errors.password }}
              </div>
            </div>

            <div class="form-group">
              <label for="captcha" class="form-label">验证码</label>
              <div class="captcha-container">
                <div class="input-with-icon">
                  <span class="input-icon">🛡️</span>
                  <input
                      id="captcha"
                      v-model="form.captcha"
                      type="text"
                      placeholder="请输入验证码"
                      required
                      :class="{ 'error': errors.captcha }"
                      @input="clearError('captcha')"
                  />
                </div>
                <img
                  :src="captchaUrl"
                  alt="验证码"
                  class="captcha-image"
                  @click="refreshCaptcha"
                  title="点击刷新验证码"
                />
              </div>
              <div v-if="errors.captcha" class="error-message">
                {{ errors.captcha }}
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                记住我
              </label>
              <router-link to="/forgot-password" class="forgot-password">
                忘记密码？
              </router-link>
            </div>

            <button type="submit" class="auth-btn" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>登录</span>
            </button>

            <div class="auth-divider">
              <span>或使用以下方式登录</span>
            </div>

            <div class="social-login">
              <button type="button" class="social-btn wechat">
                <span class="social-icon">💬</span>
                微信登录
              </button>
              <button type="button" class="social-btn qq">
                <span class="social-icon">🐧</span>
                QQ登录
              </button>
            </div>
          </form>

          <div class="auth-footer">
            <span>还没有账户？</span>
            <router-link to="/register" class="auth-link">
              立即注册
            </router-link>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-background" :style="backgroundStyle1">
          <div class="background-overlay"></div>
          <div class="background-content">
            <h2 class="background-title">探索无限游戏世界</h2>
            <p class="background-description">
              加入全球最大的游戏社区，发现、购买和体验最精彩的游戏
            </p>
            <div class="background-features">
              <div class="feature-item">
                <span class="feature-icon">🎮</span>
                <span class="feature-text">海量游戏库</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">💰</span>
                <span class="feature-text">超值折扣</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { validateEmail } from '@/utils/validators'
import { authAPI } from '@/api'

const router = useRouter()
const store = useStore()

// 背景图片样式
const backgroundStyle1 = {
  backgroundImage: "url('/images/banners/banner1.jpg')",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
}

const form = reactive({
  email: '',
  password: '',
  captcha: ''
})

const errors = reactive({
  email: '',
  password: '',
  captcha: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const captchaUrl = ref('') // 初始验证码地址

const clearError = (field) => {
  errors[field] = ''
}

const refreshCaptcha = async () => {
  try {
    const response = await authAPI.getCaptcha()
    captchaUrl.value = URL.createObjectURL(response)
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

// 初始化验证码
onMounted(() => {
  refreshCaptcha()
})

const handleLogin = async () => {
  // 重置错误
  errors.email = ''
  errors.password = ''
  errors.captcha = ''

  // 验证表单
  if (!form.email.trim()) {
    errors.email = '请输入邮箱地址'
    return
  }

  if (!validateEmail(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    return
  }

  if (!form.password.trim()) {
    errors.password = '请输入密码'
    return
  }

  if (form.password.length < 6) {
    errors.password = '密码长度至少为6位'
    return
  }

  if (!form.captcha.trim()) {
    errors.captcha = '请输入验证码'
    return
  }

  loading.value = true

  try {
    // 调用真实的后端登录API
    const response = await authAPI.login({
      email: form.email,
      password: form.password,
      captcha: form.captcha
    })

    if (response.data && response.data.token) {
      // 保存用户信息和token
      store.setUser(response.data.user)
      store.setToken(response.data.token)

      // 记住登录状态
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      }

      // 显示成功消息
      alert('登录成功！')

      // 跳转到首页
      router.push('/')
    } else {
      // 处理登录失败
      errors.password = '邮箱或密码错误'
    }
  } catch (error) {
    console.error('登录失败:', error)
    if (error.response && error.response.status === 401) {
      errors.password = '邮箱或密码错误'
    } else {
      errors.password = '登录失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f111a 0%, #1a1d29 100%);
  padding: 20px;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: #2a2d3a;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.auth-left {
  padding: 60px;

  @media (max-width: 768px) {
    padding: 40px 30px;
  }
}

.auth-content {
  max-width: 400px;
  margin: 0 auto;
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 60px;
  text-decoration: none;

  img {
    height: 40px;
  }

  span {
    font-size: 24px;
    font-weight: 800;
    background: linear-gradient(45deg, #1a73e8, #ff4757);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.auth-header {
  margin-bottom: 40px;

  .auth-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
    color: white;
  }

  .auth-subtitle {
    font-size: 16px;
    color: #b0b3c1;
  }
}

.auth-form {
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 24px;

  .captcha-container {
    display: flex;
    gap: 12px;
    align-items: center;

    .input-with-icon {
      flex: 1;
    }

    .captcha-image {
      height: 54px;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.8;
        border-color: #1a73e8;
      }
    }
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: white;
  }

  .input-with-icon {
    position: relative;

    .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      color: #8a8d9b;
    }

    input {
      width: 100%;
      padding: 16px 16px 16px 48px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-size: 16px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #1a73e8;
        box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &.error {
        border-color: #ff4757;
      }
    }

    .password-toggle {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #8a8d9b;
      font-size: 18px;
      cursor: pointer;
      padding: 4px;

      &:hover {
        color: white;
      }
    }
  }

  .error-message {
    margin-top: 8px;
    font-size: 14px;
    color: #ff4757;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #b0b3c1;
    cursor: pointer;

    input {
      display: none;
    }

    .checkmark {
      width: 18px;
      height: 18px;
      border: 2px solid #8a8d9b;
      border-radius: 4px;
      position: relative;
      transition: all 0.3s ease;

      &::after {
        content: '';
        position: absolute;
        left: 4px;
        top: 1px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }

    input:checked + .checkmark {
      background: #1a73e8;
      border-color: #1a73e8;

      &::after {
        opacity: 1;
      }
    }
  }

  .forgot-password {
    font-size: 14px;
    color: #1a73e8;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.auth-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(45deg, #1a73e8, #ff4757);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(26, 115, 232, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-divider {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  color: #8a8d9b;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }

  span {
    padding: 0 12px;
  }
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 40px;

  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }

    .social-icon {
      font-size: 16px;
    }
  }
}

.auth-footer {
  text-align: center;
  color: #b0b3c1;
  font-size: 14px;

  .auth-link {
    color: #1a73e8;
    text-decoration: none;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.auth-right {
  position: relative;

  @media (max-width: 1024px) {
    display: none;
  }
}

.auth-background {
  position: relative;
  height: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(26, 115, 232, 0.3) 0%, rgba(255, 71, 87, 0.3) 100%);
  }

  .background-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 40px;
    max-width: 400px;

    .background-title {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 16px;
    }

    .background-description {
      font-size: 16px;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .background-features {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;

        .feature-icon {
          font-size: 24px;
        }

        .feature-text {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>