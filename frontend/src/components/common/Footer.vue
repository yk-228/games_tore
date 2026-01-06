<template>
  <footer class="main-footer">
    <div class="footer-container">
      <!-- 顶部区域 -->
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/images/icons/logo.png" alt="游戏商店" />
            <span class="logo-text">游戏商店</span>
          </div>
          <p class="footer-description">
            全球领先的数字游戏发行平台<br>
            发现、购买和体验精彩的游戏世界
          </p>
          <div class="social-links">
            <a href="#" class="social-link weibo">微博</a>
            <a href="#" class="social-link wechat">微信</a>
            <a href="#" class="social-link qq">QQ</a>
            <a href="#" class="social-link bilibili">B站</a>
          </div>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h3 class="link-title">购买指南</h3>
            <a href="#" class="link-item">如何购买</a>
            <a href="#" class="link-item">支付方式</a>
            <a href="#" class="link-item">价格说明</a>
            <a href="#" class="link-item">折扣优惠</a>
            <a href="#" class="link-item">礼包购买</a>
          </div>
          
          <div class="link-group">
            <h3 class="link-title">客户服务</h3>
            <a href="#" class="link-item">帮助中心</a>
            <a href="#" class="link-item">退款政策</a>
            <a href="#" class="link-item">技术支持</a>
            <a href="#" class="link-item">账号问题</a>
            <a href="#" class="link-item">客服中心</a>
          </div>
          
          <div class="link-group">
            <h3 class="link-title">关于我们</h3>
            <a href="#" class="link-item">公司介绍</a>
            <a href="#" class="link-item">联系我们</a>
            <a href="#" class="link-item">招贤纳士</a>
            <a href="#" class="link-item">合作伙伴</a>
            <a href="#" class="link-item">媒体报道</a>
          </div>
          
          <div class="link-group">
            <h3 class="link-title">法律条款</h3>
            <a href="#" class="link-item">服务条款</a>
            <a href="#" class="link-item">隐私政策</a>
            <a href="#" class="link-item">用户协议</a>
            <a href="#" class="link-item">儿童隐私</a>
            <a href="#" class="link-item">法律声明</a>
          </div>
        </div>
      </div>
      
      <!-- 支付方式 -->
      <div class="payment-methods">
        <h3 class="payment-title">支付方式</h3>
        <div class="payment-icons">
          <img src="/images/icons/payment-alipay.png" alt="支付宝" />
          <img src="/images/icons/payment-wechat.png" alt="微信支付" />
          <img src="/images/icons/payment-credit.png" alt="信用卡" />
          <span class="payment-text">银联</span>
          <span class="payment-text">PayPal</span>
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>© 2024 游戏商店 Game Store. 保留所有权利。</p>
          <p>地址：中国北京市海淀区数字科技园</p>
          <p>电话：400-123-4567 | 邮箱：support@gamestore.com</p>
        </div>
        
        <div class="footer-extra">
          <div class="certifications">
            <span class="cert-badge">🛡️ 安全认证</span>
            <span class="cert-badge">🔒 SSL加密</span>
            <span class="cert-badge">✅ 正版授权</span>
          </div>
          
          <div class="language-selector">
            <select v-model="selectedLanguage" class="language-select">
              <option value="zh-CN">简体中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 备案信息 -->
      <div class="icp-info">
        <p>
          <a href="https://beian.miit.gov.cn" target="_blank">京ICP备 12345678号-1</a>
          | 京公网安备 11010502034567号
        </p>
        <p>网络文化经营许可证：京网文[2024]1234-567号</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const selectedLanguage = ref('zh-CN')
</script>

<style scoped lang="scss">
.main-footer {
  background: #0f111a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 60px 0 20px;
  color: #b0b3c1;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 60px;
  margin-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.footer-brand {
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    img {
      height: 40px;
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
  
  .footer-description {
    line-height: 1.6;
    margin-bottom: 24px;
    color: #8a8d9b;
  }
  
  .social-links {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    
    .social-link {
      padding: 8px 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      color: #b0b3c1;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(26, 115, 232, 0.2);
        color: white;
        transform: translateY(-2px);
      }
      
      &.weibo {
        &:hover {
          background: #ff8140;
          color: white;
        }
      }
      
      &.wechat {
        &:hover {
          background: #07c160;
          color: white;
        }
      }
      
      &.qq {
        &:hover {
          background: #12b7f5;
          color: white;
        }
      }
      
      &.bilibili {
        &:hover {
          background: #fb7299;
          color: white;
        }
      }
    }
  }
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
  
  .link-group {
    .link-title {
      font-size: 18px;
      font-weight: 600;
      color: white;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid rgba(26, 115, 232, 0.3);
    }
    
    .link-item {
      display: block;
      color: #8a8d9b;
      text-decoration: none;
      padding: 8px 0;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        color: white;
        transform: translateX(5px);
      }
    }
  }
}

.payment-methods {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  
  .payment-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .payment-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    
    img {
      height: 32px;
      width: auto;
      filter: grayscale(1);
      opacity: 0.8;
      transition: all 0.3s ease;
      
      &:hover {
        filter: grayscale(0);
        opacity: 1;
      }
    }
    
    .payment-text {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-size: 14px;
      color: #b0b3c1;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(26, 115, 232, 0.2);
        color: white;
      }
    }
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .copyright {
    p {
      margin: 4px 0;
      font-size: 14px;
      color: #8a8d9b;
    }
  }
  
  .footer-extra {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-end;
    
    @media (max-width: 768px) {
      align-items: center;
    }
    
    .certifications {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: flex-end;
      
      .cert-badge {
        padding: 6px 12px;
        background: rgba(26, 115, 232, 0.1);
        border-radius: 6px;
        font-size: 12px;
        color: #1a73e8;
      }
    }
    
    .language-selector {
      .language-select {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        padding: 8px 16px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: #1a73e8;
        }
        
        &:focus {
          outline: none;
          border-color: #1a73e8;
          box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
        }
        
        option {
          background: #2a2d3a;
          color: white;
        }
      }
    }
  }
}

.icp-info {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    margin: 8px 0;
    font-size: 12px;
    color: #8a8d9b;
    
    a {
      color: #8a8d9b;
      text-decoration: none;
      
      &:hover {
        color: #1a73e8;
        text-decoration: underline;
      }
    }
  }
}
</style>