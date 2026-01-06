<template>
  <div class="cart-page">
    <!-- 头部导航 -->
    <HeaderNav />

    <!-- 主要内容 -->
    <main class="cart-main">
      <div class="container">
        <div class="cart-header">
          <h1 class="page-title">购物车</h1>
          <div class="cart-stats">
            <span>共 {{ cartItems.length }} 件商品</span>
            <span>已选 {{ selectedItems.length }} 件</span>
          </div>
        </div>

        <!-- 购物车为空 -->
        <div v-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <h2 class="empty-title">购物车空空如也</h2>
          <p class="empty-description">快去挑选心仪的游戏吧！</p>
          <router-link to="/games" class="browse-games-btn">
            <span>浏览游戏</span>
            <span>→</span>
          </router-link>
        </div>

        <!-- 购物车有商品 -->
        <div v-else class="cart-content">
          <div class="cart-layout">
            <!-- 商品列表 -->
            <div class="cart-items-section">
              <div class="section-header">
                <div class="select-all">
                  <input
                      type="checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      class="select-all-checkbox"
                  />
                  <span>全选</span>
                </div>
                <button class="clear-cart-btn" @click="clearCart">
                  清空购物车
                </button>
              </div>

              <div class="cart-items">
                <div
                    v-for="item in cartItems"
                    :key="item.id"
                    class="cart-item"
                    :class="{ selected: isItemSelected(item.id) }"
                >
                  <div class="item-select">
                    <input
                        type="checkbox"
                        :checked="isItemSelected(item.id)"
                        @change="toggleItemSelection(item.id)"
                        class="item-checkbox"
                    />
                  </div>

                  <div class="item-image" @click="viewGame(item.gameId)">
                    <img :src="item.image" :alt="item.name" />
                  </div>

                  <div class="item-info">
                    <h3 class="item-name" @click="viewGame(item.gameId)">
                      {{ item.name }}
                    </h3>
                    <p class="item-category">{{ getCategoryName(item.categoryId) }}</p>
                    <div class="item-price-info">
                      <span class="current-price">¥{{ item.price.toFixed(2) }}</span>
                      <span v-if="item.originalPrice > item.price" class="original-price">
                        ¥{{ item.originalPrice.toFixed(2) }}
                      </span>
                      <span v-if="item.originalPrice > item.price" class="discount-tag">
                        -{{ Math.round((1 - item.price / item.originalPrice) * 100) }}%
                      </span>
                    </div>
                  </div>

                  <div class="item-quantity">
                    <button
                        class="quantity-btn decrease"
                        @click="decreaseQuantity(item.id)"
                        :disabled="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="quantity-value">{{ item.quantity }}</span>
                    <button class="quantity-btn increase" @click="increaseQuantity(item.id)">
                      +
                    </button>
                  </div>

                  <div class="item-total">
                    <span class="total-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>

                  <div class="item-actions">
                    <button class="remove-btn" @click="removeItem(item.id)">
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 结算信息 -->
            <div class="checkout-section">
              <div class="checkout-card">
                <h3 class="checkout-title">订单信息</h3>

                <div class="checkout-summary">
                  <!-- 新增：商品原价总和 -->
                  <div class="summary-row">
                    <span>商品原价总和</span>
                    <span>¥{{ originalTotalPrice.toFixed(2) }}</span>
                  </div>

                  <!-- 新增：总折扣 -->
                  <div v-if="totalDiscount > 0" class="summary-row discount">
                    <span>总折扣</span>
                    <span>-¥{{ totalDiscount.toFixed(2) }}</span>
                  </div>

                  <!-- 商品总价 -->
                  <div class="summary-row">
                    <span>商品总价</span>
                    <span>¥{{ subtotal.toFixed(2) }}</span>
                  </div>

                  <div class="summary-row">
                    <span>手续费</span>
                    <span>免费</span>
                  </div>

                  <div class="summary-row total">
                    <span>应付金额</span>
                    <span>¥{{ totalPrice.toFixed(2) }}</span>
                  </div>
                </div>

                <!-- 支付方式 -->
                <div class="payment-section">
                  <h4 class="payment-title">支付方式</h4>
                  <div class="payment-options">
                    <button class="payment-option" :class="{ active: selectedPayment === 'alipay' }" @click="selectPayment('alipay')">
                      <img src="/images/icons/payment-alipay.png" alt="支付宝" class="payment-icon" />
                      <span>支付宝</span>
                    </button>
                    <button class="payment-option" :class="{ active: selectedPayment === 'wechat' }" @click="selectPayment('wechat')">
                      <img src="/images/icons/payment-wechat.png" alt="微信支付" class="payment-icon" />
                      <span>微信支付</span>
                    </button>
                    <button class="payment-option" :class="{ active: selectedPayment === 'card' }" @click="selectPayment('card')">
                      <img src="/images/icons/payment-credit.png" alt="信用卡" class="payment-icon" />
                      <span>信用卡</span>
                    </button>
                  </div>
                </div>

                <button class="checkout-btn" @click="handleCheckout">
                  去结算 (¥{{ totalPrice.toFixed(2) }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import HeaderNav from '@/components/common/HeaderNav.vue'
import Footer from '@/components/common/Footer.vue'
import { GAME_CATEGORIES } from '@/utils/constants'

const router = useRouter()
const store = useStore()

// 响应式数据
const selectedItems = ref([])
const selectedPayment = ref('alipay')

// 计算属性
const cartItems = computed(() => store.cart)

const isAllSelected = computed(() => {
  return cartItems.value.length > 0 &&
      selectedItems.value.length === cartItems.value.length
})

// 计算商品原价总和
const originalTotalPrice = computed(() => {
  return selectedItems.value.reduce((total, itemId) => {
    const item = cartItems.value.find(i => i.id === itemId)
    if (item) {
      // 如果有原价，使用原价；否则使用当前价格
      const originalPrice = item.originalPrice || item.price
      return total + (originalPrice * item.quantity)
    }
    return total
  }, 0)
})

// 计算总折扣（商品本身的折扣）
const totalDiscount = computed(() => {
  return selectedItems.value.reduce((discount, itemId) => {
    const item = cartItems.value.find(i => i.id === itemId)
    if (item && item.originalPrice && item.originalPrice > item.price) {
      // 计算单个商品的折扣金额乘以数量
      const itemDiscount = (item.originalPrice - item.price) * item.quantity
      return discount + itemDiscount
    }
    return discount
  }, 0)
})

const subtotal = computed(() => {
  return selectedItems.value.reduce((total, itemId) => {
    const item = cartItems.value.find(i => i.id === itemId)
    return total + (item ? item.price * item.quantity : 0)
  }, 0)
})

const totalPrice = computed(() => {
  return Math.max(0, subtotal.value)
})

// 方法
const isItemSelected = (itemId) => {
  return selectedItems.value.includes(itemId)
}

const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = cartItems.value.map(item => item.id)
  }
}

