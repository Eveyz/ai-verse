# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## npm (bun) tauri dev

Runs the app in the development mode.
Open http://localhost:5173 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

# Nexus - Local Knowledge OS

Nexus 是一个下一代**本地 RAG (Retrieval-Augmented Generation) 桌面界面**。与传统的问答聊天机器人不同，Nexus 专注于**知识结构化**、**演化追踪**以及**智能合成**。它旨在成为您的私人知识操作系统，优先考虑隐私，并在本地运行。

---

## 🚀 项目愿景

在 AI 时代，我们不缺乏信息，但缺乏对知识之间**联系**和**演变**的洞察。Nexus 不仅仅是一个搜索引擎或聊天窗口，它是一个可视化的思考空间，帮助用户：
1. **看见** 知识的拓扑结构 (Knowledge Graph)。
2. **追踪** 概念随时间的漂移 (Evolution Timeline)。
3. **合成** 碎片化信息为结构化工件 (Agentic Synthesis)。

---

## ✨ 已实现功能 (Current Features)

### 1. 核心界面与交互 (UI/UX)
*   **响应式侧边栏**: 支持折叠/展开，折叠状态下提供精美的 Tooltip 提示，最大化工作区空间。
*   **多主题支持 (Theming System)**:
    *   实现了基于 CSS 变量 (Semantic CSS Variables) 的完整主题系统。
    *   支持 **Light (浅色)**、**Dark (深色)** 和 **Auto (跟随系统)** 模式。
    *   所有组件（图表、图谱、地图）均自动适配当前主题。
*   **国际化 (i18n)**: 内置中英文切换支持。

### 2. 仪表盘 (Dashboard)
*   **系统健康监控**: 实时可视化向量数据库状态、内存占用及嵌入队列。
*   **数据统计**: 使用 Recharts 展示索引文件数量、向量切片(Chunks)增长趋势。
*   **语义指标**: 追踪知识深度 (Knowledge Depth) 和语义链接数量。

### 3. 知识图谱 (Knowledge Graph)
*   **交互式可视化**: 基于 D3.js 构建的力导向图 (Force-Directed Graph)。
*   **实体分类**: 区分概念 (Concept)、文件 (File)、实体 (Person) 等节点类型。
*   **动态交互**: 支持拖拽节点、点击查看详情侧边栏。
*   **上下文关联**: 在侧边栏中显示关联实体及快速操作（如“从节点开始对话”）。

### 4. 演化时间轴 (Evolution Timeline)
这是 Nexus 的独特功能，用于展示知识的“时间维度”：
*   **多维度视图**:
    *   **Global**: 全局里程碑和重大架构变更。
    *   **Concept**: 追踪特定概念（如“延迟优化”）的定义如何随时间变化。
    *   **File**: 文件级别的变更历史。
*   **智能报告生成**: 集成 LLM 能力，一键生成月度知识演化报告，总结关键决策和遗留问题。
*   **差异对比 (Diff View)**: 直观展示概念或代码变更前后的对比。

### 5. 智能体工作流 (Agentic Workflow)
*   **上下文对话**: 支持 Markdown 渲染的聊天界面。
*   **透明化引用**: 每一条 AI 回复都明确标注来源文件 (Source Transparency)。
*   **工件侧边栏 (Artifact Panel)**: 当 AI 生成代码、草稿或复杂计划时，会在右侧独立面板展示，方便对照和编辑。
*   **思考模拟**: 模拟 AI 的“思考”和“综合”过程，提供更好的用户反馈。

### 6. 智能资料库 (Smart Library)
*   **多维度分组**: 支持按 **语义标签 (Semantic Tag)**、**时间**、**文件类型** 自动聚类文件。
*   **拖拽上传**: 模拟文件拖拽上传交互。
*   **语义发光**: 在语义视图下，卡片具有独特的视觉效果，暗示其 AI 归类属性。

### 7. 全域搜索 (Nexus Finder)
*   **混合检索展示**: 模拟展示语义搜索结果，包含文档片段、代码块和 PDF。
*   **相关度评分**: 显示匹配度百分比。
*   **快速入口**: 提供“最近文件”和“热门主题”的快速访问。

### 8. 设置与配置 (Settings)
*   **推理引擎切换**:
    *   **Local Mode**: 配置本地模型（如 Ollama, LM Studio），强调隐私。
    *   **Cloud Mode**: 集成 Google Gemini / OpenAI 等云端模型，用于复杂任务。
*   **账户管理**: 模拟用户登录/登出及订阅状态（Pro/Enterprise）管理。
*   **模型管理**: 本地模型下载进度模拟与磁盘占用统计。

---

## 🛠 技术栈 (Tech Stack)

*   **Frontend Framework**: React 18
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (利用 CSS Variables 实现主题切换)
*   **Icons**: Lucide React
*   **Visualization**: 
    *   D3.js (知识图谱)
    *   Recharts (统计图表)
*   **AI Integration**: Google GenAI SDK (用于演示云端推理能力)

---

## 🎨 设计理念

Nexus 的设计遵循 **"Native & Fluid"** 原则。即使是 Web 应用，我们也力求提供类似原生桌面应用的流畅体验，包括精细的转场动画、模糊背景效果 (Backdrop Blur) 以及符合直觉的交互反馈。

---

## 🚧 下一步计划 (Roadmap)

*   **真实本地 RAG 接入**: 替换模拟数据，通过 WebAssembly 或本地服务接入真实的向量数据库 (如 LanceDB)。
*   **插件系统**: 允许用户编写自定义的数据加载器 (Loaders)。
*   **Canvas 模式**: 一个无限画布，用于手动整理和连接 AI 生成的知识卡片。

