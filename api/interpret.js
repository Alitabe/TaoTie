// server.js  ——  Express + DeepSeek 完成 /api/interpret
import 'dotenv/config';          // 自动读取 .env
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

// 1. 初始化 DeepSeek 客户端（官方兼容 OpenAI 格式）
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1', // 末尾必须 /v1，且无空格
  apiKey: 'sk-33e6e70d121543eeb038f7221b0a4abb',       // .env 里：DEEPSEEK_KEY=sk-xxx
});

// 2. 矿产报告解读接口
app.post('/api/interpret', async (req, res) => {
  const {
    miningType,
    highPercent,
    mediumPercent,
    lowPercent,
    confidence,
    weights,
    hotspotCount,
    areaKm2,
  } = req.body;

  const prompt = `
你是一位矿产勘探 AI 助手。请根据以下模型预测结果，严格按格式输出三段文字（每段 150~200 字）：
1 报告摘要
2 主要结论（用 <li> 包裹）
3 勘探建议（用 <li> 包裹）

矿产类型：${miningType}
高概率区域：${highPercent}  中概率：${mediumPercent}  低概率：${lowPercent}  置信度：${confidence}
数据权重：地球化学 ${weights.geochemical}%  地球物理 ${weights.geophysical}%  钻探 ${weights.drilling}%  遥感 ${weights.remoteSensing}%
高值区块数：${hotspotCount}  面积：${areaKm2} km²
`;

  try {
    // 3. 调用 DeepSeek
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat', // 官方唯一聊天模型
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const fullText = completion.choices[0].message.content;

    // 4. 简单拆三段
    const parts = fullText.split(/\d\s*(报告摘要|主要结论|勘探建议)/);
    const summary    = (parts[2] || '').trim();
    const conclusion = (parts[4] || '').trim();
    const suggestion = (parts[6] || '').trim();

    res.json({ summary, conclusion, suggestion });
  } catch (err) {
    // 5. 把真正的 DeepSeek 错误打出来
    console.error('DeepSeek error:', err);
    const msg = err.response?.data || err.message;
    res.status(500).json({ error: msg });
  }
});

// 6. 启动
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Interpret API on :${PORT}`));