const selectAllItems = () => {
  selectedItems.value = cartItems.value.map(item => item.id)
}

const increaseQuantity = (itemId) => {
  store.updateQuantity(itemId, 1)
}

const decreaseQuantity = (itemId) => {
  const item = cartItems.value.find(i => i.id === itemId)
  if (item && item.quantity > 1) {
    store.updateQuantity(itemId, -1)
  }
}

const removeItem = (itemId) => {
  store.removeFromCart(itemId)
  // 从选中列表中移除
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  }
}

const clearCart = () => {
  if (confirm('确定要清空购物车吗？')) {
    store.clearCart()
    selectedItems.value = []
  }
}

const getCategoryName = (categoryId) => {
  const category = GAME_CATEGORIES.find(c => c.id === categoryId)
  return category ? category.name : '未知分类'
}

const handleCheckout = () => {
  if (selectedItems.value.length === 0) {
    alert('请选择要购买的商品')
    return
  }

  // 这里可以跳转到结算页面或调用结算API
  console.log('开始结算:', selectedItems.value)
  router.push('/checkout')
}

const viewGame = (gameId) => {
  router.push(`/games/${gameId}`)
}

const selectPayment = (paymentMethod) => {
  selectedPayment.value = paymentMethod
}

onMounted(() => {
  // 页面加载时选择所有商品
  selectAllItems()
})
</script>

