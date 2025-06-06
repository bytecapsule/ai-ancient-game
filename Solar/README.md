# 太阳系模拟器

一个基于 Three.js 的简单太阳系模拟器，展示了太阳系中的八大行星围绕太阳运转的场景。

## 特点

- 使用 WebGL 实现的 3D 渲染
- 行星按照相对比例和距离进行展示
- 每个行星都有独特的颜色和光照效果
- 行星轨道可视化
- 背景星空效果
- 支持鼠标交互：
  - 拖动旋转视角
  - 滚轮缩放

## 行星特征

- 太阳：明亮的黄色发光体，位于中心
- 水星：灰色小行星，最靠近太阳
- 金星：金黄色，大小仅次于地球
- 地球：蓝色，代表海洋
- 火星：红色，代表红色星球
- 木星：橙色，太阳系最大的行星
- 土星：金色，太阳系第二大行星
- 天王星：青色，代表其特殊的大气成分
- 海王星：深蓝色，太阳系最远的行星

## 技术实现

- 使用 Three.js 进行 3D 渲染
- 使用 ES6 模块化开发
- 使用 OrbitControls 实现相机控制
- 使用 MeshPhongMaterial 实现行星材质效果
- 使用 PointLight 和 AmbientLight 实现光照效果

## 使用方法

直接在浏览器中打开 index.html 即可运行。支持所有现代浏览器。

## 操作说明

- 鼠标左键拖动：旋转视角
- 鼠标滚轮：缩放场景
- 鼠标右键拖动：平移视角
