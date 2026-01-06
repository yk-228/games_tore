// 游戏分类
export const GAME_CATEGORIES = [
  { id: 'action', name: '动作' },
  { id: 'adventure', name: '冒险' },
  { id: 'rpg', name: '角色扮演' },
  { id: 'shooter', name: '射击' },
  { id: 'strategy', name: '策略' },
  { id: 'sports', name: '体育' },
  { id: 'racing', name: '竞速' },
  { id: 'simulation', name: '模拟' },
  { id: 'indie', name: '独立' },
  { id: 'multiplayer', name: '多人游戏' }
]

// 折扣标签
export const DISCOUNT_TAGS = [
  { label: '-33%', color: '#ff6b6b' },
  { label: '-40%', color: '#ffa502' },
  { label: '-50%', color: '#2ed573' },
  { label: '-60%', color: '#1e90ff' },
  { label: '-75%', color: '#9b59b6' }
]

// 支付方式
export const PAYMENT_METHODS = [
  { id: 1, name: '支付宝', icon: 'payment-alipay.png' },
  { id: 2, name: '微信支付', icon: 'payment-wechat.png' },
  { id: 3, name: '信用卡', icon: 'payment-credit.png' }
]

// 游戏标签
export const GAME_TAGS = [
  '多人', '单人', '在线合作', 'PVP', 'PVE', '开放世界',
  '生存', '恐怖', '科幻', '奇幻', '历史', '竞速',
  '体育', '策略', '塔防', '解谜', '平台游戏', '格斗'
]

// 排序选项
export const SORT_OPTIONS = [
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
  { value: 'discount_desc', label: '折扣力度' },
  { value: 'newest', label: '最新发布' },
  { value: 'popular', label: '人气最高' }
]

