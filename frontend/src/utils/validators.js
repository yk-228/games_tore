// 邮箱验证
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// 密码验证
export const validatePassword = (password) => {
  return password.length >= 6
}

// 用户名验证
export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20
}

// 手机号验证
export const validatePhone = (phone) => {
  const re = /^1[3-9]\d{9}$/
  return re.test(phone)
}

// 价格验证
export const validatePrice = (price) => {
  return price > 0
}