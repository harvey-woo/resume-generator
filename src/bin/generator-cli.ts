#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { generateResume } from "../generator";
import { generateResumePDF } from "../pdf-generator";
import { cleanPDFFiles } from "../clean-pdf";
import { showStatus } from "../status";

// 简单的颜色输出函数
const colors = {
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
};

// 显示欢迎信息
function showWelcome(): void {
  console.log(colors.cyan("=".repeat(60)));
  console.log(colors.bold(colors.cyan("              📄 简历生成器 v1.0.0")));
  console.log(colors.cyan("=".repeat(60)));
  console.log();
}

// 显示菜单
function showMenu(): void {
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
function checkProjectStructure(): boolean {
  const currentDir = process.cwd();
  
  // 检测是否在打包后的环境中运行（通过检查是否存在package.json来判断）
  const isPackaged = !fs.existsSync(path.join(currentDir, "package.json"));
  
  let requiredPaths: string[];
  if (isPackaged) {
    // 打包后的环境只需要检查核心文件
    requiredPaths = ["input", "template/resume.hbs"];
  } else {
    // 开发环境需要检查package.json
    requiredPaths = ["input", "template/resume.hbs", "package.json"];
  }

  console.log(colors.blue("检查项目结构..."));

  for (const pathToCheck of requiredPaths) {
    const fullPath = path.join(currentDir, pathToCheck);
    if (!fs.existsSync(fullPath)) {
      console.log(colors.red(`❌ 缺少必要文件/目录: ${pathToCheck}`));
      if (isPackaged) {
        console.log(colors.yellow("请确保 input 和 template 目录在可执行文件同级目录中"));
      } else {
        console.log(colors.yellow("请确保在正确的项目目录中运行此程序"));
      }
      return false;
    }
  }

  console.log(colors.green("✓ 项目结构检查通过"));
  return true;
}

// 检测是否在打包环境中
function isPackagedEnvironment(): boolean {
  return !fs.existsSync(path.join(process.cwd(), "package.json"));
}

// 执行命令
async function runCommand(commandType: string, description: string): Promise<void> {
  try {
    console.log(colors.blue(`\n${description}...`));
    console.log("-".repeat(50));

    switch (commandType) {
      case "generator":
        await generateResume();
        break;
      case "pdf-generator":
        await generateResumePDF();
        break;
      case "clean-pdf":
        cleanPDFFiles();
        break;
      case "status":
        showStatus();
        break;
      default:
        throw new Error(`未知命令类型: ${commandType}`);
    }

    console.log(colors.green(`\n✓ ${description}完成!`));
  } catch (error) {
    console.log(colors.red(`\n❌ ${description}失败:`));
    console.log(colors.red((error as Error).message));
  }
}

// 显示项目状态
function showProjectStatus(): void {
  console.log(colors.blue("\n项目状态检查..."));
  try {
    showStatus();
  } catch (error) {
    console.log(colors.red("❌ 无法获取项目状态"));
    console.log(colors.red((error as Error).message));
  }
}

// 获取用户输入
function getUserInput(): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    
    // 检查是否支持 raw mode
    try {
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding("utf8");

      process.stdout.write(colors.cyan("请输入选项 (0-5): "));

      stdin.on("data", (key: Buffer) => {
        const keyStr = key.toString();
        if (keyStr === "\u0003") {
          // Ctrl+C
          process.exit();
        }

        console.log(keyStr.trim());
        stdin.setRawMode(false);
        stdin.pause();
        resolve(keyStr.trim());
      });
    } catch (error) {
      // Raw mode 不可用，使用普通输入模式
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question(colors.cyan("请输入选项 (0-5): "), (answer: string) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

// 暂停等待用户按键
function waitForKey(): Promise<void> {
  return new Promise((resolve) => {
    console.log(colors.yellow("\n按任意键继续..."));
    const stdin = process.stdin;
    
    try {
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding("utf8");

      stdin.once("data", () => {
        stdin.setRawMode(false);
        stdin.pause();
        resolve();
      });
    } catch (error) {
      // Raw mode 不可用，使用普通输入模式
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question("", () => {
        rl.close();
        resolve();
      });
    }
  });
}

// 主程序
export async function main(): Promise<void> {
  // 清屏
  console.clear();

  // 显示欢迎信息
  showWelcome();

  // 检查项目结构
  if (!checkProjectStructure()) {
    await waitForKey();
    return;
  }  // 检测环境
  const isPackaged = isPackagedEnvironment();
  
  console.log(colors.blue(`环境检测: ${isPackaged ? '打包环境' : '开发环境'}`));
  console.log();

  while (true) {
    showMenu();

    const choice = await getUserInput();    switch (choice) {
      case "1":
        await runCommand("generator", "生成HTML文件");
        break;

      case "2":
        await runCommand("pdf-generator", "生成PDF文件");
        break;

      case "3":
        await runCommand("generator", "生成HTML文件");
        console.log();
        await runCommand("pdf-generator", "生成PDF文件");
        break;

      case "4":
        await runCommand("clean-pdf", "清理PDF文件");
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

// 运行主程序（仅在直接运行时）
if (require.main === module) {
  main().catch((error) => {
    console.log(colors.red("\n❌ 程序启动失败:"));
    console.log(colors.red(error.message));
    process.exit(1);
  });
}
