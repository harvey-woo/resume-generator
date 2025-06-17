# 📄 简历生成器

🚀 基于 TypeScript 的现代化简历生成工具，支持 YAML 数据源、Handlebars 模板，一键生成精美的 HTML 和 PDF 简历。

## ✨ 特性

- 🎯 **TypeScript 重构**：完整的类型安全和现代化开发体验
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🖨️ **高质量 PDF**：基于 Puppeteer 的专业级 PDF 渲染
- 🌐 **多语言支持**：统一模板支持中英文切换
- 📝 **Markdown 增强**：支持富文本格式和样式
- 🎨 **现代化界面**：渐变色彩和优雅排版
- 📦 **可执行文件**：支持打包为独立可执行程序
- 🔧 **CLI 工具**：交互式命令行界面

## 📁 项目结构

```
📦 self-resume/
├── 📄 package.json              # 项目配置和依赖
├── 📄 tsconfig.json             # TypeScript 配置
├── 📄 README.md                 # 项目文档
├── 🖥️ resume-generator-*.exe    # 可执行文件 (Windows/macOS/Linux)
├── 📁 src/                      # TypeScript 源代码
│   ├── 📁 bin/                  # CLI 脚本
│   │   ├── 📄 generator-cli.ts  # 交互式 CLI 工具
│   │   └── 📄 test-exe.ts       # 可执行文件测试
│   ├── 📄 generator.ts          # HTML 生成器
│   ├── 📄 pdf-generator.ts      # PDF 生成器
│   ├── 📄 clean-pdf.ts          # PDF 清理工具
│   └── 📄 status.ts             # 项目状态检查
├── 📁 input/                    # 简历数据源
│   └── 📄 zhangwei-zh.yml       # YAML 格式简历数据
├── 📁 template/                 # 模板文件
│   ├── 📄 resume.hbs            # 主简历模板
│   └── 📄 resume-fresh.hbs      # 清新风格模板
├── 📁 output/                   # 生成的简历文件
│   ├── 📄 *.html                # HTML 格式简历
│   └── 📄 *.pdf                 # PDF 格式简历
├── 📁 dist/                     # TypeScript 编译输出
│   ├── 📁 bin/                  # 编译后的 CLI 脚本
│   └── 📄 *.js                  # 编译后的 JavaScript 文件
└── 📁 build/                    # 打包构建目录
    └── 🖥️ resume-generator-*    # 各平台可执行文件
```

## 🚀 快速开始

### 方式一：使用可执行文件（推荐）

项目提供了开箱即用的可执行文件，无需安装 Node.js 环境：

**Windows 用户：**
```powershell
# 下载可执行文件
curl -L -o resume-generator-win.exe https://github.com/your-username/self-resume/releases/latest/download/resume-generator-win.exe

# 下载示例文件包
curl -L -o sample-files-and-templates.zip https://github.com/your-username/self-resume/releases/latest/download/sample-files-and-templates.zip

# 解压示例文件
Expand-Archive sample-files-and-templates.zip -DestinationPath .

# 运行程序
.\resume-generator-win.exe
```

**macOS/Linux 用户：**
```bash
# macOS
curl -L -o resume-generator-macos https://github.com/your-username/self-resume/releases/latest/download/resume-generator-macos
chmod +x resume-generator-macos

# Linux
curl -L -o resume-generator-linux https://github.com/your-username/self-resume/releases/latest/download/resume-generator-linux
chmod +x resume-generator-linux

# 下载示例文件包
curl -L -o sample-files-and-templates.zip https://github.com/your-username/self-resume/releases/latest/download/sample-files-and-templates.zip
unzip sample-files-and-templates.zip

# 运行程序 (macOS)
./resume-generator-macos

# 运行程序 (Linux)
./resume-generator-linux
```

### 方式二：从源码构建

**环境要求：**
- Node.js 18 或更高版本
- npm 或 yarn

**安装和使用：**

```bash
# 克隆项目
git clone https://github.com/your-username/self-resume.git
cd self-resume

# 安装依赖
npm install

# 编译 TypeScript
npm run compile

# 开发模式 - 快速生成
npm run dev

# 完整构建流程
npm run build

# 运行交互式 CLI
npm run cli

# 查看项目状态
npm run status

# 运行测试
npm run test

# 生成可执行文件
npm run package
```

## 📝 使用指南

### 1. 编辑简历数据

在 `input/` 目录中创建或编辑 YAML 文件：

