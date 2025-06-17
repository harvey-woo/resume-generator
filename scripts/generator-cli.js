#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 简单的颜色输出函数
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

// 显示欢迎信息
function showWelcome() {
  console.log(colors.cyan("=".repeat(60)));
  console.log(colors.bold(colors.cyan("              📄 简历生成器 v1.0.0")));
  console.log(colors.cyan("=".repeat(60)));
  console.log();
}

// 显示菜单
function showMenu() {
  console.log(colors.bold("请选择操作:"));
  console.log();
  console.log(colors.green("1. ") + "生成HTML文件");
  console.log(colors.green("2. ") + "生成PDF文件");
  console.log(colors.green("3. ") + "生成所有文件 (HTML + PDF)");
  console.log(colors.green("4. ") + "清理PDF文件");
  console.log(colors.green("5. ") + "查看项目状态");
  console.log(colors.green("0. ") + "退出程序");
  console.log();
}

// 检查项目结构
function checkProjectStructure() {
  const currentDir = process.cwd();
  
  // 检测是否在打包后的环境中运行（通过检查是否存在package.json来判断）
  const isPackaged = !fs.existsSync(path.join(currentDir, "package.json"));
  
  let requiredPaths;
  if (isPackaged) {
    // 打包后的环境只需要检查核心文件
    requiredPaths = ["src", "template/resume.hbs"];
  } else {
    // 开发环境需要检查package.json
    requiredPaths = ["src", "template/resume.hbs", "package.json"];
  }

  console.log(colors.blue("检查项目结构..."));

  for (const pathToCheck of requiredPaths) {
    const fullPath = path.join(currentDir, pathToCheck);
    if (!fs.existsSync(fullPath)) {
      console.log(colors.red(`❌ 缺少必要文件/目录: ${pathToCheck}`));
      if (isPackaged) {
        console.log(colors.yellow("请确保 src 和 template 目录在可执行文件同级目录中"));
      } else {
        console.log(colors.yellow("请确保在正确的项目目录中运行此程序"));
      }
      return false;
    }
  }

  console.log(colors.green("✓ 项目结构检查通过"));
  return true;
}

// 检查是否有npm或tsx命令
function checkCommands() {
  try {
    execSync("npm --version", { stdio: "ignore" });
    return { hasNpm: true, hasTsx: false };
  } catch {
    return { hasNpm: false, hasTsx: false };
  }
}

// 检测是否在打包环境中
function isPackagedEnvironment() {
  return !fs.existsSync(path.join(process.cwd(), "package.json"));
}

// 执行命令
function runCommand(command, description) {
  try {
    console.log(colors.blue(`\n${description}...`));
    console.log(colors.yellow(`执行: ${command}`));
    console.log("-".repeat(50));

    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log(colors.green(`\n✓ ${description}完成!`));
  } catch (error) {
    console.log(colors.red(`\n❌ ${description}失败:`));
    console.log(colors.red(error.message));
  }
}

// 显示项目状态
function showProjectStatus() {
  const commands = checkCommands();

  try {
    console.log(colors.blue("\n项目状态检查..."));

    if (commands.hasNpm) {
      execSync("npx tsx status.ts", {
        stdio: "inherit",
        cwd: process.cwd(),
      });
    } else {
      console.log(colors.red("❌ 未找到npm命令"));
    }
  } catch (error) {
    console.log(colors.red("❌ 无法获取项目状态"));
    console.log(colors.yellow("请确保在正确的项目目录中运行"));
  }
}

// 获取用户输入
function getUserInput() {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    process.stdout.write(colors.cyan("请输入选项 (0-5): "));

    stdin.on("data", (key) => {
      if (key === "\u0003") {
        // Ctrl+C
        process.exit();
      }

      console.log(key.trim());
      stdin.setRawMode(false);
      stdin.pause();
      resolve(key.trim());
    });
  });
}

// 暂停等待用户按键
function waitForKey() {
  return new Promise((resolve) => {
    console.log(colors.yellow("\n按任意键继续..."));
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    stdin.once("data", () => {
      stdin.setRawMode(false);
      stdin.pause();
      resolve();
    });
  });
}

// 主程序
async function main() {
  // 清屏
  console.clear();

  // 显示欢迎信息
  showWelcome();

  // 检查项目结构
  if (!checkProjectStructure()) {
    await waitForKey();
    return;
  }

  // 检测环境
  const isPackaged = isPackagedEnvironment();
  const commands = checkCommands();
  
  if (!isPackaged && !commands.hasNpm) {
    console.log(colors.red("❌ 未找到npm命令，请确保已安装Node.js"));
    await waitForKey();
    return;
  }

  console.log();

  while (true) {
    showMenu();

    const choice = await getUserInput();

    switch (choice) {
      case "1":
        if (isPackaged) {
          console.log(colors.red("❌ 打包版本暂不支持单独生成HTML文件"));
          console.log(colors.yellow("建议使用选项3生成所有文件"));
        } else {
          runCommand("npx tsx generator.ts", "生成HTML文件");
        }
        break;

      case "2":
        if (isPackaged) {
          console.log(colors.red("❌ 打包版本暂不支持单独生成PDF文件"));
          console.log(colors.yellow("建议使用选项3生成所有文件"));
        } else {
          runCommand("npx tsx pdf-generator.ts", "生成PDF文件");
        }
        break;

      case "3":
        if (isPackaged) {
          console.log(colors.red("❌ 打包版本暂不支持TypeScript脚本"));
          console.log(colors.yellow("请使用源码版本进行开发"));
        } else {
          runCommand("npx tsx generator.ts", "生成HTML文件");
          console.log();
          runCommand("npx tsx pdf-generator.ts", "生成PDF文件");
        }
        break;

      case "4":
        if (isPackaged) {
          console.log(colors.red("❌ 打包版本暂不支持清理功能"));
        } else {
          runCommand("npx tsx clean-pdf.ts", "清理PDF文件");
        }
        break;

      case "5":
        showProjectStatus();
        break;

      case "0":
        console.log(colors.green("\n👋 再见！"));
        process.exit(0);

      default:
        console.log(colors.red("\n❌ 无效选项，请重新选择"));
    }

    await waitForKey();
    console.clear();
    showWelcome();
  }
}

// 处理未捕获的异常
process.on("uncaughtException", (error) => {
  console.log(colors.red("\n❌ 程序发生错误:"));
  console.log(colors.red(error.message));
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.log(colors.red("\n❌ 程序发生错误:"));
  console.log(colors.red(String(reason)));
  process.exit(1);
});

// 运行主程序
main().catch((error) => {
  console.log(colors.red("\n❌ 程序启动失败:"));
  console.log(colors.red(error.message));
  process.exit(1);
});
