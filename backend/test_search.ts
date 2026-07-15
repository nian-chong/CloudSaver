import "reflect-metadata";
import Searcher from "./src/services/Searcher";

async function testSearch() {
  console.log("=== Testing searchInWeb ===");
  // Test with a popular Chinese cloud drive share channel on Telegram (just as an example, this URL is for telegram web preview)
  // For example, "aliyun_share" or any public channel
  const testChannel = "/aliyun_share"; 
  console.log(`Searching channel: ${testChannel}`);
  
  const results = await Searcher.searchInWeb(testChannel);
  console.log(`Found ${results.items.length} items.`);
  
  if (results.items.length > 0) {
    console.log("First item parsed:");
    console.log(JSON.stringify(results.items[0], null, 2));
    
    // Check if cloud links were parsed
    const cloudItems = results.items.filter(item => item.cloudLinks && item.cloudLinks.length > 0);
    console.log(`\nItems with cloud links: ${cloudItems.length}`);
    if (cloudItems.length > 0) {
      console.log("Example cloud link item:");
      console.log(JSON.stringify(cloudItems[0], null, 2));
    }
  } else {
    console.log("No items found. Maybe network issue or empty channel.");
  }
}

testSearch().catch(console.error);
