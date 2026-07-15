import * as lark from '@larksuiteoapi/node-sdk';
import fs from 'fs';
import path from 'path';
import { logger } from './utils/logger';
import Searcher from './services/Searcher';
import { QuarkService } from './services/QuarkService';
import { container } from './inversify.config';
import { TYPES } from './core/types';
import { DatabaseService } from './services/DatabaseService';

export function startFeishuBot() {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;

  if (!appId || !appSecret) {
    logger.warn('Feishu bot credentials not configured, skipping bot startup.');
    return;
  }

  const client = new lark.Client({ appId, appSecret });
  const wsClient = new lark.WSClient({ appId, appSecret });

  const eventDispatcher = new lark.EventDispatcher({}).register({
    'im.message.receive_v1': async (data) => {
      const chatId = data.message.chat_id;
      const messageId = data.message.message_id;
      
      // Auto-bind chat_id for global notifications
      try {
        fs.writeFileSync(path.join(process.cwd(), '.feishu_chat_id'), chatId);
      } catch (e) {
        logger.error(`Failed to bind chat_id: ${e}`);
      }

      if (data.message.message_type !== 'text') return;
      
      const content = JSON.parse(data.message.content);
      const text = content.text ? content.text.trim() : '';

      if (text.startsWith('/search ')) {
        const keyword = text.slice(8).trim();
        if (!keyword) return;
        
        await client.im.message.reply({
          path: { message_id: messageId },
          data: { content: JSON.stringify({ text: `⏳ 正在搜索: ${keyword}...` }), msg_type: 'text' }
        });

        try {
          const results = await Searcher.searchAll(keyword);
          let replyStr = `🔍 搜索结果 (${results.data.length}条):\n`;
          results.data.slice(0, 10).forEach((item: any, index: number) => {
            replyStr += `${index + 1}. ${item.title}\nID: ${item.pwdId}\n`;
          });
          if (results.data.length > 10) replyStr += '... (仅显示前10条)\n\n可以使用 /transfer-quark <ID> 转存';
          
          await client.im.message.reply({
            path: { message_id: messageId },
            data: { content: JSON.stringify({ text: replyStr }), msg_type: 'text' }
          });
        } catch (error) {
          await client.im.message.reply({
            path: { message_id: messageId },
            data: { content: JSON.stringify({ text: `❌ 搜索失败: ${error}` }), msg_type: 'text' }
          });
        }
      } else if (text.startsWith('/transfer-quark ')) {
        const args = text.slice(16).trim().split(' ');
        const pwdId = args[0];
        const passcode = args[1] || '';
        
        if (!pwdId) return;

        await client.im.message.reply({
          path: { message_id: messageId },
          data: { content: JSON.stringify({ text: `⏳ 正在为您转存夸克资源: ${pwdId}...` }), msg_type: 'text' }
        });

        try {
          // Verify DB is initialized since Service needs it
          const db = container.get<DatabaseService>(TYPES.DatabaseService);
          if (!db) throw new Error("Database not initialized");

          const service = new QuarkService();
          const shareInfo = await service.getShareInfo(pwdId, passcode);
          if (!shareInfo || !shareInfo.data || !shareInfo.data.list) {
            throw new Error("分享链接已失效或需要提取码");
          }
          const folders = await service.getFolderList("0");
          if (!folders?.data?.length) {
            throw new Error("无法获取目标根目录，请检查 Cookie");
          }
          const targetFolderId = folders.data[0].cid;
          
          await service.saveSharedFile({
            shareCode: pwdId,
            receiveCode: shareInfo.data.stoken || '',
            folderId: targetFolderId,
            fids: shareInfo.data.list.map((f: any) => f.fileId),
            fidTokens: shareInfo.data.list.map((f: any) => f.fileIdToken)
          });
          
          // Note: saveSharedFile already triggers FeishuNotifier.pushMessage on success!
          // So we don't necessarily need to reply here again, but we can do a direct reply for good UX.
          await client.im.message.reply({
            path: { message_id: messageId },
            data: { content: JSON.stringify({ text: `✅ 转存成功！` }), msg_type: 'text' }
          });
        } catch (error) {
           await client.im.message.reply({
            path: { message_id: messageId },
            data: { content: JSON.stringify({ text: `❌ 转存失败: ${error}` }), msg_type: 'text' }
          });
        }
      } else {
         await client.im.message.reply({
            path: { message_id: messageId },
            data: { content: JSON.stringify({ text: `🤖 欢迎使用 CloudSaver Bot!\n支持的命令：\n/search <关键字>\n/transfer-quark <分享ID> [提取码]` }), msg_type: 'text' }
          });
      }
    }
  });

  wsClient.start({ eventDispatcher });
  logger.info('🚀 Feishu WebSocket Bot started successfully!');
}
