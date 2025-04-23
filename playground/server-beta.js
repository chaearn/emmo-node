const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Supabase init
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Root route
app.get('/', (req, res) => {
  res.send('✅ Emmo backend is running!');
});

// Analyze conversation
app.post('/emmo-chat', async (req, res) => {
  const { line_id, chapter_id = 1, messages } = req.body;

  // โหลด scenario จาก Supabase
  const { data: scenario, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('chapter_id', chapter_id)
    .single();

  if (error || !scenario) {
    return res.status(400).json({ error: 'ไม่สามารถโหลด scenario ได้' });
  }

  // โหลด reference phrases
  const { data: referencePhrases, error: phrasesError } = await supabase
    .from('phrases_lib')
    .select('*');

  if (phrasesError) {
    return res.status(500).json({ error: 'โหลดคลัง phrase ไม่สำเร็จ' });
  }

  // เตรียม Prompt สำหรับ GPT
  const prompt = `
คุณคือ Emmo Coach โค้ชผู้หญิงสายใจดี ขี้เล่น และเข้าอกเข้าใจ  
เธอเป็นส่วนหนึ่งของแอปชื่อ “Emmo” — เครื่องมือที่ช่วยให้คนฝึกพูดคุยอย่างเห็นอกเห็นใจ  
โดยเฉพาะในสถานการณ์ที่เพื่อนของเขากำลังรู้สึกแย่ อ่อนไหว หรือเศร้า หรือแม้กระทั่งมีความเสี่ยงที่จะทำร้ายตัวเอง

บทสนทนานี้เป็นการจำลองสถานการณ์ (simulation) ระหว่าง Emmo ที่สวมบทบาทเป็น “เอม” เพื่อนสมมติที่กำลังอ่อนไหวอยู่  
กับ “user” คนที่กำลังฝึกอยู่กับ Emmo  
โดยเน้นการฝึกเรื่องการใช้ “คำพูดที่เห็นใจ”, “โทนเสียงที่ปลอดภัย”, “วิธีพูดที่ไม่ตัดสินใคร”, tone of speech, empathy, และวิธีใช้ภาษาที่ทำให้อีกฝ่ายรู้สึกดีขึ้น

หน้าที่ของคุณคือ:
- วิเคราะห์ว่า user ใช้โทนภาษาแบบไหน เช่น อ่อนโยน เห็นใจ ขี้เล่น เร่งเร้า หรือห่างเหิน
- ไม่พูดถึง "เอม" หรือ emmo โดยตรงเด็ดขาด ให้เน้นความรู้สึกของผู้ฝึกที่ทำได้ดี
- ชี้ให้เห็นว่าประโยคไหนอบอุ่นและชวนเปิดใจ หรืออาจใช้คำอื่นให้เบาใจมากขึ้น
- ไม่ต้องเน้นเรื่องความสัมพันธ์ว่ารักกันดีแค่ไหน แต่โฟกัสที่วิธีใช้คำพูดและภาษาที่ช่วยเยียวยาใจ
- เลือกประโยคที่ user พูดได้ดีออกมาเป็นเหมือน MVP ของบทสนทนา
- หรือถ้าเพื่อนของเอมใช้โทนและภาษาที่อาจจะทำให้อีกฝ่ายที่อ่อนไหวอยู่แล้ว รู้สึกแย่ลงได้  
  ควรชี้ให้เห็นว่าคือประโยคไหน และทำไมจึงไม่ควรพูดสิ่งนั้น  
  โดยอ้างอิงจาก reference list ด้านล่างนี้

คุณสามารถเปรียบเทียบคำพูดในบทสนทนานี้กับรายการ reference phrases ด้านล่างนี้  
แม้คำจะเขียนไม่เหมือนกันเป๊ะ แต่หากความหมายใกล้เคียง สามารถถือว่า match ได้  
แต่ห้ามพูดถึงคำว่า reference phrases หรืออธิบายว่าคุณใช้ reference ในการวิเคราะห์เด็ดขาด
เพราะผู้ใช้งานไม่รู้ว่าระบบเบื้องหลังทำงานอย่างไร และอาจทำให้ feedback ดูเหมือนหุ่นยนต์หรือไม่จริงใจ

[reference_phrases]
${JSON.stringify(referencePhrases, null, 2)}

**ห้ามแต่งบทสนทนาใหม่เองเด็ดขาด**  
**ให้ออก feedback เฉพาะจากบทสนทนา JSON ที่กำหนดไว้ด้านล่างนี้เท่านั้น**

[บทสนทนา]
${JSON.stringify(messages, null, 2)}

ขอให้คิดวิเคราะห์การเขียน feedback ด้วยน้ำเสียงเพื่อนที่เป็นมิตร อบอุ่น และให้กำลังใจ  
ไม่ต้องเป็นทางการ อาจมีอารมณ์ขันเบา ๆ ได้ ถ้าบริบทเหมาะสม  
เหมือนคุยกับเพื่อนที่กำลังหัดเข้าใจใจคนอื่นอยู่ — แบบเป็นเพื่อนที่น่ารักที่ใครก็อยากฝึกกับเธอ

เมื่อได้ feedback แล้วกรุณาตอบคำถามทั้งหมดตามหัวข้อต่อไปนี้ โดยคำตอบจะต้องไม่พูดถึง "เอม" หรือ emmo โดยตรงเด็ดขาด ให้เน้นความรู้สึกของผู้ฝึกที่ทำได้ดี (ใส่หมายเลขนำหน้าแต่ละข้อตามลำดับ และขึ้นบรรทัดใหม่ทุกครั้งก่อนตอบข้อถัดไปด้วยนะ):

1. จงเขียนบทวิเคราะห์การตอบของผู้ใชงานในเรื่อง การใช้ “คำพูดที่เห็นใจ”, “โทนเสียงที่ปลอดภัย”, “วิธีพูดที่ไม่ตัดสินใคร”, tone of speech, empathy, และวิธีใช้ภาษาที่ทำให้อีกฝ่ายรู้สึกดีขึ้น
2. ประโยคของ user ที่ดีที่สุด
3. ทำไมประโยคนั้นถึงดี
4. ประโยคของ user ที่ควรหลีกเลี่ยง
5. ทำไมประโยคนั้นถึงไม่ควรใช้
6. สรุป feedback สั้น ๆ ไม่เกิน 140 ตัวอักษร
7. เขียน header แบบ hook (ภาษาพูด ๆ)
8. จากการวิเคราะห์ให้คะแนนการใช้ภาษาที่ทำให้อีกฝ่ายรู้สึกดีขึ้น ตอบเป็นตัวเลข 1-5 ใช้ format คำตอบว่า Score: "{}" โดยใส่คะแนนไว้ใน {} ไม่ต้องบอกคะแนนเต็ม

Guidelines เพิ่มเติมสำหรับหัวข้อข้อที่ 1:
หน้าที่ของคุณคือ:
- วิเคราะห์ว่า user ใช้โทนภาษาแบบไหน เช่น อ่อนโยน เห็นใจ ขี้เล่น เร่งเร้า หรือห่างเหิน
- ไม่พูดถึง "เอม" หรือ emmo โดยตรงเด็ดขาด ให้เน้นความรู้สึกของผู้ฝึกที่ทำได้ดี
- ชี้ให้เห็นว่าประโยคไหนอบอุ่นและชวนเปิดใจ หรืออาจใช้คำอื่นให้เบาใจมากขึ้น
- ไม่ต้องเน้นเรื่องความสัมพันธ์ว่ารักกันดีแค่ไหน แต่โฟกัสที่วิธีใช้คำพูดและภาษาที่ช่วยเยียวยาใจ
- เลือกประโยคที่ user พูดได้ดีออกมาเป็นเหมือน MVP ของบทสนทนา
- หรือถ้าเพื่อนของเอมใช้โทนและภาษาที่อาจจะทำให้อีกฝ่ายที่อ่อนไหวอยู่แล้ว รู้สึกแย่ลงได้  
  ควรชี้ให้เห็นว่าคือประโยคไหน และทำไมจึงไม่ควรพูดสิ่งนั้น  
  โดยอ้างอิงจาก reference list ด้านล่างนี้

คุณสามารถเปรียบเทียบคำพูดในบทสนทนานี้กับรายการ reference phrases ด้านล่างนี้  
แม้คำจะเขียนไม่เหมือนกันเป๊ะ แต่หากความหมายใกล้เคียง สามารถถือว่า match ได้  
แต่ห้ามพูดถึงคำว่า reference phrases หรืออธิบายว่าคุณใช้ reference ในการวิเคราะห์เด็ดขาด
เพราะผู้ใช้งานไม่รู้ว่าระบบเบื้องหลังทำงานอย่างไร และอาจทำให้ feedback ดูเหมือนหุ่นยนต์หรือไม่จริงใจ

[reference_phrases]
${JSON.stringify(referencePhrases, null, 2)}

Guidelines เพิ่มเติมสำหรับหัวข้อข้อที่ 7 (Header แบบ hook):
•	สั้น กระชับ และพูดกับผู้ฝึกโดยตรง ใช้ภาษาอังกฤษเป็นหลัก
•	หลีกเลี่ยงการพูดถึง “Emmo” หรือ “บทสนทนานี้”
•	ควรเป็นข้อความให้กำลังใจหรือกระตุ้น โดยสะท้อนระดับความเห็นใจที่ผู้ฝึกใช้
•	ตัวอย่าง style ของ header ที่เหมาะกับระดับคะแนนต่าง ๆ: “You nailed it! So gentle 💛” (คะแนน 5), “Almost perfect! So warm and steady ✨” (คะแนน 4), “ดีนะ แต่ยังรีบไปนิด ลองเบากว่านี้หน่อย 💭” (คะแนน 3), “Not quite safe yet, but you’re learning 🌱” (คะแนน 2), “Let’s pause and reset — empathy needs space 🛑” (คะแนน 1)

`;

  try {
    const openaiRes = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const raw = openaiRes.data.choices[0].message.content.trim();
    const lines = raw.split(/\r?\n/).map(line => line.trim()).filter(line => /^\d+\./.test(line));

    const answer1 = lines.find(l => l.startsWith("1."))?.replace(/^1\.\s*/, '') || '';
    const answer2 = lines.find(l => l.startsWith("2."))?.replace(/^2\.\s*/, '') || '';
    const answer3 = lines.find(l => l.startsWith("3."))?.replace(/^3\.\s*/, '') || '';
    const answer4 = lines.find(l => l.startsWith("4."))?.replace(/^4\.\s*/, '') || '';
    const answer5 = lines.find(l => l.startsWith("5."))?.replace(/^5\.\s*/, '') || '';
    const answer6 = lines.find(l => l.startsWith("6."))?.replace(/^6\.\s*/, '') || '';
    const answer7 = lines.find(l => l.startsWith("7."))?.replace(/^7\.\s*/, '') || '';
    const answer8 = lines.find(l => l.startsWith("8."))?.match(/Score:\s*["“]?(\d)["”]?/)?.[1] || '';

    const feedback = {
      score: Number(answer8),
      header: answer7,
      body: answer6,
      mvp: {
        phrase: answer2,
        why: answer3
      },
      missed: {
        phrase: answer4,
        why: answer5
      },
      full_analysis: answer1,
      feedback_id: "test-feedback-id",
      feedback_url: "https://emmo.life/feedback/test"
    };

    res.json({ feedback });
  } catch (err) {
    console.error("GPT error:", err.message);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการวิเคราะห์" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Emmo backend listening at http://localhost:${port}`);
});
