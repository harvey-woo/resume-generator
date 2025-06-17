import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import handlebars from "handlebars";
import { marked } from "marked";
import puppeteer from "puppeteer";

// 接口定义
interface ResumeData {
  [key: string]: any;
}

interface SkillsData {
  skills?: string;
  [key: string]: any;
}

// 配置 marked 选项
marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false, // 允许更宽松的 markdown 解析
});

// 注册 Handlebars 助手函数
handlebars.registerHelper("markdown", function (text: string) {
  if (!text) return "";
  return new handlebars.SafeString(marked(text));
});

// 注册 eq 助手函数用于条件判断
handlebars.registerHelper("eq", function (a: any, b: any) {
  return a === b;
});

// 处理 markdown 文本，直接使用 marked 库
function processMarkdownText(text: string): string {
  if (!text) return "";

  // 检查是否是技能列表格式（以 "- " 开头且包含多个 " - " 分隔的项目）
  if (text.trim().startsWith("- ") && text.includes(" - ")) {
    // 将 " - " 分隔的文本转换为正确的 markdown 列表格式
    // 首先处理第一个项目
    let formatted = text.trim();
    // 将 " - " 替换为 "\n- "，但保留第一个 "- "
    formatted = formatted.replace(/ - /g, "\n- ");

    return marked(formatted);
  }

  // 直接使用 marked 处理所有 markdown 语法
  return marked(text);
}

// 递归处理对象中的特定字符串字段，转换 markdown
function processObjectMarkdown(
  obj: any,
  markdownFields: string[] = [
    "专业概述",
    "描述",
    "相关技能",
    "Professional Summary",
    "Description",
    "Skills",
  ]
): any {
  if (typeof obj === "string") {
    return obj; // 默认不处理，除非在特定字段中
  } else if (Array.isArray(obj)) {
    return obj.map((item) => processObjectMarkdown(item, markdownFields));
  } else if (obj && typeof obj === "object") {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (markdownFields.includes(key) && typeof value === "string") {
        // 只对指定的字段进行 markdown 处理
        newObj[key] = processMarkdownText(value);
      } else {
        newObj[key] = processObjectMarkdown(value, markdownFields);
      }
    }
    return newObj;
  }
  return obj;
}

// 处理技能列表
function processSkills(skillsText: string): string[] {
  if (!skillsText) return [];

  // 按行分割技能列表
  const lines = skillsText.split("\n").filter((line) => line.trim());

  return lines.map((line) => {
    // 移除开头的 - 符号和空格
    let skill = line.replace(/^\s*-\s*/, "");
    // 处理 markdown 格式
    return processMarkdownText(skill);
  });
}

// 处理照片路径，转换为data URL
function processPhoto(photoPath: string): string | null {
  if (!photoPath) return null;
  try {
    // 处理相对路径，基于项目根目录
    const fullPath = path.resolve(process.cwd(), photoPath); // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
      console.warn(`照片文件不存在: ${fullPath}`);
      return null;
    }

    // 读取文件并转换为base64
    const imageBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    // 根据文件扩展名确定MIME类型
    let mimeType = "image/jpeg"; // 默认
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".gif") mimeType = "image/gif";
    else if (ext === ".webp") mimeType = "image/webp";

    // 转换为data URL
    const base64Image = imageBuffer.toString("base64");
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error(`处理照片时出错: ${error}`);
    return null;
  }
}

// 读取并处理简历数据
function loadResumeData(filePath: string): ResumeData {
  try {
    const yamlContent = fs.readFileSync(filePath, "utf8");
    let data = yaml.load(yamlContent) as ResumeData;

    // 处理照片 - 支持不同的数据结构
    let photoPath: string | null = null;
    if (data.photo) {
      photoPath = data.photo;
    } else if (data.个人信息?.照片) {
      photoPath = data.个人信息.照片;
    } else if (data.personalInfo?.photo) {
      photoPath = data.personalInfo.photo;
    }

    if (photoPath) {
      const processedPhoto = processPhoto(photoPath);
      if (processedPhoto) {
        // 将处理后的照片数据写回到所有可能的位置
        if (data.个人信息) {
          data.个人信息.照片 = processedPhoto;
        }
        if (data.personalInfo) {
          data.personalInfo.photo = processedPhoto;
        }
        if (data.photo) {
          data.photo = processedPhoto;
        }
      }
    }

    // 处理技能部分
    if (data.skills && typeof data.skills === "string") {
      data.skillsList = processSkills(data.skills);
    }

    // 处理职业经历部分的技能
    if (data.experience && Array.isArray(data.experience)) {
      data.experience = data.experience.map((exp: any) => {
        if (exp.skills && typeof exp.skills === "string") {
          exp.skillsList = processSkills(exp.skills);
        }
        return exp;
      });
    }

    // 处理项目经历部分的技能
    if (data.projects && Array.isArray(data.projects)) {
      data.projects = data.projects.map((project: any) => {
        if (project.skills && typeof project.skills === "string") {
          project.skillsList = processSkills(project.skills);
        }
        return project;
      });
    }

    // 处理markdown字段
    data = processObjectMarkdown(data);

    return data;
  } catch (error) {
    console.error(`读取简历数据时出错: ${error}`);
    throw error;
  }
}

