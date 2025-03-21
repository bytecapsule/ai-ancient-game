# 小学生打单词

一个有趣的英语单词练习游戏，帮助小学生通过游戏方式学习基础英语单词。

## 设计思路

### 1. 游戏模式

#### 简单模式
- 一次显示一个大号英文单词
- 玩家输入正确后会触发爆炸动画
- 爆炸的同时显示中文含义
- 中文会在爆炸动画结束后额外停留1秒
- 适合初学者，让玩家有充足时间记忆单词

#### 高级模式
- 多个单词从屏幕顶部落下
- 玩家需要在单词触底前输入正确
- 考验打字速度和反应能力
- 适合已经熟悉基础单词的学生

### 2. 词库设计
- 精选100个小学常用英语单词
- 按类别分类整理：
  - 基础名词（日常用品、动物、食物）
  - 家庭成员
  - 基础动词
  - 基础形容词
  - 颜色
  - 数字
  - 自然与天气
  - 代词和常用词
  - 时间词
  - 学校相关
  - 常用短语

### 3. 交互设计
- 清晰的菜单界面
- 大字号显示，方便阅读
- 即时的视觉反馈
- 鼓励性的评价系统

### 4. 学习设计
- 单词和中文翻译的展示时机精心设计
- 通过游戏化激发学习兴趣
- 根据完成情况给出鼓励性评价
- 支持反复练习

## 使用说明

### 1. 开始游戏
1. 在浏览器中打开index.html
2. 选择游戏模式：
   - 简单模式：适合初学者
   - 高级模式：适合进阶练习

### 2. 简单模式
- 屏幕中央会显示一个英文单词
- 在输入框中输入单词
- 输入正确后单词会爆炸并显示中文含义
- 记住中文含义后，会显示下一个单词
- 完成20个单词后游戏结束

### 3. 高级模式
- 单词会从屏幕顶部落下
- 在输入框中输入任意正在下落的单词
- 输入正确的单词会爆炸消失
- 如果单词触底未被击中则算失误
- 失误超过10个则游戏结束
- 完成20个单词后游戏结束

### 4. 评分规则
- 简单模式：根据正确输入的单词数量评价
- 高级模式：根据未击中的单词数量评价
  - 全部击中：完美胜利
  - 未击中≤10个：及格
  - 未击中>10个：游戏失败

## 技术实现

### 1. 核心技术
- HTML5 Canvas：实现游戏动画
- JavaScript：实现游戏逻辑
- CSS：实现界面样式

### 2. 主要功能模块
- words.js：单词库管理
- explosion.js：爆炸动画效果
- game.js：高级模式游戏逻辑
- simple-game.js：简单模式游戏逻辑

### 3. 动画效果
- 单词下落动画
- 爆炸粒子效果
- 中文翻译渐显渐隐

## 开发计划

### 后续优化方向
1. 添加更多单词分类
2. 增加难度级别选择
3. 添加音效和背景音乐
4. 实现成绩统计和进度保存
5. 添加自定义词库功能
6. 优化移动端适配
