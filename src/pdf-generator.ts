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

// 主要PDF生成函数，可被外部调用
export async function generateResumePDF(): Promise<void> {
  try {
    const outputDir = path.join(process.cwd(), "output");

    // 检查output目录是否存在
    if (!fs.existsSync(outputDir)) {
      throw new Error("output目录不存在，请先生成HTML文件");
    }

    // 查找所有HTML文件
    const files = fs.readdirSync(outputDir);
    const htmlFiles = files.filter((file) => file.endsWith(".html"));

    if (htmlFiles.length === 0) {
      throw new Error("output目录中没有找到HTML文件，请先生成HTML文件");
    }

    console.log(`找到 ${htmlFiles.length} 个HTML文件，开始生成PDF...`);

    // 为每个HTML文件生成PDF
    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(outputDir, htmlFile);
      const pdfFile = htmlFile.replace(".html", ".pdf");
      const pdfPath = path.join(outputDir, pdfFile);

      await generatePDF(htmlPath, pdfPath);
    }

    console.log("所有PDF文件生成完成!");
  } catch (error) {
    console.error("生成PDF时出错:", error);
    throw error;
  }
}

// 主函数，用于直接运行
async function main(): Promise<void> {
  await generateResumePDF();
}

// 如果直接运行此文件，执行主函数
if (require.main === module) {
  main().catch((error) => {
    console.error("生成PDF时出错:", error);
    process.exit(1);
  });
}