// 游戏数据（模拟）
export const GAMES_DATA = [
  {
    id: 1,
    title: 'RAFT THE FINAL CHAPTER',
    subtitle: '无尽的海洋冒险',
    image: '/images/games/raft.jpg',
    originalPrice: 98.00,
    price: 45.56,
    discount: '-33%',
    tags: ['生存', '冒险', '多人', '开放世界'],
    categories: ['adventure', 'multiplayer'],
    description: '在广阔的海上生存并建立你的木筏帝国',
    releaseDate: '2023-06-13',
    rating: 4.5,
    players: 10000
  },
  {
    id: 2,
    title: '无尽帝国2',
    subtitle: '建立你的永恒帝国',
    image: '/images/games/endless-legend-2.jpg',
    originalPrice: 199.00,
    price: 119.40,
    discount: '-40%',
    tags: ['策略', '4X', '奇幻', '回合制'],
    categories: ['strategy'],
    description: '在神秘的奇幻世界中建立你的帝国',
    releaseDate: '2023-11-15',
    rating: 4.7,
    players: 8500
  },
  {
    id: 3,
    title: 'The Elder Scrolls IV: OBLIVION',
    subtitle: '重制版现已推出',
    image: '/images/games/oblivion.jpg',
    originalPrice: 249.00,
    price: 166.83,
    discount: '-33%',
    tags: ['RPG', '开放世界', '奇幻', '冒险'],
    categories: ['rpg', 'adventure'],
    description: '经典奇幻RPG游戏重制版',
    releaseDate: '2023-09-05',
    rating: 4.8,
    players: 15000
  },
  {
    id: 4,
    title: 'HALO',
    subtitle: '传奇归来',
    image: '/images/games/halo.jpg',
    originalPrice: 96.00,
    price: 67.25,
    discount: '-75%',
    tags: ['射击', '科幻', '多人', 'FPS'],
    categories: ['shooter', 'multiplayer'],
    description: '传奇的科幻射击游戏系列',
    releaseDate: '2022-03-01',
    rating: 4.6,
    players: 25000
  },
  {
    id: 5,
    title: '猎杀：对决1896',
    subtitle: '猎人还是猎物？',
    image: '/images/games/hunt.jpg',
    originalPrice: 89.00,
    price: 35.60,
    discount: '-60%',
    tags: ['射击', 'PVP', '恐怖', '多人'],
    categories: ['shooter', 'multiplayer'],
    description: '在这款暗黑生存PVP射击游戏中对抗邪恶',
    releaseDate: '2019-08-27',
    rating: 4.3,
    players: 12000
  },
  {
    id: 6,
    title: 'STARFIELD',
    subtitle: '探索无尽宇宙',
    image: '/images/games/starfield.jpg',
    originalPrice: 296.00,
    price: 178.80,
    discount: '-40%',
    tags: ['RPG', '科幻', '太空', '开放世界'],
    categories: ['rpg', 'adventure'],
    description: '探索广阔的宇宙',
    releaseDate: '2023-09-06',
    rating: 4.4,
    players: 30000
  },
  {
    id: 7,
    title: 'Cyberpunk 2077',
    subtitle: '夜之城',
    image: '/images/games/cyberpunk-2077.jpg',
    originalPrice: 298.00,
    price: 149.00,
    discount: '-50%',
    tags: ['RPG', '开放世界', '科幻', '赛博朋克'],
    categories: ['rpg', 'action'],
    description: '未来世界的开放世界角色扮演游戏',
    releaseDate: '2020-12-10',
    rating: 4.2,
    players: 50000
  },
  {
    id: 8,
    title: 'Elden Ring',
    subtitle: '交界地',
    image: '/images/games/elden-ring.jpg',
    originalPrice: 298.00,
    price: 208.60,
    discount: '-30%',
    tags: ['动作', 'RPG', '开放世界', '奇幻'],
    categories: ['action', 'rpg'],
    description: '宫崎英高打造的史诗级开放世界游戏',
    releaseDate: '2022-02-25',
    rating: 4.9,
    players: 75000
  },
  {
    id: 9,
    title: 'God of War',
    subtitle: '战神',
    image: '/images/games/god-of-war.jpg',
    originalPrice: 279.00,
    price: 139.50,
    discount: '-50%',
    tags: ['动作', '冒险', '神话', '单人'],
    categories: ['action', 'adventure'],
    description: '奎托斯的北欧神话之旅',
    releaseDate: '2022-01-14',
    rating: 4.8,
    players: 40000
  },
  {
    id: 10,
    title: 'Hogwarts Legacy',
    subtitle: '霍格沃茨的遗产',
    image: '/images/games/hogwarts-legacy.jpg',
    originalPrice: 298.00,
    price: 208.60,
    discount: '-30%',
    tags: ['RPG', '开放世界', '魔法', '冒险'],
    categories: ['rpg', 'adventure'],
    description: '体验魔法世界的开放世界冒险',
    releaseDate: '2023-02-10',
    rating: 4.7,
    players: 60000
  },
  {
    id: 11,
    title: 'Minecraft',
    subtitle: '我的世界',
    image: '/images/games/minecraft.jpg',
    originalPrice: 165.00,
    price: 99.00,
    discount: '-40%',
    tags: ['沙盒', '创造', '生存', '多人'],
    categories: ['adventure', 'simulation'],
    description: '无限可能的沙盒创造游戏',
    releaseDate: '2011-11-18',
    rating: 4.9,
    players: 1000000
  },
  {
    id: 12,
    title: 'Red Dead Redemption 2',
    subtitle: '荒野大镖客2',
    image: '/images/games/red-dead-redemption.jpg',
    originalPrice: 249.00,
    price: 124.50,
    discount: '-50%',
    tags: ['动作', '冒险', '开放世界', '西部'],
    categories: ['action', 'adventure'],
    description: '体验美国西部的史诗冒险',
    releaseDate: '2019-11-05',
    rating: 4.8,
    players: 80000
  },
  {
    id: 13,
    title: 'FIFA 23',
    subtitle: '终极球队',
    image: '/images/games/fifa23.jpg',
    originalPrice: 248.00,
    price: 124.00,
    discount: '-50%',
    tags: ['体育', '足球', '多人', '竞技'],
    categories: ['sports'],
    description: '最真实的足球游戏体验',
    releaseDate: '2022-09-27',
    rating: 4.3,
    players: 45000
  },
  {
    id: 14,
    title: 'The Witcher 3',
    subtitle: '狂猎',
    image: '/images/games/the-witcher.jpg',
    originalPrice: 158.00,
    price: 31.60,
    discount: '-80%',
    tags: ['RPG', '开放世界', '奇幻', '冒险'],
    categories: ['rpg', 'adventure'],
    description: '杰洛特的史诗冒险之旅',
    releaseDate: '2015-05-19',
    rating: 4.9,
    players: 150000
  },
  {
    id: 15,
    title: 'Valorant',
    subtitle: '无畏契约',
    image: '/images/games/valorant.jpg',
    originalPrice: 0,
    price: 0,
    discount: '',
    tags: ['射击', '多人', '战术', '竞技'],
    categories: ['shooter', 'multiplayer'],
    description: '5v5战术射击游戏',
    releaseDate: '2020-06-02',
    rating: 4.5,
    players: 200000
  }
]