// 读取模板文件
function loadTemplate(templatePath: string): HandlebarsTemplateDelegate {
  try {
    const templateContent = fs.readFileSync(templatePath, "utf8");
    return handlebars.compile(templateContent);
  } catch (error) {
    console.error(`读取模板文件时出错: ${error}`);
    throw error;
  }
}

// 生成HTML文件
function generateHTML(
  template: HandlebarsTemplateDelegate,
  data: ResumeData,
  outputPath: string
): void {
  try {
    const html = template(data);
    fs.writeFileSync(outputPath, html, "utf8");
    console.log(`✓ HTML文件已生成: ${outputPath}`);
  } catch (error) {
    console.error(`生成HTML文件时出错: ${error}`);
    throw error;
  }
}

// 生成PDF文件 (可选)
async function generatePDF(
  htmlPath: string,
  outputPath: string
): Promise<void> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // 读取HTML文件
    const htmlContent = fs.readFileSync(htmlPath, "utf8");
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // 设置PDF选项
    const pdfOptions = {
      path: outputPath,
      format: "A4" as const,
      printBackground: true,
      margin: {
        top: "0.25in",
        right: "0.25in",
        bottom: "0.25in",
        left: "0.25in",
      },
    };

    // 生成PDF
    await page.pdf(pdfOptions);
    console.log(`✓ PDF文件已生成: ${outputPath}`);
  } catch (error) {
    console.error(`生成PDF时出错: ${error}`);
    throw error;
  } finally {
    await browser.close();
  }
}

// 创建输出目录
function ensureOutputDir(outputDir: string): void {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✓ 创建输出目录: ${outputDir}`);
  }
}

// 主函数
async function main(): Promise<void> {
  try {
    const srcDir = path.join(process.cwd(), "src");
    const outputDir = path.join(process.cwd(), "dist");

    // 确保输出目录存在
    ensureOutputDir(outputDir);

    // 查找所有YAML文件
    const files = fs.readdirSync(srcDir);
    const yamlFiles = files.filter((file) => file.endsWith(".yml"));

    if (yamlFiles.length === 0) {
      throw new Error(`在 ${srcDir} 目录中没有找到YAML文件`);
    }

    console.log(`找到 ${yamlFiles.length} 个YAML文件，开始生成...`);

    // 处理每个YAML文件
    for (const yamlFile of yamlFiles) {
      const yamlPath = path.join(srcDir, yamlFile);
      const baseName = path.basename(yamlFile, ".yml");
      const htmlPath = path.join(outputDir, `${baseName}.html`);

      console.log(`\n处理文件: ${yamlFile}`);

      // 加载数据
      const data = loadResumeData(yamlPath);
      
      // 获取模板路径，支持从数据文件中配置
      let templatePath: string;
      if (data.模板配置?.模板路径) {
        templatePath = path.join(process.cwd(), data.模板配置.模板路径);
        console.log(`✓ 使用配置的模板: ${data.模板配置.模板路径}`);
      } else if (data.templateConfig?.templatePath) {
        templatePath = path.join(process.cwd(), data.templateConfig.templatePath);
        console.log(`✓ 使用配置的模板: ${data.templateConfig.templatePath}`);
      } else {
        // 默认模板
        templatePath = path.join(process.cwd(), "template", "resume.hbs");
        console.log(`✓ 使用默认模板: template/resume.hbs`);
      }

      // 检查模板文件是否存在
      if (!fs.existsSync(templatePath)) {
        throw new Error(`模板文件不存在: ${templatePath}`);
      }

      // 加载并编译模板
      const template = loadTemplate(templatePath);
      
      // 将语言配置传递给模板数据
      if (data.模板配置?.语言) {
        data.language = data.模板配置.语言;
      } else if (data.templateConfig?.language) {
        data.language = data.templateConfig.language;
      }

      // 生成HTML
      generateHTML(template, data, htmlPath);

      console.log(`✓ 处理完成: ${baseName}`);
    }

    console.log("\n🎉 所有文件生成完成!");
  } catch (error) {
    console.error("生成过程中出错:", error);
    process.exit(1);
  }
}

// 运行主函数
main();
