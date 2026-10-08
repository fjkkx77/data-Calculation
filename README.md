# Date Calculator 📅
> 简单高效的日期推算工具，支持日期差计算、前后日期推算、睡眠周期计算，无广告、无追踪，解决你所有的日期计算需求。

[![GitHub stars](https://img.shields.io/github/stars/fjkkx77/data-Calculation?style=social)](https://github.com/fjkkx77/data-Calculation/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/fjkkx77/data-Calculation?style=social)](https://github.com/fjkkx77/data-Calculation/network/members)
[![在线Demo](https://img.shields.io/badge/在线Demo-点击访问-brightgreen)](https://fjkkx77.github.io/data-Calculation/)

---

## ✨ 核心功能亮点
- 📊 **日期差计算**：快速计算两个日期之间相差的天数、周数、月数、年数
- ⏰ **前后日期推算**：输入起始日期和天数，快速推算出 N 天前/后的具体日期
- 🎨 **简洁无干扰**：无广告、无用户追踪，界面清爽，操作简单
- 📱 **全终端响应式**：电脑、平板、手机都能完美适配
- 😴 **睡眠周期计算**：支持将小时转换为睡眠周期单位
- 🏮 **公历 ⇄ 农历双向换算**：填哪边都自动换出另一边，支持闰月，附带干支年与生肖；数据源为香港天文台《公曆與農曆日期對照表》，覆盖 1901-02-19 ~ 2101-01-28
- 👇 **下拉刷新**：手机上从页面顶部下拉即可刷新，带死区与方向锁定，上滑/横滑不会误触发
---

## 🖼️ 项目预览
<img width="452" height="534" alt="PixPin_2026-04-01_08-34-38" src="https://github.com/user-attachments/assets/315a7235-1485-421a-a254-0df6ab0930bd" />
<img width="441" height="633" alt="PixPin_2026-04-01_08-34-55" src="https://github.com/user-attachments/assets/53a71388-d4be-4e3d-8ccb-2d0f593200a0" />


---

## 🚀 快速开始
### 方式一：直接在线使用（推荐）
点击 [在线Demo](https://fjkkx77.github.io/data-Calculation/) 即可直接使用，无需任何安装配置。

### 方式二：一键部署到自己的 GitHub Pages
1.  点击页面右上角的 **Fork** 按钮，把本仓库复刻到你自己的GitHub账号下
2.  进入你复刻后的仓库，点击顶部的 `Settings` → 左侧找到 `Pages`
3.  Source 选项选择 `Deploy from a branch`，Branch 选择 `main`，文件夹选择 `/ (root)`，点击 Save
4.  等待1-2分钟，刷新页面，就能生成你自己的在线访问链接

### 方式三：本地运行
1.  点击仓库右上角的 `Code` 按钮，选择 `Download ZIP` 下载完整项目压缩包
2.  解压压缩包，找到里面的 `index.html` 文件
3.  直接用浏览器双击打开 `index.html` 即可使用

---

## 🛠️ 技术栈
- 原生 HTML5 + CSS3 + JavaScript，单文件、零外部依赖
- 日期处理：原生 `Date`（全部按 UTC 计算，避开夏令时）
- 测试：`node --test "tests/*.test.cjs"`（直接抽 `index.html` 里的计算核心来测）

---

## 📝 更新日志
### v1.2.0 (2026-10-08)
- 🐛 日期间隔不再算出「-2 天」这类负数（如 1月31日 → 3月1日 现为「1个月1天」）
- 🐛 加减月份碰到月末不再溢出到下个月（1月31日 + 1个月 = 2月28日）；推算与间隔互为逆运算
- 🐛 日期弹窗：选 31 号再切到小月会收到月末；深色模式下弹窗看不清的问题已修
- 🐛 日期弹窗打开时，手指在弹窗或遮罩上滑动不再带动背后的页面
- ✨ 日期弹窗加「现在」按钮；点遮罩或按 Esc 可关闭
- ✨ 下拉刷新会保留已填的内容
- 💄 间隔只显示非零单位；折合年/月标注「≈」并说明折算口径；加大日期格与小按钮的点按区域

### v1.1.0 (2026-09-09)
- ✨ 新增「公历 ⇄ 农历」双向换算卡片，支持闰月，显示干支年与生肖
- ✨ 新增移动端下拉刷新
- 📐 农历数据表由香港天文台官方逐日对照表推导生成，已与其 73,000 天逐日比对无差异

### v1.0.0 (2026-03-31)
- ✨ 初始版本发布
- ✅ 支持日期差计算（天数/周数/月数/年数）
- ✅ 支持前后日期推算
- ✅ 全终端响应式适配
- ✅ 睡眠周期计算

---

## 🤝 贡献指南
欢迎提交 Issue 和 Pull Request！
- 发现 Bug 或有功能建议，欢迎提交 [Issue](https://github.com/fjkkx77/data-Calculation/issues)
- 想贡献代码，Fork 仓库后提交 PR 即可

---

## 📄 开源协议
本项目采用 [MIT 协议](LICENSE) 开源，可自由使用、修改和商用。

---

如果这个项目对你有帮助，欢迎给个 Star ⭐️ 支持一下！
