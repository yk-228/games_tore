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
            <h1 class="auth-title">创建账户</h1>
            <p class="auth-subtitle">加入我们，开始你的游戏之旅</p>
          </div>

          <form class="auth-form" @submit.prevent="handleRegister">
            <!-- 用户名 -->
            <div class="form-group">
              <label for="username" class="form-label">用户名</label>
              <div class="input-with-icon">
                <span class="input-icon">👤</span>
                <input
                    id="username"
                    v-model="form.username"
                    type="text"
                    placeholder="请输入用户名"
                    required
                    :class="{ 'error': errors.username }"
                    @input="clearError('username')"
                />
              </div>
              <div v-if="errors.username" class="error-message">
                {{ errors.username }}
              </div>
            </div>

            <!-- 邮箱 -->
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

            <!-- 密码 -->
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
              <div class="password-strength">
                <div class="strength-bar" :class="passwordStrengthClass"></div>
                <span class="strength-text">{{ passwordStrengthText }}</span>
              </div>
              <div v-if="errors.password" class="error-message">
                {{ errors.password }}
              </div>
              <ul class="password-hints">
                <li :class="{ 'valid': form.password.length >= 8 }">
                  📏 至少8个字符
                </li>
                <li :class="{ 'valid': hasUpperCase }">
                  🔠 包含大写字母
                </li>
                <li :class="{ 'valid': hasLowerCase }">
                  🔡 包含小写字母
                </li>
                <li :class="{ 'valid': hasNumber }">
                  🔢 包含数字
                </li>
                <li :class="{ 'valid': hasSpecialChar }">
                  🔣 包含特殊字符
                </li>
              </ul>
            </div>

            <!-- 确认密码 -->
            <div class="form-group">
              <label for="confirmPassword" class="form-label">确认密码</label>
              <div class="input-with-icon">
                <span class="input-icon">🔒</span>
                <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="请再次输入密码"
                    required
                    :class="{ 'error': errors.confirmPassword }"
                    @input="clearError('confirmPassword')"
                />
                <button
                    type="button"
                    class="password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                >
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="error-message">
                {{ errors.confirmPassword }}
              </div>
            </div>

            <!-- 手机号 -->
            <div class="form-group">
              <label for="phone" class="form-label">手机号 (可选)</label>
              <div class="input-with-icon">
                <span class="input-icon">📱</span>
                <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    placeholder="请输入手机号"
                    :class="{ 'error': errors.phone }"
                    @input="clearError('phone')"
                />
              </div>
              <div v-if="errors.phone" class="error-message">
                {{ errors.phone }}
              </div>
            </div>
            <!-- 协议 -->
            <div class="form-group">
              <label class="checkbox-label">
                <input
                    type="checkbox"
                    v-model="form.agreeTerms"
                    :class="{ 'error': errors.agreeTerms }"
                />
                <span class="checkmark"></span>
                我已阅读并同意
                <router-link to="/terms" class="terms-link">服务条款</router-link>
                和
                <router-link to="/privacy" class="terms-link">隐私政策</router-link>
              </label>
              <div v-if="errors.agreeTerms" class="error-message">
                {{ errors.agreeTerms }}
              </div>
            </div>

            <!-- 验证码 -->
            <div class="captcha-section" v-if="showCaptcha">
              <div class="captcha-input">
                <div class="input-with-icon">
                  <span class="input-icon">🔐</span>
                  <input
                      v-model="form.captcha"
                      type="text"
                      placeholder="请输入验证码"
                      required
                      :class="{ 'error': errors.captcha }"
                      @input="clearError('captcha')"
                  />
                </div>
                <div class="captcha-image" @click="refreshCaptcha">
                  <img :src="captchaImage" alt="验证码" />
                </div>
              </div>
              <div v-if="errors.captcha" class="error-message">
                {{ errors.captcha }}
              </div>
            </div>

            <button type="submit" class="auth-btn" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>创建账户</span>
            </button>

            <div class="auth-divider">
              <span>或使用以下方式注册</span>
            </div>

            <div class="social-login">
              <button type="button" class="social-btn wechat" @click="socialRegister('wechat')">
                <span class="social-icon">💬</span>
                微信注册
              </button>
              <button type="button" class="social-btn qq" @click="socialRegister('qq')">
                <span class="social-icon">🐧</span>
                QQ注册
              </button>
            </div>
          </form>

          <div class="auth-footer">
            <span>已有账户？</span>
            <router-link to="/login" class="auth-link">
              立即登录
            </router-link>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-background" :style="backgroundStyle2">
          <div class="background-overlay"></div>
          <div class="background-content">
            <h2 class="background-title">加入游戏社区</h2>
            <p class="background-description">
              注册即可享受新人专属福利，开启你的游戏之旅
            </p>
            <div class="registration-benefits">
              <div class="benefit-item">
                <div class="benefit-icon">🎁</div>
                <div class="benefit-content">
                  <h3>新人礼包</h3>
                  <p>注册即送 ¥20 优惠券</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">💰</div>
                <div class="benefit-content">
                  <h3>专属折扣</h3>
                  <p>新人首单立享 8 折优惠</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🎮</div>
                <div class="benefit-content">
                  <h3>免费游戏</h3>
                  <p>每周免费领取精品游戏</p>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">👥</div>
                <div class="benefit-content">
                  <h3>社区特权</h3>
                  <p>加入玩家社区，参与活动赢好礼</p>
                </div>
              </div>
            </div>

            <div class="user-count">
              <div class="count-icon">👥</div>
              <div class="count-content">
                <div class="count-number">1,234,567</div>
                <div class="count-text">玩家已加入我们</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { validateEmail, validatePassword, validateUsername } from '@/utils/validators'
