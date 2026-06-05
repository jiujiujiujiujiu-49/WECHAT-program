# Daily Health Miniapp

微信小程序原生项目骨架，用于后续实现每日 to do list、饮水、健身、学习、饮食和睡眠记录。

## 页面

- `pages/index/index`：首页，占位展示今日概览入口。
- `pages/today/today`：今日记录，占位展示饮水、健身、学习、饮食、睡眠模块。
- `pages/todo/todo`：To Do List，占位展示待办列表。
- `pages/history/history`：历史记录，占位展示历史列表。

当前版本只包含基础 UI 占位，不包含复杂业务逻辑。

## 文件作用

- `app.js`：小程序入口文件，当前仅保留全局数据对象。
- `app.json`：注册页面、窗口样式和底部 tabBar。
- `app.wxss`：全局样式，定义页面、卡片、输入和按钮等基础样式。
- `project.config.json`：微信开发者工具项目配置。
- `project.private.config.json`：微信开发者工具生成的本地个人配置。
- `sitemap.json`：小程序页面索引规则。
- `pages/*/*.json`：单个页面的导航标题配置。
- `pages/*/*.wxml`：页面结构。
- `pages/*/*.wxss`：页面局部样式。
- `pages/*/*.js`：页面数据和生命周期逻辑。
- `utils/storage.js`：本地存储模块，按 `daily-record-YYYY-MM-DD` 保存每天的数据。

## 在微信开发者工具中运行

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本文件夹：`daily-health-miniapp`。
4. AppID 可选择“测试号”或使用你自己的 AppID。
5. 导入后点击“编译”即可运行。

## 下一步

可以从 `pages/today/today` 开始逐步加入本地存储和表单逻辑。
