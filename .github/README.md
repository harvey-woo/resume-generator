# GitHub Actions 自动发布

## 使用方法

1. **创建并推送标签**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions 会自动**:
   - 构建跨平台可执行文件 (Windows, macOS, Linux)
   - 打包示例文件和模板
   - 创建 GitHub Release
   - 分别上传各个平台的文件

## 版本号格式

使用 `v` 开头的标签，如：`v1.0.0`, `v2.1.3`

## 构建产物

### 可执行文件（按平台分别下载）
- `resume-generator-win.exe` - Windows 可执行文件
- `resume-generator-macos` - macOS 可执行文件  
- `resume-generator-linux` - Linux 可执行文件

### 示例文件和模板（通用）
- `sample-files-and-templates.zip` - 包含：
  - `src/` - 示例YAML简历文件
  - `template/` - Handlebars模板文件
  - `README.md` - 使用说明

用户可以根据自己的平台只下载对应的可执行文件，加上通用的示例文件包。
