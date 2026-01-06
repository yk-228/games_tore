# 游戏商城后端落地方案（实训版，JDK 17 + Spring Boot + MyBatis + MySQL 8）

本方案提供可直接落地的后端工程骨架、完整数据库设计与示例代码片段，满足学校实训对三层架构、RESTful 接口、分页、数据校验、全局异常、统一返回和跨域的要求。代码示例与 SQL 均可复制后直接使用或按需调整，与现有前端（Axios 调用）保持 JSON 交互。

## 1. 技术栈与项目结构
- **JDK 17**、**Spring Boot 3.x**、**MyBatis**、**MySQL 8.0**、**Maven**、**Lombok**
- 标准三层：`controller -> service -> dao (mapper) -> entity`
- 资源目录：`src/main/resources` 下存放 `application.yml` 与 `mapper/*.xml`

示例目录：
```
games-store-backend/
 ├─ pom.xml
 └─ src/main/java/com/example/gamestore
    ├─ GamestoreApplication.java
    ├─ common/   (统一返回、异常、分页封装)
    ├─ config/   (CORS、MyBatis、全局异常)
    ├─ controller/ (User/Game/Category/Cart/Order)
    ├─ service/ & service/impl/
    ├─ dao/mapper/
    └─ entity/
 └─ src/main/resources
    ├─ application.yml
    └─ mapper/*.xml
```

## 2. Maven 配置（pom.xml 精简示例）
```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>gamestore</artifactId>
  <version>1.0.0</version>
  <properties>
    <java.version>17</java.version>
    <spring.boot.version>3.2.5</spring.boot.version>
    <mybatis.spring.boot.version>3.0.3</mybatis.spring.boot.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.mybatis.spring.boot</groupId>
      <artifactId>mybatis-spring-boot-starter</artifactId>
      <version>${mybatis.spring.boot.version}</version>
    </dependency>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-j</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```

## 3. application.yml（示例，直接可用）
```yaml
server:
  port: 8080

spring:
  datasource:
    # 默认采用本地开发配置；生产环境务必切换到 application-prod.yml
    url: ${DB_URL:jdbc:mysql://localhost:3306/gamestore?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:123456}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jackson:
    time-zone: Asia/Shanghai
    serialization:
      WRITE_DATES_AS_TIMESTAMPS: false

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.gamestore.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

logging:
  level:
    root: info
    com.example.gamestore: debug
```
> 提示：数据库连接建议使用环境变量管理账号密码。生产环境请使用专用账户，并维持 SSL+证书校验；如本地需关闭 SSL，可将 `DB_URL` 设置为上方默认值。
>
> 开发/生产可使用 Spring Profile 区分：
> ```yaml
> # application-dev.yml
> spring:
>   datasource:
>     url: jdbc:mysql://localhost:3306/gamestore?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4
> # application-prod.yml
> spring:
>   datasource:
>     url: jdbc:mysql://db-host:3306/gamestore?useSSL=true&verifyServerCertificate=true&requireSSL=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4
> ```

## 4. 数据库设计与 SQL
数据库名：`gamestore`

**表结构与关系**
- `t_user` 用户表（1:N 购物车/订单/地址/评价）
- `t_category` 分类表（1:N 商品）
- `t_game` 游戏商品表（N:1 分类；N:M 订单明细、购物车）
- `t_cart` 购物车表（用户 N:M 商品，唯一约束 user+game）
- `t_order` 订单表（1:N 订单明细）
- `t_order_item` 订单明细表（N:1 订单，N:1 商品）
- `t_address` 收货地址（用户 1:N 地址）
- `t_review` 评价表（可选）

