### 注
  - src下的 "constants / dataTrans / entitys / eventBus / lib / routers / server / services / stores / utils"这几个目录暂时别做任何修改, 后面需要做同步和抽离

### 目录
  - assets 静态资源
  - components 公共组件
  - entitys 实体类
  - lib 工具源码包
  - routers 路由
  - services 请求配置
  - stores 状态管理
  - utils 工具函数
  - views 页面
  - zstyles 样式 (目录规则同 "views" "components")
  - main.less less全局变量
  - index.less 全局css.class
  - .env.development 开发环境配置
  - .env.production 生产环境配置

### 开发
  - 文件引用路径 "@front/" 对应的是 "/src"
  - 组件中/js文件中 的 '函数/变量' 命名开头为'_' 则为'内部私有, 外部尽量不直接使用'

### 公共组件使用
  - SvgIcons
    - 图标组件; 使用 <SvtIcon name='Check' />
	- 开始使用