import { authAPI } from '@/api'

const router = useRouter()
const store = useStore()

// 背景图片样式
const backgroundStyle2 = {
  backgroundImage: "url('/images/banners/banner2.jpg')",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
}

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  inviteCode: '',
  agreeTerms: false,
  captcha: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  inviteCode: '',
  agreeTerms: '',
  captcha: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showCaptcha = ref(true)
const loading = ref(false)

const captchaImage = ref('')

// 密码强度计算
const hasUpperCase = computed(() => /[A-Z]/.test(form.password))
const hasLowerCase = computed(() => /[a-z]/.test(form.password))
const hasNumber = computed(() => /\d/.test(form.password))
// eslint-disable-next-line no-useless-escape
const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(form.password))

const passwordStrength = computed(() => {
  let strength = 0
  if (form.password.length >= 8) strength++
  if (hasUpperCase.value) strength++
  if (hasLowerCase.value) strength++
  if (hasNumber.value) strength++
  if (hasSpecialChar.value) strength++
  return strength
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return ''
  if (strength <= 2) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return '请设置密码'
  if (strength <= 2) return '弱'
  if (strength <= 3) return '中'
  return '强'
})

const clearError = (field) => {
  errors[field] = ''
}

const refreshCaptcha = async () => {
  try {
    const response = await authAPI.getCaptcha()
    captchaImage.value = URL.createObjectURL(response)
    form.captcha = ''
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

onMounted(() => {
  refreshCaptcha()
})

const validateForm = () => {
  let isValid = true

  // 验证用户名
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (!validateUsername(form.username)) {
    errors.username = '用户名长度应为3-20位'
    isValid = false
  }

  // 验证邮箱
  if (!form.email.trim()) {
    errors.email = '请输入邮箱地址'
    isValid = false
  } else if (!validateEmail(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // 验证密码
  if (!form.password.trim()) {
    errors.password = '请输入密码'
    isValid = false
  } else if (!validatePassword(form.password)) {
    errors.password = '密码长度至少为6位'
    isValid = false
  } else if (passwordStrength.value < 3) {
    errors.password = '密码强度不够，请包含大小写字母和数字'
    isValid = false
  }

  // 验证确认密码
  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  // 验证手机号
  if (form.phone.trim() && !/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '请输入有效的手机号'
    isValid = false
  }

  // 验证协议
  if (!form.agreeTerms) {
    errors.agreeTerms = '请同意服务条款和隐私政策'
    isValid = false
  }

  // 验证验证码
  if (!form.captcha.trim()) {
    errors.captcha = '请输入验证码'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // 调用实际的注册API
    const response = await authAPI.register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim() || undefined,
      agreeTerms: form.agreeTerms,
      captcha: form.captcha
    })

    if (response.success) {
      // 保存用户信息和token
      store.setUser(response.data.user)
      store.setToken(response.data.token)

      // 显示成功消息
      alert(`注册成功！获得新人礼包：${response.data.welcomeBonus.discount}优惠券`)

      // 跳转到首页
      router.push('/')
    } else {
      // 处理注册失败
      if (response.error === 'EMAIL_ALREADY_EXISTS') {
        errors.email = '该邮箱已被注册，请使用其他邮箱'
      } else if (response.error === 'USERNAME_ALREADY_EXISTS') {
        errors.username = '该用户名已被使用，请选择其他用户名'
      } else {
        errors.email = '注册失败，请稍后重试'
      }
    }
  } catch (error) {
    console.error('注册失败:', error)
    if (error.response?.status === 409) {
      errors.email = '该邮箱已被注册，请使用其他邮箱'
    } else if (error.response?.status === 400) {
      errors.email = '注册信息不完整或格式错误'
    } else {
      errors.email = '注册失败，请检查网络连接后重试'
    }
  } finally {
    loading.value = false
  }
}

const socialRegister = (platform) => {
  console.log('社交平台注册:', platform)
  // 这里可以调用社交登录API
  alert(`正在通过${platform === 'wechat' ? '微信' : 'QQ'}登录...`)
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

  .password-strength {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;

    .strength-bar {
      flex: 1;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;

      &.weak {
        background: linear-gradient(90deg, #ff4757 0%, #ff4757 33%, rgba(255, 255, 255, 0.1) 33%);
      }

      &.medium {
        background: linear-gradient(90deg, #ffa502 0%, #ffa502 66%, rgba(255, 255, 255, 0.1) 66%);
      }

      &.strong {
        background: #2ed573;
      }
    }

    .strength-text {
      font-size: 12px;
      color: #8a8d9b;
    }
  }

  .password-hints {
    list-style: none;
    padding: 8px 0 0 0;
    margin: 0;

    li {
      font-size: 12px;
      color: #8a8d9b;
      margin-bottom: 4px;
      transition: all 0.3s ease;

      &.valid {
        color: #2ed573;
      }
    }
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #b0b3c1;
    font-size: 14px;
    cursor: pointer;
    line-height: 1.4;

    input {
      display: none;

      &:checked + .checkmark {
        background: #1a73e8;
        border-color: #1a73e8;

        &:after {
          display: block;
        }
      }

      &.error + .checkmark {
        border-color: #ff4757;
      }
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      position: relative;
      flex-shrink: 0;

      &:after {
        content: "✓";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        display: none;
      }
    }

    .terms-link {
      color: #1a73e8;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .error-message {
    margin-top: 8px;
    font-size: 14px;
    color: #ff4757;
  }
}

.captcha-section {
  margin-bottom: 24px;

  .captcha-input {
    display: flex;
    gap: 12px;

    .input-with-icon {
      flex: 1;
    }

    .captcha-image {
      width: 120px;
      height: 56px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.auth-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(45deg, #1a73e8, #0d47a1);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(26, 115, 232, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 32px 0;
  color: #8a8d9b;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }

  span {
    padding: 0 20px;
    font-size: 14px;
  }
}

.social-login {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    &.wechat {
      &:hover {
        background: rgba(7, 193, 96, 0.1);
        border-color: #07c160;
      }
    }

    &.qq {
      &:hover {
        background: rgba(18, 183, 245, 0.1);
        border-color: #12b7f5;
      }
    }

    .social-icon {
      font-size: 18px;
    }
  }
}

.auth-footer {
  text-align: center;
  margin-top: 40px;
  color: #b0b3c1;
  font-size: 14px;

  .auth-link {
    color: #1a73e8;
    text-decoration: none;
    font-weight: 600;
    margin-left: 8px;
    transition: all 0.3s ease;

    &:hover {
      color: #0d47a1;
      text-decoration: underline;
    }
  }
}

.auth-right {
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  position: relative;

  @media (max-width: 1024px) {
    display: none;
  }
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(26, 115, 232, 0.9), rgba(13, 71, 161, 0.9));
  }

  .background-content {
    position: relative;
    z-index: 1;
    padding: 80px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
  }

  .background-title {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.2;
  }

  .background-description {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 40px;
    line-height: 1.6;
  }

  .registration-benefits {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;

    .benefit-item {
      display: flex;
      align-items: center;
      gap: 16px;

      .benefit-icon {
        font-size: 32px;
        background: rgba(255, 255, 255, 0.1);
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
      }

      .benefit-content {
        h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        p {
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }
  }

  .user-count {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 12px;
    backdrop-filter: blur(4px);

    .count-icon {
      font-size: 32px;
    }

    .count-content {
      .count-number {
        font-size: 24px;
        font-weight: 800;
      }

      .count-text {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
}
</style>