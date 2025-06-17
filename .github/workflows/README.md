# GitHub Actions 使用说明

本项目包含了3个GitHub Actions工作流，用于自动化构建和发布流程。

## 工作流说明

### 1. 🚀 `release.yml` - 基础发布流程
**触发条件**: 推送以 `v` 开头的标签 (如 `v1.0.0`)

**功能**:
- 自动构建跨平台可执行文件 (Windows, macOS, Linux)
- 创建GitHub Release
- 上传可执行文件到Release

### 2. 🔧 `advanced-release.yml` - 高级发布流程
**触发条件**: 
- 推送以 `v` 开头的标签 (如 `v1.0.0`)
- 手动触发 (`workflow_dispatch`)

**功能**:
- 包含基础发布流程的所有功能
- 生成文件校验和 (SHA256)
- 更详细的Release说明
- 支持预发布版本 (alpha, beta, rc)
- 构建验证和错误处理

### 3. 🧪 `test-build.yml` - 测试构建
**触发条件**: 
- 推送到主分支 (main, master, develop)
- Pull Request

**功能**:
- 测试构建过程
- 验证可执行文件生成
- 上传构建产物作为临时工件

## 使用方法

### 发布新版本

1. **准备发布**:
   ```bash
   # 确保所有更改都已提交
   git add .
   git commit -m "准备发布 v1.0.0"
   git push origin main
   ```

2. **创建标签并推送**:
   ```bash
   # 创建标签 (使用语义化版本)
   git tag v1.0.0
   
   # 推送标签到远程仓库
   git push origin v1.0.0
   ```

3. **等待自动构建**:
   - GitHub Actions 会自动检测到新标签
   - 开始构建跨平台可执行文件
   - 创建新的GitHub Release
   - 上传可执行文件

### 版本号规范

推荐使用[语义化版本](https://semver.org/lang/zh-CN/)规范：

- `v1.0.0` - 正式版本
- `v1.0.0-alpha.1` - Alpha版本 (预发布)
- `v1.0.0-beta.1` - Beta版本 (预发布)
- `v1.0.0-rc.1` - Release Candidate版本 (预发布)

### 手动触发构建

如果需要重新构建某个版本，可以：

1. 访问GitHub仓库的Actions页面
2. 选择 "Advanced Build and Release" 工作流
3. 点击 "Run workflow" 按钮
4. 选择要构建的分支或标签

## 构建产物

每次发布会生成以下文件：

- `resume-generator-win.exe` - Windows 可执行文件
- `resume-generator-macos` - macOS 可执行文件  
- `resume-generator-linux` - Linux 可执行文件
- `checksums.txt` - 文件校验和 (仅高级发布流程)

## 故障排除

### 构建失败常见原因

1. **依赖安装失败**: 检查 `package.json` 中的依赖是否正确
2. **类型检查失败**: 运行 `npm run type-check` 本地测试
3. **构建脚本错误**: 确保 `npm run build:exe` 在本地能正常执行
4. **文件路径问题**: 检查 `pkg` 配置中的资源文件路径

### 调试步骤

1. 检查GitHub Actions日志中的错误信息
2. 在本地复现构建过程:
   ```bash
   npm ci
   npm run type-check
   npm run build:exe
   ```
3. 确认所有依赖文件存在于正确位置

## 权限要求

GitHub Actions需要以下权限：
- `contents: write` - 创建Release和上传文件
- `GITHUB_TOKEN` - 由GitHub自动提供，无需额外配置

## 自定义配置

如需修改工作流，可以编辑 `.github/workflows/` 目录下的YAML文件：

- 修改触发条件
- 调整构建步骤
- 自定义Release说明模板
- 添加额外的构建验证