<style scoped lang="scss">
.cart-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.cart-main {
  flex: 1;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: white;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.cart-stats {
  display: flex;
  gap: 20px;
  font-size: 1.1rem;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.empty-description {
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.8;
}

.browse-games-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
}

.cart-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  padding: 30px;
}

.cart-items-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }

  .select-all {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;

    .select-all-checkbox {
      width: 18px;
      height: 18px;
    }
  }

  .clear-cart-btn {
    padding: 8px 16px;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      background: #ff3742;
    }
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 40px 100px 1fr auto auto 40px;
  gap: 15px;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &.selected {
    background: #e3f2fd;
    border: 1px solid #2196f3;
  }

  .item-select {
    display: flex;
    justify-content: center;

    .item-checkbox {
      width: 18px;
      height: 18px;
    }
  }

  .item-image {
    width: 100px;
    height: 60px;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .item-info {
    .item-name {
      margin: 0 0 5px 0;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      color: #333;

      &:hover {
        color: #2196f3;
      }
    }

    .item-category {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .item-price-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .current-price {
        font-size: 1.2rem;
        font-weight: 700;
        color: #ff6b35;
      }

      .original-price {
        font-size: 0.9rem;
        color: #999;
        text-decoration: line-through;
      }

      .discount-tag {
        background: #ff6b35;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
      }
    }
  }

  .item-quantity {
    display: flex;
    align-items: center;
    gap: 10px;

    .quantity-btn {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;

      &:hover:not(:disabled) {
        background: #f0f0f0;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity-value {
      min-width: 30px;
      text-align: center;
      font-weight: 600;
    }
  }

  .item-total {
    .total-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #333;
    }
  }

  .item-actions {
    .remove-btn {
      width: 30px;
      height: 30px;
      border: none;
      background: #ff4757;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #ff3742;
      }
    }
  }
}

.checkout-section {
  .checkout-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 25px;
    position: sticky;
    top: 30px;
  }

  .checkout-title {
    margin: 0 0 20px 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
  }

  .checkout-summary {
    margin-bottom: 25px;

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      font-size: 1rem;

      &.discount {
        color: #ff6b35;
      }

      &.total {
        border-top: 2px solid #ddd;
        border-bottom: none;
        font-size: 1.3rem;
        font-weight: 700;
        color: #333;
        margin-top: 10px;
        padding-top: 15px;
      }

      span:first-child {
        color: #666;
      }

      span:last-child {
        font-weight: 600;
        color: #333;
      }
    }
  }

  .payment-section {
    margin-bottom: 25px;

    .payment-title {
      margin: 0 0 15px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }

    .payment-options {
      display: flex;
      gap: 10px;

      .payment-option {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 15px;
        border: 2px solid #ddd;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;

        &.active {
          border-color: #2196f3;
          background: #e3f2fd;
        }

        &:hover {
          border-color: #2196f3;
        }

        .payment-icon {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }

        span {
          font-size: 0.9rem;
          font-weight: 600;
        }
      }
    }
  }

  .checkout-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #ff6b35, #ff8e53);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }

  .cart-item {
    grid-template-columns: 30px 80px 1fr auto;
    grid-template-rows: auto auto;
    gap: 10px;

    .item-quantity,
    .item-total {
      grid-column: 3 / 5;
      justify-self: end;
    }

    .item-actions {
      grid-column: 4;
      grid-row: 1;
    }
  }

  .checkout-card {
    position: static !important;
  }
}
</style>