```sql
CREATE DATABASE IF NOT EXISTS gamestore DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE gamestore;

-- 用户表
CREATE TABLE IF NOT EXISTS t_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '加密密码',
  email VARCHAR(100) UNIQUE COMMENT '邮箱',
  phone VARCHAR(20) UNIQUE COMMENT '手机号',
  avatar VARCHAR(255) COMMENT '头像',
  role TINYINT DEFAULT 0 COMMENT '0=普通用户,1=管理员',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '用户';

-- 分类表
CREATE TABLE IF NOT EXISTS t_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名',
  description VARCHAR(255),
  sort INT DEFAULT 0
) COMMENT '游戏分类';

-- 游戏商品
CREATE TABLE IF NOT EXISTS t_game (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '游戏名',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  stock INT DEFAULT 0 COMMENT '库存',
  category_id BIGINT NOT NULL,
  cover_url VARCHAR(255),
  banner_url VARCHAR(255),
  description TEXT,
  release_date DATE,
  status TINYINT DEFAULT 1 COMMENT '1=上架,0=下架',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_game_category FOREIGN KEY (category_id) REFERENCES t_category(id)
) COMMENT '游戏商品';

-- 购物车
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
) COMMENT '购物车';

-- 订单主表
CREATE TABLE IF NOT EXISTS t_order (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TINYINT DEFAULT 0 COMMENT '0=待支付,1=已支付,2=已发货,3=已完成,4=已取消',
  address_id BIGINT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES t_user(id)
) COMMENT '订单';

-- 订单明细
CREATE TABLE IF NOT EXISTS t_order_item (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  game_id BIGINT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES t_order(id),
  CONSTRAINT fk_item_game FOREIGN KEY (game_id) REFERENCES t_game(id)
) COMMENT '订单明细';

-- 收货地址
CREATE TABLE IF NOT EXISTS t_address (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  consignee VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  detail VARCHAR(255) NOT NULL,
  is_default TINYINT DEFAULT 0,
  CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES t_user(id)
) COMMENT '收货地址';

-- 评价（可选）
CREATE TABLE IF NOT EXISTS t_review (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  game_id BIGINT NOT NULL,
  content VARCHAR(255),
  score TINYINT DEFAULT 5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES t_user(id),
  CONSTRAINT fk_review_game FOREIGN KEY (game_id) REFERENCES t_game(id)
) COMMENT '商品评价';

-- 基础测试数据
INSERT INTO t_category(name, description, sort) VALUES
('动作', '动作冒险', 1), ('角色扮演', 'RPG', 2), ('策略', '策略塔防', 3);

INSERT INTO t_game(name, price, stock, category_id, cover_url, description) VALUES
('Elden Ring', 299.00, 50, 1, '/imgs/elden.jpg', '开放世界动作'),
('The Witcher 3', 99.00, 80, 2, '/imgs/witcher3.jpg', '经典 RPG'),
('Civilization VI', 149.00, 40, 3, '/imgs/civ6.jpg', '回合策略');

INSERT INTO t_user(username, password, email, phone) VALUES
-- 本地测试可使用下方示例哈希（明文 DemoPwd@123）；生产请替换为你自己的强密码哈希。可用命令生成：
-- python - <<'PY'
-- import bcrypt
-- print(bcrypt.hashpw(b'YourStrongPwd', bcrypt.gensalt()).decode())
-- PY
('student1', '$2b$10$GbIvloVH4F7.z11B0WKhseiLX.UsL3/dR.SDxSKcvc2.wY3g/5FEm', 'student1@example.com', '13800000001');
```

