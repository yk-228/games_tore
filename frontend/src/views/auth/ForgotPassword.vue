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
            <h1 class="auth-title">找回密码</h1>
            <p class="auth-subtitle">重置您的账户密码</p>
          </div>

          <!-- 步骤1：输入邮箱和验证码 -->
          <div v-if="step === 1" class="step-content">
            <form class="auth-form" @submit.prevent="sendResetLink">
              <div class="form-group">
                <label for="email" class="form-label">邮箱地址</label>
                <div class="input-with-icon">
                  <span class="input-icon">📧</span>
                  <input
                      id="email"
                      v-model="email"
                      type="email"
                      placeholder="请输入注册时使用的邮箱地址"
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
                <label for="captcha" class="form-label">验证码</label>
                <div class="captcha-container">
                  <div class="input-with-icon">
                    <span class="input-icon">🔐</span>
                    <input
                        id="captcha"
                        v-model="captcha"
                        type="text"
                        placeholder="请输入验证码"
                        required
                        :class="{ 'error': errors.captcha }"
                        @input="clearError('captcha')"
                    />
                  </div>
                  <div class="captcha-image">
                    <img :src="captchaImage" alt="验证码" @click="refreshCaptcha" />
                  </div>
                </div>
                <div v-if="errors.captcha" class="error-message">
                  {{ errors.captcha }}
                </div>
              </div>

              <button type="submit" class="auth-btn" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                <span v-else>发送重置链接</span>
              </button>
            </form>
          </div>

          <!-- 步骤2：输入验证码 -->
          <div v-if="step === 2" class="step-content">
            <div class="step-info">
              <p>我们已向 <strong>{{ email }}</strong> 发送了6位验证码</p>
              <p class="countdown">验证码将在 {{ formatTime(countdown) }} 后失效</p>
            </div>

            <form class="auth-form" @submit.prevent="verifyCode">
              <div class="form-group">
                <label class="form-label">请输入6位验证码</label>
                <div class="verification-code">
                  <input
                      v-for="i in 6"
                      :key="i"
                      v-model="verificationCode[i-1]"
                      type="text"
                      maxlength="1"
                      :class="{ 'error': errors.verificationCode }"
                      @input="handleCodeInput(i-1, $event)"
                      @keydown="handleCodeKeydown(i-1, $event)"
                      @paste="handleCodePaste"
                  />
                </div>
                <div v-if="errors.verificationCode" class="error-message">
                  {{ errors.verificationCode }}
                </div>
              </div>

              <div class="resend-container">
                <span v-if="canResend" class="resend-text">
                  没有收到验证码？
                  <button type="button" class="resend-btn" @click="resendCode">
                    重新发送
                  </button>
                </span>
                <span v-else class="resend-text">
                  没有收到验证码？{{ resendCountdown }}秒后可重新发送
                </span>
              </div>

              <button type="submit" class="auth-btn" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                <span v-else>验证</span>
              </button>
            </form>
          </div>

          <!-- 步骤3：设置新密码 -->
          <div v-if="step === 3" class="step-content">
            <form class="auth-form" @submit.prevent="resetPassword">
              <div class="form-group">
                <label for="newPassword" class="form-label">新密码</label>
                <div class="input-with-icon">
                  <span class="input-icon">🔒</span>
                  <input
                      id="newPassword"
                      v-model="newPassword"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="请输入新密码"
                      required
                      :class="{ 'error': errors.newPassword }"
                      @input="handlePasswordInput"
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
                  <div class="strength-bar">
                    <div
                        class="strength-fill"
                        :class="getStrengthClass(passwordStrength)"
                        :style="{ width: (passwordStrength * 25) + '%' }"
                    ></div>
                  </div>
                  <span class="strength-text">{{ getStrengthText(passwordStrength) }}</span>
                </div>
                <div v-if="errors.newPassword" class="error-message">
                  {{ errors.newPassword }}
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword" class="form-label">确认新密码</label>
                <div class="input-with-icon">
                  <span class="input-icon">🔒</span>
                  <input
                      id="confirmPassword"
                      v-model="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="请再次输入新密码"
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

              <button type="submit" class="auth-btn" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                <span v-else>重置密码</span>
              </button>
            </form>
          </div>

          <!-- 步骤4：重置成功 -->
          <div v-if="step === 4" class="step-content">
            <div class="success-container">
              <div class="success-icon">✅</div>
              <h2 class="success-title">密码重置成功</h2>
              <p class="success-description">
                您的密码已成功重置，现在可以使用新密码登录账户
              </p>
              <router-link to="/login" class="auth-btn">
                返回登录
              </router-link>
            </div>
          </div>

          <div class="auth-footer">
            <span>想起密码了？</span>
            <router-link to="/login" class="auth-link">
              返回登录
            </router-link>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-background" :style="backgroundStyle1">
          <div class="background-overlay"></div>
          <div class="background-content">
            <h2 class="background-title">安全重置</h2>
            <p class="background-description">
              通过邮箱验证安全重置您的账户密码
            </p>
            <div class="background-features">
              <div class="feature-item">
                <span class="feature-icon">🔐</span>
                <span class="feature-text">安全验证</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📧</span>
                <span class="feature-text">邮箱确认</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <span class="feature-text">快速重置</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { validateEmail, validatePassword } from '@/utils/validators'
