# Daily Health Miniapp MVP

微信小程序原生 MVP，用于记录每日 to do list、饮水、健身、学习、饮食和睡眠。

## 页面

- 首页：今日概览和快速入口
- 今日记录：填写饮水、健身、学习、饮食、睡眠
- 待办：新增、完成、删除今日任务
- 历史：按日期查看过去记录

## 本地数据

数据保存在微信小程序本地缓存中，key 为 `DAILY_RECORDS_V1`。

结构是一个按日期索引的对象：

```js
{
  "2026-06-05": {
    date: "2026-06-05",
    water: { amount: 0, target: 2000 },
    workout: { checked: false, type: "", duration: 0 },
    study: { checked: false, content: "", duration: 0 },
    meals: { breakfast: "", lunch: "", dinner: "", snack: "" },
    sleep: { hours: 0, quality: "" },
    todos: []
  }
}
```

## 在微信开发者工具中运行

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本文件夹：`daily-health-miniapp`。
4. AppID 可选择“测试号”或使用你自己的 AppID。
5. 导入后点击“编译”即可运行。

## 后续接后端建议

- 保留 `utils/record.js` 的数据结构不变。
- 将 `utils/storage.js` 替换为云开发数据库或后端 API 适配层。
- 页面继续调用 `getRecordByDate`、`saveRecord`、`getAllRecords`，减少改动范围。
