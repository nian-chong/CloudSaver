import { config } from "./src/config";
import Searcher from "./src/services/Searcher";

function testExtractCloudLinks() {
  console.log("=== Testing Cloud Link Parsing ===");
  
  const testTexts = [
    "这里是阿里云盘分享：https://www.aliyundrive.com/s/123456abcd 提取码: 1234",
    "夸克网盘链接：https://pan.quark.cn/s/abcdefg123 欢迎下载",
    "百度网盘: https://pan.baidu.com/s/1abc-def_ghi 提取码: 8888",
    "123云盘: https://www.123pan.com/s/abc1234",
    "没有网盘链接的普通文本"
  ];

  testTexts.forEach((text, index) => {
    console.log(`\nText ${index + 1}: ${text}`);
    // Using any to access private method for testing purposes
    const result = (Searcher as any).extractCloudLinks(text);
    console.log("Parsed Links:", result.links);
    console.log("Cloud Type:", result.cloudType);
  });
}

testExtractCloudLinks();