import { authAPI } from '@/api'


// 背景图片样式
const backgroundStyle1 = {
  backgroundImage: "url('/images/banners/banner3.jpg')",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
}

// 表单数据
const email = ref('')
const captcha = ref('')
const verificationCode = ref(['', '', '', '', '', ''])
const newPassword = ref('')
const confirmPassword = ref('')

// 状态管理
const step = ref(1)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const captchaImage = ref('')
const loading = ref(false)
const passwordStrength = ref(0)
const countdown = ref(300)
const resendCountdown = ref(60)
const canResend = ref(false)

// 错误信息
const errors = reactive({
  email: '',
  captcha: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

// 计时器
let countdownTimer = null
let resendTimer = null

const clearError = (field) => {
  errors[field] = ''
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleCodeInput = (index, event) => {
  const value = event.target.value
  verificationCode.value[index] = value

  // 自动聚焦到下一个输入框
  if (value && index < 5) {
    const nextInput = event.target.nextElementSibling
    if (nextInput) nextInput.focus()
  }

  clearError('verificationCode')
}

const handleCodeKeydown = (index, event) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    const prevInput = event.target.previousElementSibling
    if (prevInput) prevInput.focus()
  }
}

const handleCodePaste = (event) => {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('text')
  const codeArray = pasteData.slice(0, 6).split('')

  codeArray.forEach((char, index) => {
    if (index < 6) {
      verificationCode.value[index] = char
    }
  })

  // 聚焦到最后一个输入框
  const inputs = event.target.parentElement.querySelectorAll('input')
  if (inputs[codeArray.length - 1]) {
    inputs[codeArray.length - 1].focus()
  }
}

const handlePasswordInput = () => {
  clearError('newPassword')
  calculatePasswordStrength()
}

const calculatePasswordStrength = () => {
  const password = newPassword.value
  let strength = 0

  if (password.length >= 8) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1

  passwordStrength.value = Math.min(strength, 4)
}

const getStrengthClass = (strength) => {
  const classes = ['weak', 'fair', 'good', 'strong', 'very-strong']
  return classes[strength] || 'weak'
}

const getStrengthText = (strength) => {
  const texts = ['弱', '一般', '良好', '强', '非常强']
  return texts[strength] || '弱'
}

const refreshCaptcha = async () => {
  try {
    const response = await authAPI.getCaptcha()
    captchaImage.value = URL.createObjectURL(response)
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

onMounted(() => {
  refreshCaptcha()
})

const sendResetLink = async () => {
  // 验证邮箱
  if (!email.value.trim()) {
    errors.email = '请输入邮箱地址'
    return
  }

  if (!validateEmail(email.value)) {
    errors.email = '请输入有效的邮箱地址'
    return
  }

  // 验证验证码
  if (!captcha.value.trim()) {
    errors.captcha = '请输入验证码'
    return
  }

  loading.value = true

  try {
    // 调用真实的后端API发送重置链接
    await authAPI.forgotPassword({
      email: email.value,
      captcha: captcha.value
    })

    // 进入下一步
    step.value = 2
    startCountdown()
  } catch (error) {
    console.error('发送重置链接失败:', error)
    if (error.response && error.response.status === 404) {
      errors.email = '该邮箱未注册，请检查邮箱地址'
    } else if (error.response && error.response.status === 400) {
      errors.captcha = '验证码错误，请重新输入'
    } else {
      errors.email = '发送失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

const startCountdown = () => {
  countdown.value = 300
  canResend.value = false

  clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

const startResendCountdown = () => {
  resendCountdown.value = 60
  canResend.value = false

  clearInterval(resendTimer)
  resendTimer = setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value--
    } else {
      canResend.value = true
      clearInterval(resendTimer)
    }
  }, 1000)
}

const resendCode = async () => {
  if (!canResend.value) return

  loading.value = true
  try {
    // 调用真实的后端API重新发送验证码
    await authAPI.resendResetCode({
      email: email.value
    })

    startResendCountdown()
    alert('验证码已重新发送')
  } catch (error) {
    console.error('重新发送验证码失败:', error)
    alert('重新发送失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  const code = verificationCode.value.join('')

  if (code.length !== 6) {
    errors.verificationCode = '请输入完整的6位验证码'
    return
  }

  if (!/^\d{6}$/.test(code)) {
    errors.verificationCode = '验证码必须是6位数字'
    return
  }

  loading.value = true

  try {
    // 调用真实的后端API验证验证码
    await authAPI.verifyResetCode({
      email: email.value,
      code: code
    })

    // 验证成功，进入下一步
    step.value = 3
    clearError('verificationCode')
  } catch (error) {
    console.error('验证码验证失败:', error)
    if (error.response && error.response.status === 400) {
      errors.verificationCode = '验证码错误或已过期，请重新输入'
    } else {
      errors.verificationCode = '验证失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  // 验证新密码
  if (!newPassword.value.trim()) {
    errors.newPassword = '请输入新密码'
    return
  }

  if (!validatePassword(newPassword.value)) {
    errors.newPassword = '密码长度至少为6位'
    return
  }

  if (passwordStrength.value < 3) {
    errors.newPassword = '密码强度不够，请包含大小写字母和数字'
    return
  }

  // 验证确认密码
  if (!confirmPassword.value.trim()) {
    errors.confirmPassword = '请确认新密码'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errors.confirmPassword = '两次输入的密码不一致'
    return
  }

  loading.value = true

  try {
    // 调用真实的后端API重置密码
    await authAPI.resetPassword({
      email: email.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    })

    // 重置成功
    step.value = 4

    // 清空表单
    email.value = ''
    captcha.value = ''
    verificationCode.value = ['', '', '', '', '', '']
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    console.error('密码重置失败:', error)
    if (error.response && error.response.status === 400) {
      errors.newPassword = '密码重置失败，请检查输入信息'
    } else {
      errors.newPassword = '重置失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 初始化验证码图片
  refreshCaptcha()
})

onUnmounted(() => {
  // 清理计时器
  if (countdownTimer) clearInterval(countdownTimer)
  if (resendTimer) clearInterval(resendTimer)
})
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

.step-content {
  margin-bottom: 40px;
}

.step-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: center;

  p {
    margin: 0 0 8px 0;
    color: #b0b3c1;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: white;
    }
  }

  .countdown {
    color: #ff4757;
    font-weight: 600;
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

  .error-message {
    margin-top: 8px;
    font-size: 14px;
    color: #ff4757;
  }
}

.captcha-container {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 12px;

  .captcha-image {
    img {
      width: 100%;
      height: 48px;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.verification-code {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;

  input {
    width: 100%;
    aspect-ratio: 1;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #1a73e8;
      box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
    }

    &.error {
      border-color: #ff4757;
    }
  }
}

.resend-container {
  text-align: center;
  margin-bottom: 24px;

  .resend-text {
    color: #b0b3c1;
    font-size: 14px;

    .resend-btn {
      background: none;
      border: none;
      color: #1a73e8;
      cursor: pointer;
      text-decoration: underline;

      &:hover {
        color: #0d5bb9;
      }

      &:disabled {
        color: #8a8d9b;
        cursor: not-allowed;
        text-decoration: none;
      }
    }
  }
}

.password-strength {
  margin-top: 8px;

  .strength-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;

      &.weak {
        background: #ff4757;
      }

      &.fair {
        background: #ffa502;
      }

      &.good {
        background: #2ed573;
      }

      &.strong {
        background: #1e90ff;
      }

      &.very-strong {
        background: #3742fa;
      }
    }
  }

  .strength-text {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: #b0b3c1;
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
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(26, 115, 232, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
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

.success-container {
  text-align: center;
  padding: 40px 0;

  .success-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }

  .success-title {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
    color: white;
  }

  .success-description {
    font-size: 16px;
    color: #b0b3c1;
    margin-bottom: 32px;
  }
}

.auth-footer {
  text-align: center;
  color: #b0b3c1;

  .auth-link {
    color: #1a73e8;
    text-decoration: none;
    margin-left: 8px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.auth-right {
  position: relative;
  overflow: hidden;

  .auth-background {
    height: 100%;
    position: relative;

    .background-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(26, 115, 232, 0.8), rgba(255, 71, 87, 0.6));
    }

    .background-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: white;
      text-align: center;

      .background-title {
        font-size: 48px;
        font-weight: 800;
        margin-bottom: 16px;
      }

      .background-description {
        font-size: 18px;
        margin-bottom: 40px;
        opacity: 0.9;
      }

      .background-features {
        display: flex;
        gap: 40px;

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;

          .feature-icon {
            font-size: 32px;
          }

          .feature-text {
            font-size: 14px;
            font-weight: 600;
          }
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .auth-right {
    display: none;
  }
}

@media (max-width: 768px) {
  .auth-page {
    padding: 0;
  }

  .auth-container {
    border-radius: 0;
    min-height: 100vh;
  }

  .captcha-container {
    grid-template-columns: 1fr;

    .captcha-image {
      order: -1;
      margin-bottom: 12px;

      img {
        height: 40px;
      }
    }
  }

  .background-features {
    flex-direction: column;
    gap: 20px !important;
  }
}
</style>