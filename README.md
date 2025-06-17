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
├── 📁 scripts/                  # 核心脚本目录
│   ├── 📄 generator.ts          # HTML 生成器 (TypeScript)
│   ├── 📄 pdf-generator.ts      # PDF 生成器 (TypeScript)
│   ├── 📄 clean-pdf.ts          # PDF 清理工具
│   ├── 📄 generator-cli.js      # 交互式 CLI 工具
│   ├── 📄 status.ts             # 项目状态检查
│   └── 📄 test-exe.js           # 可执行文件测试
├── 📁 src/                      # 简历数据源
│   └── 📄 zhangwei-zh.yml       # YAML 格式简历数据
├── 📁 template/                 # 模板文件
│   ├── 📄 resume.hbs            # 主简历模板
│   └── 📄 resume-fresh.hbs      # 清新风格模板
├── 📁 build/                    # 构建输出目录
│   └── 🖥️ resume-generator-*    # 各平台可执行文件
└── 📁 dist/                     # 生成的简历文件
    ├── 📄 *.html                # HTML 格式简历
    └── 📄 *.pdf                 # PDF 格式简历
```

## 🚀 快速开始

### 方式一：使用可执行文件（推荐）

项目提供了开箱即用的可执行文件，无需安装 Node.js 环境：

**Windows 用户：**
```powershell
# 双击运行或命令行执行
.\resume-generator-win.exe
```

**macOS 用户：**
```bash
# 添加执行权限并运行
chmod +x resume-generator-macos
./resume-generator-macos
```

**Linux 用户：**
```bash
# 添加执行权限并运行
chmod +x resume-generator-linux
./resume-generator-linux
```

### 方式二：开发环境运行

如果你需要修改源码或进行开发：

**1. 安装依赖**
```bash
npm install
# 或使用 yarn
yarn install
```

**2. 运行交互式命令行**
```bash
npm run cli
# 或直接运行
node scripts/generator-cli.js
```

## 📋 使用方法

### 命令行操作

运行可执行文件或 CLI 工具后，会看到交互式菜单：

```
============================================================
              📄 简历生成器 v1.0.0
============================================================

请选择操作:

1. 生成HTML文件
2. 生成PDF文件  
3. 生成所有文件 (HTML + PDF)
4. 清理PDF文件
5. 查看项目状态
0. 退出程序
```

### NPM 脚本命令

| 命令 | 功能 | 描述 |
|------|------|------|
| `npm run build` | 🔥 **完整构建** | 生成 HTML 和 PDF 文件 |
| `npm run build:html` | 🌐 **HTML 生成** | 仅生成 HTML 格式简历 |
| `npm run build:pdf` | 📄 **PDF 生成** | 仅生成 PDF 格式简历 |
| `npm run clean` | 🧹 **清理文件** | 删除生成的 PDF 文件 |
| `npm run dev` | 🔧 **开发模式** | 开发时快速生成 HTML |
| `npm run type-check` | ✅ **类型检查** | TypeScript 类型验证 |

### 可执行文件构建

如果需要重新构建可执行文件：

```bash
# 构建所有平台的可执行文件
npm run build:exe

# 构建特定平台
npm run build:exe:win     # Windows
npm run build:exe:mac     # macOS  
npm run build:exe:linux   # Linux

# 清理可执行文件
npm run clean:exe
```

## 📝 数据配置

### YAML 文件结构

在 `src/` 目录下创建或编辑 YAML 文件，支持以下数据结构：

```yaml
# 模板配置
模板配置:
  模板路径: "template/resume.hbs"
  语言: "zh-CN"  # 或 "en"

# 个人信息
个人信息:
  姓名: "张伟"
  专业概述: "资深全栈工程师"
  
# 基本信息  
基本信息:
  手机: "138-0000-0000"
  邮箱: "zhangwei@example.com"
  
# 工作经历
工作经历:
  - 公司: "某科技有限公司"
    职位: "高级工程师"
    时间: "2020.03 - 至今"
    描述: "负责核心产品开发和架构设计"
    
# 项目经历
项目经历:
  - 名称: "企业级管理系统"
    技术栈: "React, Node.js, MongoDB"
    描述: "**负责前端架构设计**，实现了高性能的用户界面"
    
# 相关技能
相关技能:
  - 分类: "前端技术"
    技能: "React, Vue.js, TypeScript, **精通现代前端框架**"
    
