import Searcher from "./src/services/Searcher";

async function testHtmlParsing() {
  console.log("=== Testing HTML Parsing ===");
  
  // Mock the Axios instance's get method
  const mockHtml = `
  <!DOCTYPE html>
  <html>
  <body>
    <div class="tgme_header_link">
      <img src="https://example.com/logo.jpg" />
    </div>
    <div class="tgme_widget_message_wrap">
      <div class="tgme_widget_message" data-post="aliyun_share/1234">
        <div class="tgme_widget_message_text js-message_text">
          这是一个好电影标题<br>
          这是一些描述内容。
          <a href="https://www.aliyundrive.com/s/abcdefg">https://www.aliyundrive.com/s/abcdefg</a>
          <a href="#">#科幻电影</a>
        </div>
        <time datetime="2023-01-01T12:00:00Z"></time>
        <div class="tgme_widget_message_photo_wrap" style="background-image:url('https://example.com/photo.jpg')"></div>
      </div>
    </div>
  </body>
  </html>
  `;

  (Searcher as any).api = {
    get: async () => ({ data: mockHtml })
  };

  const results = await Searcher.searchInWeb("/aliyun_share");
  console.log(`Channel Logo: ${results.channelLogo}`);
  console.log(`Found ${results.items.length} items`);
  console.log(JSON.stringify(results.items, null, 2));
}

testHtmlParsing().catch(console.error);
