// Mock API implementation
// This replaces the axios-based API with a virtual one using localStorage

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Initialization
const initMockData = () => {
    if (!localStorage.getItem('mock_games')) {
        const games = [
            {
                id: 1,
                title: 'Elden Ring',
                price: 298,
                originalPrice: 298,
                cover: '/images/games/elden-ring.jpg',
                description: 'The Golden Order has been broken. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
                rating: 4.8,
                tags: ['RPG', 'Open World', 'Souls-like'],
                releaseDate: '2022-02-25',
                developer: 'FromSoftware',
                publisher: 'Bandai Namco'
            },
            {
                id: 2,
                title: 'Cyberpunk 2077',
                price: 149,
                originalPrice: 298,
                cover: '/images/games/cyberpunk-2077.jpg',
                description: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.',
                rating: 4.5,
                tags: ['Sci-Fi', 'Open World', 'RPG'],
                releaseDate: '2020-12-10',
                developer: 'CD PROJEKT RED',
                publisher: 'CD PROJEKT RED'
            },
            {
                id: 3,
                title: 'God of War',
                price: 279,
                originalPrice: 279,
                cover: '/images/games/god-of-war.jpg',
                description: 'His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.',
                rating: 4.9,
                tags: ['Action', 'Adventure', 'Mythology'],
                releaseDate: '2022-01-14',
                developer: 'Santa Monica Studio',
                publisher: 'PlayStation PC LLC'
            },
            {
                id: 4,
                title: 'FIFA 23',
                price: 248,
                originalPrice: 248,
                cover: '/images/games/fifa23.jpg',
                description: 'Experience The World\'s Game with 19,000+ players, 700+ teams, 100+ stadiums, and 30+ leagues.',
                rating: 4.0,
                tags: ['Sports', 'Soccer', 'Multiplayer'],
                releaseDate: '2022-09-30',
                developer: 'EA Canada',
                publisher: 'Electronic Arts'
            },
            {
                id: 5,
                title: 'Minecraft',
                price: 89,
                originalPrice: 89,
                cover: '/images/games/minecraft.jpg',
                description: 'Explore your own unique world, survive the night, and create anything you can imagine!',
                rating: 4.8,
                tags: ['Sandbox', 'Survival', 'Multiplayer'],
                releaseDate: '2011-11-18',
                developer: 'Mojang Studios',
                publisher: 'Xbox Game Studios'
            },
            {
                id: 6,
                title: 'Red Dead Redemption 2',
                price: 249,
                originalPrice: 249,
                cover: '/images/games/red-dead-redemption.jpg',
                description: 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age.',
                rating: 4.9,
                tags: ['Open World', 'Action', 'Western'],
                releaseDate: '2019-12-05',
                developer: 'Rockstar Games',
                publisher: 'Rockstar Games'
            },
            {
                id: 7,
                title: 'The Witcher 3: Wild Hunt',
                price: 127,
                originalPrice: 127,
                cover: '/images/games/the-witcher.jpg',
                description: 'You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.',
                rating: 4.9,
                tags: ['RPG', 'Open World', 'Fantasy'],
                releaseDate: '2015-05-18',
                developer: 'CD PROJEKT RED',
                publisher: 'CD PROJEKT RED'
            },
            {
                id: 8,
                title: 'Hogwarts Legacy',
                price: 298,
                originalPrice: 298,
                cover: '/images/games/hogwarts-legacy.jpg',
                description: 'Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books.',
                rating: 4.7,
                tags: ['RPG', 'Open World', 'Magic'],
                releaseDate: '2023-02-10',
                developer: 'Avalanche Software',
                publisher: 'Warner Bros. Games'
            },
            {
                id: 9,
                title: 'Valorant',
                price: 0,
                originalPrice: 0,
                cover: '/images/games/valorant.jpg',
                description: 'A 5v5 character-based tactical shooter.',
                rating: 4.5,
                tags: ['FPS', 'Multiplayer', 'Tactical'],
                releaseDate: '2020-06-02',
                developer: 'Riot Games',
                publisher: 'Riot Games'
            },
            {
                id: 10,
                title: 'CS:GO',
                price: 0,
                originalPrice: 0,
                cover: '/images/games/csgo.jpg',
                description: 'Counter-Strike: Global Offensive (CS: GO) expands upon the team-based action gameplay that it pioneered when it was launched 19 years ago.',
                rating: 4.6,
                tags: ['FPS', 'Multiplayer', 'Tactical'],
                releaseDate: '2012-08-21',
                developer: 'Valve',
                publisher: 'Valve'
            },
            {
                id: 11,
                title: 'Dota 2',
                price: 0,
                originalPrice: 0,
                cover: '/images/games/dota2.jpg',
                description: 'Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes.',
                rating: 4.4,
                tags: ['MOBA', 'Multiplayer', 'Strategy'],
                releaseDate: '2013-07-09',
                developer: 'Valve',
                publisher: 'Valve'
            },
            {
                id: 12,
                title: 'League of Legends',
                price: 0,
                originalPrice: 0,
                cover: '/images/games/league-of-legends.jpg',
                description: 'League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the other\'s base.',
                rating: 4.3,
                tags: ['MOBA', 'Multiplayer', 'Strategy'],
                releaseDate: '2009-10-27',
                developer: 'Riot Games',
                publisher: 'Riot Games'
            }
        ];
        localStorage.setItem('mock_games', JSON.stringify(games));
    }

    if (!localStorage.getItem('mock_banners')) {
        const banners = [
            { id: 1, image: '/images/banners/banner1.jpg', title: 'Summer Sale', link: '/games/1' },
            { id: 2, image: '/images/banners/banner2.jpg', title: 'New Release', link: '/games/2' },
            { id: 3, image: '/images/banners/banner3.jpg', title: 'Featured', link: '/games/3' }
        ];
        localStorage.setItem('mock_banners', JSON.stringify(banners));
    }

    if (!localStorage.getItem('mock_users')) {
        localStorage.setItem('mock_users', JSON.stringify([]));
    }
};

