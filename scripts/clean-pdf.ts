import fs from "fs";
import path from "path";

// 清理dist目录中的PDF文件
function cleanPDFs(): void {
  const distDir = path.join(__dirname, "dist");

  if (!fs.existsSync(distDir)) {
    console.log("dist目录不存在");
    return;
  }

  const files = fs.readdirSync(distDir);
  const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

  if (pdfFiles.length === 0) {
    console.log("没有找到PDF文件");
    return;
  }

  let deletedCount = 0;
  let failedCount = 0;

  pdfFiles.forEach((pdfFile) => {
    const pdfPath = path.join(distDir, pdfFile);
    try {
      fs.unlinkSync(pdfPath);
      console.log(`✓ 删除成功: ${pdfFile}`);
      deletedCount++;
    } catch (error) {
      console.log(`✗ 删除失败: ${pdfFile} (${(error as Error).message})`);
      failedCount++;
    }
  });

  console.log(
    `\n清理完成: 成功删除 ${deletedCount} 个文件，失败 ${failedCount} 个文件`
  );

  if (failedCount > 0) {
    console.log("\n提示: 如果删除失败，请确保没有程序正在使用这些PDF文件");
  }
}

// 运行清理
cleanPDFs();
