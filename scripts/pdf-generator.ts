import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

// 生成PDF的函数
async function generatePDF(
  htmlPath: string,
  outputPath: string,
  retries: number = 3
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
    if (retries > 0) {
      console.warn(
        `生成PDF失败，还有 ${retries} 次重试机会: ${(error as Error).message}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒
      await browser.close();
      return generatePDF(htmlPath, outputPath, retries - 1);
    } else {
      console.error(
        `生成PDF时出错，已用完所有重试机会: ${(error as Error).message}`
      );
      throw error;
    }
  } finally {
    await browser.close();
  }
}

// 主函数
async function main(): Promise<void> {
  try {
    const distDir = path.join(process.cwd(), "dist");

    // 检查dist目录是否存在
    if (!fs.existsSync(distDir)) {
      console.error("dist目录不存在，请先运行 'npm run build' 生成HTML文件");
      process.exit(1);
    }

    // 查找所有HTML文件
    const files = fs.readdirSync(distDir);
    const htmlFiles = files.filter((file) => file.endsWith(".html"));

    if (htmlFiles.length === 0) {
      console.error("dist目录中没有找到HTML文件，请先运行 'npm run build'");
      process.exit(1);
    }

    console.log(`找到 ${htmlFiles.length} 个HTML文件，开始生成PDF...`);

    // 为每个HTML文件生成PDF
    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(distDir, htmlFile);
      const pdfFile = htmlFile.replace(".html", ".pdf");
      const pdfPath = path.join(distDir, pdfFile);

      await generatePDF(htmlPath, pdfPath);
    }

    console.log("所有PDF文件生成完成!");
  } catch (error) {
    console.error("生成PDF时出错:", error);
    process.exit(1);
  }
}

// 运行脚本
main();
