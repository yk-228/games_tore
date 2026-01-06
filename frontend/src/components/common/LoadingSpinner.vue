<template>
  <div class="loading-spinner" :class="{ fullscreen }" :style="{ color }">
    <div class="spinner-container">
      <div class="spinner">
        <div class="spinner-circle"></div>
      </div>
      <div v-if="text" class="loading-text">{{ text }}</div>
      <div v-if="progress !== null" class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="progress-text">{{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  fullscreen: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: null
  },
  color: {
    type: String,
    default: '#1a73e8'
  }
})
</script>

<style scoped lang="scss">
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 17, 26, 0.9);
    backdrop-filter: blur(4px);
    z-index: 9999;
  }
}

.spinner-container {
  text-align: center;
  padding: 40px;
  background: rgba(42, 45, 58, 0.8);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  
  .fullscreen & {
    background: rgba(42, 45, 58, 0.95);
  }
}

.spinner {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.spinner-circle {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid;
  border-color: currentColor transparent transparent transparent;
  border-radius: 50%;
  animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-circle:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-circle:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-circle:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #b0b3c1;
  font-size: 16px;
  font-weight: 500;
  margin-top: 20px;
}

.loading-progress {
  margin-top: 24px;
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
    
    .progress-fill {
      height: 100%;
      background: currentColor;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  }
  
  .progress-text {
    color: currentColor;
    font-size: 14px;
    font-weight: 600;
  }
}

// 小尺寸
.loading-spinner.small {
  .spinner {
    width: 40px;
    height: 40px;
    
    .spinner-circle {
      width: 32px;
      height: 32px;
      border-width: 4px;
      margin: 4px;
    }
  }
  
  .loading-text {
    font-size: 14px;
  }
}

// 迷你尺寸
.loading-spinner.mini {
  .spinner {
    width: 24px;
    height: 24px;
    
    .spinner-circle {
      width: 16px;
      height: 16px;
      border-width: 2px;
      margin: 4px;
    }
  }
}
</style>