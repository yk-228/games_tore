CREATE DATABASE IF NOT EXISTS gamestore DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE gamestore;

CREATE TABLE IF NOT EXISTS t_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  avatar VARCHAR(255),
  role TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  sort INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS t_game (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category_id BIGINT NOT NULL,
  cover_url VARCHAR(255),
  banner_url VARCHAR(255),
  description TEXT,
  release_date DATE,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_game_category FOREIGN KEY (category_id) REFERENCES t_category(id)
);

CREATE TABLE IF NOT EXISTS t_cart (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  game_id BIGINT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_cart_user_game (user_id, game_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES t_user(id),
  CONSTRAINT fk_cart_game FOREIGN KEY (game_id) REFERENCES t_game(id)
);

CREATE TABLE IF NOT EXISTS t_order (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TINYINT DEFAULT 0,
  address_id BIGINT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES t_user(id)
);

CREATE TABLE IF NOT EXISTS t_order_item (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  game_id BIGINT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES t_order(id),
  CONSTRAINT fk_item_game FOREIGN KEY (game_id) REFERENCES t_game(id)
);

CREATE TABLE IF NOT EXISTS t_address (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  consignee VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  detail VARCHAR(255) NOT NULL,
  is_default TINYINT DEFAULT 0,
  CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES t_user(id)
);

INSERT INTO t_category(name, description, sort) VALUES
('动作', '动作冒险', 1), ('角色扮演', 'RPG', 2), ('策略', '策略塔防', 3);

INSERT INTO t_game(name, price, stock, category_id, cover_url, description) VALUES
('Elden Ring', 299.00, 50, 1, '/imgs/elden.jpg', '开放世界动作'),
('The Witcher 3', 99.00, 80, 2, '/imgs/witcher3.jpg', '经典 RPG'),
('Civilization VI', 149.00, 40, 3, '/imgs/civ6.jpg', '回合策略');

INSERT INTO t_user(username, password, email, phone) VALUES
('student1', '$2b$10$GbIvloVH4F7.z11B0WKhseiLX.UsL3/dR.SDxSKcvc2.wY3g/5FEm', 'student1@example.com', '13800000001');
