import { Cloud115Service } from "./src/services/Cloud115Service";
import { QuarkService } from "./src/services/QuarkService";

async function testCloud115() {
  console.log("=== 测试 115 网盘 ===");
  const service = new Cloud115Service();
  
  // 替换为你真实的 115 网盘 Cookie
  (service as any).cookie = "YOUR_115_COOKIE_HERE";
  
  // 替换为你要转存的分享码和提取码
  const shareCode = "YOUR_SHARE_CODE";
  const receiveCode = "YOUR_RECEIVE_CODE"; 
  
  try {
    console.log("1. 获取分享信息...");
    const shareInfo = await service.getShareInfo(shareCode, receiveCode);
    console.log("分享信息:", JSON.stringify(shareInfo, null, 2));

    console.log("2. 获取网盘根目录...");
    const folders = await service.getFolderList("0");
    console.log("根目录列表:", JSON.stringify(folders, null, 2));

    /* 
    // 3. 执行转存 (取消注释以测试实际转存)
    if (shareInfo.data?.list?.length && folders.data?.length) {
      console.log("3. 正在执行转存...");
      const result = await service.saveSharedFile({
        shareCode,
        receiveCode,
        folderId: folders.data[0].cid, // 转存到第一个目录
        fids: shareInfo.data.list.map((f: any) => f.fileId)
      });
      console.log("转存结果:", result);
    }
    */
  } catch (error) {
    console.error("115 网盘测试失败:", error);
  }
}

async function testQuark() {
  console.log("\n=== 测试 夸克网盘 ===");
  const service = new QuarkService();
  
  // 替换为你真实的 夸克网盘 Cookie
  (service as any).cookie = "ctoken=UpR1YIyE6tcnUtimoHuuiOfQ;b-user-id=ee8c3dd0-9aed-028c-7523-c89ac244cc6a;grey-id=6eb83e2c-5493-cbcc-1309-50697663bf06;grey-id.sig=kwb4q0H_nTUCFRXtRAcUbyaNirSwpJRGWeJ7Un0JBS0;isQuark=false;isQuark.sig=DWPHMZYiiwQ-v58AbcP-rBdSIpzO8ZnrD67BdJuPatU;__wpkreporterwid_=f4973ace-8029-4f4d-9cf0-55842ab9ba2c;_UP_A4A_11_=wba2e179a4464aadab1877601dbde471;_UP_D_=pc;_UP_F7E_8D_=0z44HdIBxZYkZ5f9VFc3Yj4%2F1%2B2GkBdno4lwdxgZnScGPS74qMl17rg%2FxjE0n7rNmnFch2pV8%2FND8CizlW8ST3INEc0DyOipgbVemTID4d%2FJfd6YLm4Bw0KoWmdkn3NKr%2FkWp7W34NZlhgFKUTD%2BEalz%2B%2FFr7vwn75FlhnOTYQk1e9bRjiBoAwUd%2Fruv44%2BOHUJe2rESr8Zh3ppErqfsHXY5ITnJa4IqamAG646kaPWLlBPf7OXKw0oDn1GgfemwUstkaAJF2EO8MlgHlYApZp7I5DuZ5URQ%2Bhb4jY1MUH0lNVWbuA7cEaAINyd%2BnUvWo9ZvT9tODUHTX%2BTcqN5XbcOk1ra3INMiXbnEFWx%2Fk%2BcjOk0NMklkPPJhcjIY9laLkPvhSjPtLS9YIGPd1Sag%2FoLmdhpsOV%2F1VxufgE6%2FXhCsSL5OwizVU2TxvjF8lUdBo8aG5K1wGd3iDExO0cma7g%3D%3D;__pus=d0bd6d792ea8bb88062b0e2d8411dcdfAARlrTzHTeY87EsudnBXb9FNxCpJbsb8iqt2/eSYhTMgcTxG/CnYrBx+GNHh0V65u33vKS72fypPfUi/dgL4Gxfl;__kp=3d3ffa70-68ad-11f1-9aaf-fdbbc44499b3;__kps=AAQ8sY/DR5Zq07OnWbHCtWWI;__ktd=ilD56F9S6t47+gfFu7F0pA==;__uid=AAQ8sY/DR5Zq07OnWbHCtWWI;web-grey-id=f4acef9c-0d88-8447-93e3-31f6ce07e295;web-grey-id.sig=Wo7h5JHH5UsS8x8ujvgzG6WluwmF1PjuP25iD-J0AqQ;__puus=acc61fa754132a69056c13dfdd525593AAQeVGzm9CNYUcQLUF5ECA0uuPoi8yHSzjGgzoIGr149d9FJcVDRpwgitLnpQZbdBBZcuL76RNDPa7jju7yg3Q1qkNjut09dD0UtLkxKKItFPwgib69vB476E2IlBVnsYjlh6dXNSZK5eKCpOHA6ZA0YVMt+Ts93eKAERe01xzuW7ujMiv925m4yCXo2X5A+RjPmVlhiliLav+d6f4dLy1Y8";
  
  try {
    console.log("1. 获取网盘根目录 (用于验证 Cookie 有效性)...");
    const folders = await service.getFolderList("0");
    console.log("根目录列表获取成功:", JSON.stringify(folders, null, 2).substring(0, 500) + "...");
  } catch (error) {
    console.error("夸克网盘获取目录失败 (Cookie 可能无效):", error);
  }

  // 因为用户未提供分享链接，这里仅作一个失败捕获的尝试
  const pwdId = "YOUR_PWD_ID";
  const passcode = "YOUR_PASSCODE";
  try {
    console.log("\n2. 获取分享信息...");
    const shareInfo = await service.getShareInfo(pwdId, passcode);
    console.log("分享信息:", JSON.stringify(shareInfo, null, 2));
  } catch (error) {
    console.log("获取分享信息失败（预期之中，因为未提供有效的分享链接）。若要测试转存请提供有效的 pwdId 和 passcode。");
  }
}

async function main() {
  await testQuark();
}

main();