# 教育经历
教育经历:
  - 学校: "某某大学"
    专业: "计算机科学与技术"
    学历: "本科"
    时间: "2016-2020"
```

### Markdown 支持

简历内容支持 Markdown 格式：

- `**文本**` → **加粗显示**
- 自动换行处理
- 特殊字符转义

> ⚠️ **注意**：包含 `**` 等特殊字符的文本需要用引号包裹

## 🎨 模板系统### 可用模板

| 模板文件 | 风格特点 | 适用场景 |
|----------|----------|----------|
| `resume.hbs` | 🎯 **经典商务** | 传统行业、正式场合 |
| `resume-fresh.hbs` | 🌟 **清新现代** | 互联网、创意行业 |

### 模板自定义

模板使用 **Handlebars** 语法，支持以下功能：

```handlebars
<!-- 基本变量输出 -->
<h1>{{个人信息.姓名}}</h1>

<!-- 循环渲染 -->
{{#each 工作经历}}
<div class="job">
  <h3>{{公司}} - {{职位}}</h3>
  <p>{{{markdown 描述}}}</p>
</div>
{{/each}}

<!-- Markdown 渲染 -->
{{{markdown 相关技能.技能}}}

<!-- 条件判断 -->
{{#if 基本信息.照片}}
<img src="{{基本信息.照片}}" alt="照片">
{{/if}}
```

### 多语言配置

统一模板支持中英文自动切换：

```yaml
模板配置:
  模板路径: "template/resume.hbs"
  语言: "zh-CN"  # 中文界面
  # 或
  语言: "en"     # 英文界面
```

**语言对照表：**

| 中文 | 英文 |
|------|------|
| 工作经历 | Work Experience |
| 项目经历 | Project Experience |
| 相关技能 | Professional Skills |
| 教育经历 | Education |
| 基本信息 | Personal Info |

## ⚙️ 高级配置

### PDF 自定义设置

编辑 `scripts/pdf-generator.ts` 中的 PDF 选项：

```typescript
const pdfOptions = {
  format: "A4" as const,
  printBackground: true,
  margin: {
    top: "0.5in",
    right: "0.5in", 
    bottom: "0.5in",
    left: "0.5in",
  },
  // 自定义页眉页脚
  displayHeaderFooter: false,
  // DPI 设置
  preferCSSPageSize: true,
};
```

### 批量处理

工具自动扫描 `src/` 目录下的所有 `.yml` 文件，支持：

- ✅ 同时处理多个简历文件
- ✅ 自动生成对应的 HTML/PDF
- ✅ 保持文件名一致性

### 开发环境配置

**TypeScript 配置** (`tsconfig.json`)：
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS", 
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
  }
}
```

**依赖说明：**
- `handlebars`: 模板引擎
- `js-yaml`: YAML 解析
- `marked`: Markdown 渲染
- `puppeteer`: PDF 生成
- `tsx`: TypeScript 运行时

## 🛠️ 开发指南

### 项目架构

```
📁 scripts/
├── 📄 generator.ts       # 核心生成器，处理 YAML → HTML
├── 📄 pdf-generator.ts   # PDF 转换器，HTML → PDF
├── 📄 clean-pdf.ts       # 文件清理工具
├── 📄 generator-cli.js   # 交互式命令行界面
├── 📄 status.ts          # 项目状态检查和诊断
└── 📄 test-exe.js        # 可执行文件功能测试
```

### TypeScript 特性

- 🔒 **严格类型检查**：确保数据结构正确性
- 🚀 **现代 ES 特性**：支持 async/await、解构等
- 📝 **智能提示**：完整的类型定义和 IntelliSense
- 🔧 **热重载开发**：使用 `tsx` 无需编译即可运行

### 扩展开发

**添加新模板：**
1. 在 `template/` 目录创建 `.hbs` 文件
2. 在 YAML 中指定 `模板路径`
3. 使用现有的 Handlebars 助手函数

**添加新功能：**
1. 修改对应的 TypeScript 文件
2. 运行 `npm run type-check` 验证类型
3. 使用 `npm run dev` 测试功能

## 🏗️ 构建与部署

### 可执行文件构建

使用 **pkg** 工具将项目打包为独立可执行文件：

```bash
# 构建所有平台（Windows + macOS + Linux）
npm run build:exe

# 分平台构建
npm run build:exe:win     # Windows x64
npm run build:exe:mac     # macOS x64  
npm run build:exe:linux   # Linux x64
```

**构建输出：**
- `resume-generator-win.exe` - Windows 可执行文件
- `resume-generator-macos` - macOS 可执行文件
- `resume-generator-linux` - Linux 可执行文件

### 项目分发

可执行文件包含以下资源：
- ✅ 完整的 Node.js 运行时
- ✅ 所有依赖包（Puppeteer、Handlebars 等）
- ✅ 模板文件和示例数据
- ✅ 交互式命令行界面

用户无需安装任何环境即可直接运行。

## 📊 输出文件

生成的简历保存在 `dist/` 目录：

| 文件类型 | 特点 | 用途 |
|----------|------|------|
| 📄 **HTML** | 响应式设计、在线预览 | 网页展示、在线投递 |
| 📄 **PDF** | 高质量打印、标准格式 | 邮件附件、打印简历 |

**文件命名规则：**
- 源文件：`src/zhangwei-zh.yml`
- 输出：`dist/zhangwei-zh.html` + `dist/zhangwei-zh.pdf`

## 🔧 系统要求

### 可执行文件模式
- ✅ **无需安装**：开箱即用，自带运行环境
- ✅ **跨平台**：支持 Windows、macOS、Linux
- ✅ **轻量化**：单文件包含所有依赖

### 开发环境模式
- 📦 **Node.js** v16+ (推荐 v18+)
- 🌐 **Chrome/Chromium** (Puppeteer PDF 生成依赖)
- 💾 **可用磁盘空间** 50MB+
- 🔧 **npm/yarn** 包管理器

## ❗ 故障排除

### 常见问题及解决方案

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 🚫 **依赖安装失败** | 网络问题或权限不足 | 删除 `node_modules` 重新安装 |
| 🚫 **Puppeteer 下载失败** | 网络限制或镜像问题 | 使用国内镜像或 cnpm |
| 🚫 **PDF 生成失败** | Chrome 环境缺失 | 检查 Puppeteer 安装状态 |
| 🚫 **模板渲染错误** | YAML 格式问题 | 检查文件编码和语法 |
| 🚫 **可执行文件无法运行** | 权限或系统兼容性 | 添加执行权限或检查系统版本 |

### 详细解决步骤

**1. 依赖问题**
```powershell
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

```bash
# macOS/Linux
rm -rf node_modules package-lock.json
npm install
```

**2. Puppeteer 安装问题**

```bash
# 方案 1：使用国内镜像
npm config set puppeteer_download_host=https://cdn.npmmirror.com
npm install puppeteer

# 方案 2：使用 cnpm
npm install -g cnpm
cnpm install puppeteer

# 方案 3：手动设置代理
npm config set proxy http://your-proxy:port
npm install puppeteer
```

**3. PDF 生成失败**
```bash
# 检查 Puppeteer 状态
node -e "console.log(require('puppeteer').executablePath())"

# 如果报错，重新安装 Puppeteer
npm uninstall puppeteer
npm install puppeteer
```

**4. 文件编码问题**
- ✅ 确保 YAML 文件使用 **UTF-8** 编码
- ✅ 特殊字符用引号包裹：`"包含**加粗**的文本"`
- ✅ 检查 YAML 语法：使用在线 YAML 验证器

**5. 权限问题 (macOS/Linux)**
```bash
# 添加执行权限
chmod +x resume-generator-macos
chmod +x resume-generator-linux

# 如果提示安全警告 (macOS)
xattr -d com.apple.quarantine resume-generator-macos
```

### 调试模式

开启详细日志输出：

```bash
# 设置调试环境变量
export DEBUG=1
npm run build

# Windows
set DEBUG=1 && npm run build
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. 🍴 Fork 此仓库
2. 🌿 创建功能分支：`git checkout -b feature/new-feature`
3. 💻 编写代码并测试
4. 📝 更新文档
5. 🚀 提交 PR

### 代码规范
- ✅ 使用 TypeScript 严格模式
- ✅ 遵循 ESLint 配置
- ✅ 添加必要的类型注释
- ✅ 编写测试用例

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🌟 Star History

如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！

**由 ❤️ 和 TypeScript 驱动**