```yaml
# input/your-resume.yml

模板配置:
  模板路径: "template/resume-fresh.hbs"
  语言: "zh-CN"

个人信息:
  姓名: 张三
  照片: "input/photo.jpg"  # 可选
  专业概述: "**5年**专注前端开发，精通 React、Vue 等现代框架"

基本信息:
  电话: "+86138xxxxxxxx"
  邮箱: zhangsan@example.com
  性别: 男
  年龄: 28岁
  意向岗位: 前端开发工程师
  意向城市: 上海
  期望月薪: 25K

工作经历:
  - 公司: 某科技有限公司
    职位: 高级前端开发工程师
    时间: 2020年3月 - 至今
    地点: 上海
    描述: |
      - 负责公司核心产品的前端架构设计和开发
      - 使用 React + TypeScript 构建现代化 Web 应用
      - 优化页面性能，提升用户体验

技能列表:
  前端技术: "React - Vue.js - TypeScript - JavaScript - HTML5 - CSS3"
  后端技术: "Node.js - Express - MongoDB"
  开发工具: "Git - Webpack - Vite - Docker"
```

### 2. 自定义模板

模板使用 Handlebars 语法，支持以下功能：

```handlebars
<!-- template/my-template.hbs -->
<!DOCTYPE html>
<html lang="{{language}}">
<head>
    <meta charset="UTF-8">
    <title>{{个人信息.姓名}} - 个人简历</title>
</head>
<body>
    <h1>{{个人信息.姓名}}</h1>
    
    <!-- 支持 Markdown 渲染 -->
    <div class="summary">
        {{{markdown 个人信息.专业概述}}}
    </div>
    
    <!-- 条件判断 -->
    {{#if 个人信息.照片}}
    <img src="{{个人信息.照片}}" alt="个人照片">
    {{/if}}
    
    <!-- 循环渲染 -->
    {{#each 工作经历}}
    <div class="work-item">
        <h3>{{公司}} - {{职位}}</h3>
        <p>{{时间}} | {{地点}}</p>
        <div>{{{markdown 描述}}}</div>
    </div>
    {{/each}}
</body>
</html>
```

### 3. 运行生成

**交互式 CLI（推荐）：**
```bash
npm run cli
```

**命令行直接运行：**
```bash
# 生成 HTML
npm run build:html

# 生成 PDF
npm run build:pdf

# 生成所有格式
npm run build

# 清理 PDF 文件
npm run clean
```

**使用编译后的脚本：**
```bash
# 直接运行编译后的 JavaScript
node dist/generator.js
node dist/pdf-generator.js
node dist/status.js
```

## 🛠️ 开发指南

### 项目脚本

| 命令 | 描述 |
|------|------|
| `npm run compile` | 编译 TypeScript 为 JavaScript |
| `npm run type-check` | 类型检查 |
| `npm run dev` | 开发模式运行 |
| `npm run dev:watch` | 监听模式运行 |
| `npm run build` | 完整构建 |
| `npm run cli` | 交互式 CLI |
| `npm run status` | 查看项目状态 |
| `npm run test` | 运行测试 |
| `npm run package` | 打包为可执行文件 |

### 代码结构

- **`src/`** - TypeScript 源代码
  - **`bin/`** - CLI 相关脚本
  - **`generator.ts`** - HTML 生成核心逻辑
  - **`pdf-generator.ts`** - PDF 生成逻辑
  - **`clean-pdf.ts`** - 文件清理工具
  - **`status.ts`** - 状态查看工具

- **`input/`** - 简历数据文件
- **`template/`** - Handlebars 模板
- **`output/`** - 生成的输出文件
- **`dist/`** - TypeScript 编译输出

### 开发工作流

1. **编辑源码** - 修改 `src/` 目录下的 TypeScript 文件
2. **编译** - 运行 `npm run compile` 编译为 JavaScript
3. **测试** - 运行 `npm run test` 验证功能
4. **构建** - 运行 `npm run build` 生成简历
5. **打包** - 运行 `npm run package` 生成可执行文件

## 🎨 模板开发

### 内置助手函数

```handlebars
<!-- Markdown 渲染 -->
{{{markdown text}}}

<!-- 条件判断 -->
{{#eq value1 value2}}相等{{/eq}}

<!-- 语言检测 -->
{{#eq language "zh-CN"}}中文内容{{/eq}}
{{#eq language "en-US"}}English Content{{/eq}}
```

### 样式指南

项目提供现代化 CSS 样式，支持：
- 响应式设计
- 暗色模式兼容
- 打印友好样式
- 渐变色彩方案

## 📦 打包部署

### 生成可执行文件

```bash
# 生成所有平台
npm run package

# 单独平台
npm run build:exe:win    # Windows
npm run build:exe:mac    # macOS  
npm run build:exe:linux  # Linux
```

### CI/CD

项目包含 GitHub Actions 工作流，支持：
- 自动类型检查
- 自动编译构建
- 自动测试验证
- 自动发布可执行文件
- 自动打包示例文件

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔗 相关链接

- [项目主页](https://github.com/your-username/self-resume)
- [问题反馈](https://github.com/your-username/self-resume/issues)
- [功能请求](https://github.com/your-username/self-resume/discussions)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
