import { config } from 'dotenv';
config();
import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function getTenantAccessToken() {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;
  const response = await axios.post("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    app_id: appId,
    app_secret: appSecret
  });
  return response.data;
}

async function test() {
  try {
    const tokenData = await getTenantAccessToken();
    console.log("Token response:", tokenData);
    if (tokenData.code !== 0) {
      console.log("Failed to get token");
      return;
    }
    
    const token = tokenData.tenant_access_token;
    const boundIdPath = path.join(process.cwd(), '.feishu_chat_id');
    const chatId = fs.readFileSync(boundIdPath, 'utf-8').trim();
    console.log("Chat ID:", chatId);

    const payload = {
      receive_id: chatId,
      msg_type: "text",
      content: JSON.stringify({ text: "Test msg" })
    };

    const res = await axios.post(
      "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id",
      payload,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Message push response:", res.data);
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Data:", error.response.data);
    } else {
      console.error("Error:", error);
    }
  }
}

test();