initMockData();

const getGames = () => JSON.parse(localStorage.getItem('mock_games'));
const getBanners = () => JSON.parse(localStorage.getItem('mock_banners'));
const getUsers = () => JSON.parse(localStorage.getItem('mock_users'));
const saveUsers = (users) => localStorage.setItem('mock_users', JSON.stringify(users));

export const authAPI = {
    login: async (data) => {
        await delay(500);
        const users = getUsers();
        // 支持邮箱或用户名登录 - 优先按邮箱查找，再按用户名查找
        const user = users.find(u => u.email === data.email || u.username === data.email || u.username === data.username);
        if (user && user.password === data.password) {
            const token = 'mock-token-' + Date.now();
            const userData = { ...user };
            delete userData.password;
            return { success: true, data: { token, user: userData } };
        }
        return { success: false, message: '用户名或密码错误' };
    },
    register: async (data) => {
        await delay(800);
        const users = getUsers();
        if (users.find(u => u.username === data.username)) {
            return { success: false, error: 'USERNAME_ALREADY_EXISTS', message: '用户名已存在' };
        }
        if (users.find(u => u.email === data.email)) {
            return { success: false, error: 'EMAIL_ALREADY_EXISTS', message: '邮箱已存在' };
        }

        const newUser = {
            id: Date.now(),
            username: data.username,
            email: data.email,
            password: data.password,
            phone: data.phone,
            avatar: '/images/avatars/default-avatar.png',
            balance: 0,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        const token = 'mock-token-' + Date.now();
        const userData = { ...newUser };
        delete userData.password;

        return {
            success: true,
            data: {
                token,
                user: userData,
                welcomeBonus: { discount: '20' }
            }
        };
    },
    forgotPassword: async () => { await delay(500); return { success: true }; },
    verifyResetCode: async () => { await delay(500); return { success: true }; },
    resetPassword: async () => { await delay(500); return { success: true }; },
    resendResetCode: async () => { await delay(500); return { success: true }; },
    getCaptcha: async () => {
        await delay(100);
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 100, 40);
        ctx.fillStyle = '#333';
        ctx.font = '20px Arial';
        ctx.fillText(Math.floor(1000 + Math.random() * 9000).toString(), 20, 28);
        return new Promise(resolve => canvas.toBlob(resolve));
    }
};

export const gameAPI = {
    getAllGames: async (params) => {
        await delay(300);
        return { success: true, data: getGames() };
    },
    getGameById: async (id) => {
        await delay(200);
        const game = getGames().find(g => g.id == id);
        return { success: true, data: game };
    },
    searchGames: async (keyword) => {
        await delay(300);
        const games = getGames().filter(g => g.title.toLowerCase().includes(keyword.toLowerCase()));
        return { success: true, data: games };
    },
    buyGame: async (gameId) => {
        await delay(500);
        return { success: true, message: '购买成功' };
    },
    getFeaturedGames: async () => {
        await delay(200);
        return { success: true, data: getGames().slice(0, 4) };
    },
    getDiscountedGames: async () => {
        await delay(200);
        return { success: true, data: getGames().filter(g => g.price < g.originalPrice).slice(0, 4) };
    },
    getGames: async () => {
        await delay(300);
        return { success: true, data: getGames() };
    },
    purchaseGame: async (gameId) => {
        await delay(500);
        return { success: true, message: '购买成功' };
    },
    getCollections: async () => {
        await delay(200);
        return { success: true, data: [] };
    },
    getBanners: async () => {
        await delay(200);
        return { success: true, data: getBanners() };
    }
};

export const userAPI = {
    getProfile: async () => {
        await delay(200);
        // Mock: return the last registered user or a default one
        const users = getUsers();
        const user = users.length > 0 ? users[users.length - 1] : { id: 1, username: 'Guest', email: 'guest@example.com', balance: 0, avatar: '/images/avatars/default-avatar.png' };
        const userData = { ...user };
        delete userData.password;
        return { success: true, data: userData };
    },
    updateProfile: async (data) => {
        await delay(500);
        return { success: true, data };
    },
    getPurchaseHistory: async () => {
        await delay(300);
        return { success: true, data: [] };
    },
    getWishlist: async () => {
        await delay(300);
        return { success: true, data: [] };
    }
};

// Default export to satisfy imports like "import api from '@/api'"
const api = {
    get: async () => ({ data: {} }),
    post: async () => ({ data: {} }),
    put: async () => ({ data: {} }),
    delete: async () => ({ data: {} }),
    interceptors: {
        request: { use: () => {} },
        response: { use: () => {} }
    }
};

export default api;