## 5. 关键后端代码片段（可直接复制）
### 统一返回结果
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private int code; // 0 成功，其他失败
    private String msg;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, "success", data);
    }
    public static <T> ApiResponse<T> fail(String msg) {
        return new ApiResponse<>(-1, msg, null);
    }
}
```
### 全局异常处理
```java
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValid(MethodArgumentNotValidException e) {
        FieldError error = e.getBindingResult().getFieldError();
        String msg = error != null ? error.getDefaultMessage() : "请求参数有误";
        return ApiResponse.fail(msg);
    }
    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handle(Exception e) {
        String errorId = UUID.randomUUID().toString();
        log.error("Unhandled exception, errorId={}", errorId, e);
        return ApiResponse.fail("服务器异常，请稍后重试，错误编号：" + errorId);
    }
}
```

### CORS 最简配置
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                    .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

> 将 `allowedOrigins` 替换为实际前端域名；生产环境务必仅保留受信任域名。若无需携带 Cookie，可设置 `allowCredentials(false)` 并按需放宽方法与头信息。

### 实体示例
```java
@Data
public class Game {
    private Long id;
    @NotBlank(message = "游戏名必填")
    private String name;
    @NotNull(message = "价格必填")
    private BigDecimal price;
    private Integer stock;
    private Long categoryId;
    private String coverUrl;
    private String description;
}
```

### Mapper 与分页 SQL 示例（GameMapper.xml）
```xml
<mapper namespace="com.example.gamestore.dao.GameMapper">
  <select id="selectPage" resultType="com.example.gamestore.entity.Game">
    SELECT * FROM t_game
    <where>
      <if test="keyword != null and keyword != ''">
        AND name LIKE CONCAT('%', #{keyword}, '%')
      </if>
      <if test="categoryId != null">
        AND category_id = #{categoryId}
      </if>
    </where>
    ORDER BY created_at DESC
    LIMIT #{offset}, #{pageSize}
  </select>

  <select id="count" resultType="long">
    SELECT COUNT(1) FROM t_game
    <where>
      <if test="keyword != null and keyword != ''">
        AND name LIKE CONCAT('%', #{keyword}, '%')
      </if>
      <if test="categoryId != null">
        AND category_id = #{categoryId}
      </if>
    </where>
  </select>
</mapper>
```
> Service 层计算分页参数示例：
```java
int offset = (page - 1) * size;
Map<String, Object> params = new HashMap<>();
params.put("offset", offset);
params.put("pageSize", size);
return gameMapper.selectPage(params);
```

### 控制器示例（商品、用户、购物车、订单）
```java
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;

    @GetMapping
    public ApiResponse<PageResult<Game>> list(@RequestParam int page,
                                              @RequestParam int size,
                                              @RequestParam(required=false) Long categoryId,
                                              @RequestParam(required=false) String keyword) {
        return ApiResponse.success(gameService.pageQuery(page, size, categoryId, keyword));
    }

    @GetMapping("/{id}")
    public ApiResponse<Game> detail(@PathVariable Long id) {
        return ApiResponse.success(gameService.findById(id));
    }
}

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse<User> register(@Valid @RequestBody UserRegisterDTO dto) {
        return ApiResponse.success(userService.register(dto));
    }

    @PostMapping("/login")
    public ApiResponse<User> login(@RequestBody LoginDTO dto) {
        return ApiResponse.success(userService.login(dto));
    }

    @PutMapping("/profile")
    public ApiResponse<Void> update(@Valid @RequestBody UserProfileDTO dto) {
        userService.updateProfile(dto);
        return ApiResponse.success(null);
    }
}

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add")
    public ApiResponse<Void> add(@Valid @RequestBody CartAddDTO dto) {
        cartService.add(dto);
        return ApiResponse.success(null);
    }

    @GetMapping
    public ApiResponse<List<CartVO>> list(@RequestParam Long userId) {
        return ApiResponse.success(cartService.list(userId));
    }

    @PutMapping("/{cartId}")
    public ApiResponse<Void> update(@PathVariable Long cartId, @RequestParam Integer quantity) {
        cartService.updateQuantity(cartId, quantity);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{cartId}")
    public ApiResponse<Void> delete(@PathVariable Long cartId) {
        cartService.delete(cartId);
        return ApiResponse.success(null);
    }
}

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ApiResponse<Order> create(@Valid @RequestBody OrderCreateDTO dto) {
        return ApiResponse.success(orderService.create(dto));
    }

    @GetMapping
    public ApiResponse<PageResult<OrderVO>> myOrders(@RequestParam Long userId,
                                                     @RequestParam int page,
                                                     @RequestParam int size) {
        return ApiResponse.success(orderService.pageUserOrders(userId, page, size));
    }
}
```

## 6. 运行与联调步骤
1. 安装 JDK 17、MySQL 8，创建数据库并执行上方 SQL。
2. 将上述 `pom.xml`、`application.yml` 与代码片段放入新建的 Spring Boot 工程（可用 IDEA Spring Initializr 创建骨架）。
3. 运行 `mvn clean package`，再运行 `GamestoreApplication` 启动，默认端口 `8080`。
4. 前端 Axios 基础配置：`baseURL` 指向 `http://localhost:8080/api`，注意携带必要的 `userId` 或登录态。
5. 使用 Postman 验证接口（示例）：
   - `POST /api/users/register` body: `{ "username":"test","password":"123456" }`
   - `GET /api/games?page=1&size=10`
   - `POST /api/cart/add` body: `{ "userId":1,"gameId":1,"quantity":1 }`
   - `POST /api/orders` body: `{ "userId":1,"addressId":1 }`

## 7. 核心亮点（实训加分）
- 标准三层 + MyBatis XML 映射，便于讲解 SQL 与分页。
- 统一返回 + 全局异常 + 参数校验，接口输出稳定。
- 跨域全局配置，前端无需额外代理即可直连。
- LIMIT 分页、模糊搜索、分类筛选示例，贴合商城常见需求。
- SQL 与测试数据齐备，开箱即可联调。

## 8. 常见问题排查
- **数据库连不上**：确认 `application.yml` 的 `url/username/password` 与 MySQL 时区参数；端口被占用时调整 `server.port`。
- **跨域报错**：确认 `CorsConfig` 已包含前端实际域名；或在前端将 `baseURL` 指向同源地址避免跨域。
- **分页失效**：检查前端 page/size 参数是否从 1 开始；后端 offset= `(page-1)*size`。
- **字段校验失败**：查看返回的提示信息，DTO 上的 `@NotBlank/@NotNull` 提示即原因。
- **500 异常**：查看控制台/日志，`GlobalExceptionHandler` 会返回 `msg` 便于定位。

> 将本文件中的 SQL 与代码片段粘贴到新建的 Spring Boot 工程即可完成后端搭建，满足前端调用与实训答辩要求。
