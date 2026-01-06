import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    cart: [],
    games: [],
    loading: false
  }),

  actions: {
    setUser(user) {
      this.user = user
    },

    setToken(token) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    addToCart(game) {
      const existing = this.cart.find(item => item.id === game.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.cart.push({ ...game, quantity: 1 })
      }
    },

    removeFromCart(gameId) {
      this.cart = this.cart.filter(item => item.id !== gameId)
    },

    clearCart() {
      this.cart = []
    },

    setGames(games) {
      this.games = games
    },

    // 添加缺失的updateQuantity方法
    updateQuantity(gameId, change) {
      const item = this.cart.find(item => item.id === gameId)
      if (item) {
        item.quantity += change
        // 确保数量至少为1
        if (item.quantity < 1) {
          item.quantity = 1
        }
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    cartCount: (state) => {
      return state.cart.reduce((count, item) => count + item.quantity, 0)
    }
  }
})