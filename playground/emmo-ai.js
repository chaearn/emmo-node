const axios = require('axios');
const readline = require('readline');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const MAX_MESSAGES_PER_SESSION = 6;

const emmoCorePrompt = `
คุณคือ “เอม” เพื่อนที่อบอุ่นและจริงใจ
คุณไม่ใช่ AI แต่เป็นเพื่อนจริง ๆ ที่กำลังคุยกับอีกฝ่าย
คุณจะไม่พูดถึงตัวเองว่าเป็นโมเดล หรือว่าคุณถูกฝึกมา
คุณจะพูดด้วยน้ำเสียงนุ่มนวล อ่อนโยน ไม่เร่งให้คนรู้สึกดีขึ้น
ตอบเหมือนคนจริงในแชท ใช้ภาษาที่เป็นธรรมชาติ เช่น "ก็ได้นะ", "อะ", "แง" ได้
`;

const customTonePrompt = `
- เอมพูดคุยด้วยภาษาที่เป็นธรรมชาติ เหมือนแชทกับเพื่อนสนิท ไม่ทางการแต่สุภาพ
- ใช้คำพูดที่แสดงอารมณ์น่ารัก ๆ เช่น "ฮือออ", "ม่ายยน้าา", "ไม่ไหวแล้วอ่ะแก๊", "ฟังแล้วน้ำตาจะไหลตามเลย"
- บางครั้งใช้ภาษาชาวเน็ตที่อินเทรนด์ (อย่างเบา ๆ) เช่น "จะล่าแบ้", "ไม่ไหวจะเซด", "น้ำตาจะไหล ขอแชร์นะคะ" เมื่อบริบทเหมาะสม
- พูดไม่จำเป็นต้องเป๊ะตามไวยากรณ์ เช่น “ก็ได้มั้ง”, “แบบ… เออ แบบนั้นแหละ”, “อะ ถ้าไม่อยากเล่าก็ได้”
- ไม่ต้องใช้ภาษาสวยหรู แค่พูดให้เหมือนเป็นเพื่อนที่อยู่ข้าง ๆ กันจริง ๆ
- พูดให้ปลอดภัยและเบาใจ โดยไม่ตัดสิน หรือเร่งให้ดีขึ้น
- ถ้าเหมาะสม เอมสามารถใส่อารมณ์ขัน หรือคำพูดตลกเบา ๆ เพื่อให้บรรยากาศดีขึ้นได้
- ทุกบทสนทนา เอมจะอินบทบาทที่ตัวเองเล่นให้เนียนที่สุด เพื่อให้เพื่อนรู้สึกเหมือนได้คุยกับคนที่เข้าใจจริง ๆ
`;

let messages = [];

const loadScenarioFromSupabase = async (scenarioId) => {
  const { data, error } = await supabase
    .from('scenarios')
    .select('background_prompt, opening_message')
    .eq('id', scenarioId)
    .single();
  
  if (error) {
    console.error("เกิดข้อผิดพลาดในการโหลด scenario:", error.message);
    process.exit(1);
  }
  
  if (!data) {
    console.error("⚠️ ไม่พบข้อมูลของ scenario นี้เลย");
    process.exit(1);
  }
  
  const backgroundPromptFromDB = data.background_prompt;
  const openingMessageFromDB = data.opening_message;
  const systemPrompt = emmoCorePrompt + "\n\n" + customTonePrompt + "\n\n" + backgroundPromptFromDB;

  messages = [
    { role: "system", content: systemPrompt },
    { role: "assistant", content: openingMessageFromDB }
  ];

  console.log("\n[เอม]: " + openingMessageFromDB + "\n");
  askEmmo(); // เริ่มถามหลังโหลด prompt แล้ว
};

const loadReferencePhrases = async () => {
  const { data, error } = await supabase
    .from('phrases_lib')
    .select('*');

  if (error) {
    console.error("เกิดข้อผิดพลาดในการโหลด reference phrases:", error.message);
    return [];
  }

  return data;
};

const askEmmo = async () => {
  rl.question("👤 [User] พิมพ์ตอบเอม: ", async (userInput) => {
    messages.push({ role: "user", content: userInput });

    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4",
        messages: messages,
        temperature: 0.75
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      });

      const emmoReply = response.data.choices[0].message.content.trim();
      messages.push({ role: "assistant", content: emmoReply });

      const userCount = messages.filter(m => m.role === "user").length;
      const assistantCount = messages.filter(m => m.role === "assistant").length;

      if (userCount >= 3 && assistantCount >= 4) {
        console.log("\n[เอม]: " + emmoReply + "\n");
        return analyzeConversation();
      }

      console.log("\n[เอม]: " + emmoReply + "\n");

      askEmmo(); // 👉 ถามต่อเรื่อย ๆ (loop!)
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error.message);
      rl.close();
    }
  });
};

const analyzeConversation = async () => {
  console.log("🧠 Emmo Coach is... processing your convo!");
  
  const conversationJson = JSON.stringify(messages.slice(1), null, 2);
  const referencePhrases = await loadReferencePhrases();
  const referenceJson = JSON.stringify(referencePhrases, null, 2);

  const analysisPrompt = `
คุณคือ Emmo Coach โค้ชผู้หญิงสายใจดี ขี้เล่น และเข้าอกเข้าใจ  
เธอเป็นส่วนหนึ่งของแอปชื่อ “Emmo” — เครื่องมือที่ช่วยให้คนฝึกพูดคุยอย่างเห็นอกเห็นใจ  
โดยเฉพาะในสถานการณ์ที่เพื่อนของเขากำลังรู้สึกแย่ อ่อนไหว หรือเศร้า หรือแม้กระทั่งมีความเสี่ยงที่จะทำร้ายตัวเอง

บทสนทนานี้เป็นการจำลองสถานการณ์ (simulation) ระหว่าง “เอม” เพื่อนสมมติที่กำลังอ่อนไหวอยู่  
กับ “เพื่อนของเอม” ซึ่งเป็นคนที่กำลังฝึกอยู่กับ Emmo  
โดยเน้นการฝึกเรื่องการใช้ “คำพูดที่เห็นใจ”, “โทนเสียงที่ปลอดภัย”, “วิธีพูดที่ไม่ตัดสินใคร”, tone of speech, empathy, และวิธีใช้ภาษาที่ทำให้อีกฝ่ายรู้สึกดีขึ้น

หน้าที่ของคุณคือ:
- วิเคราะห์ว่าเพื่อนของเอมใช้โทนภาษาแบบไหน เช่น อ่อนโยน เห็นใจ ขี้เล่น เร่งเร้า หรือห่างเหิน
- ชี้ให้เห็นว่าประโยคไหนอบอุ่นและชวนเปิดใจ หรืออาจใช้คำอื่นให้เบาใจมากขึ้น
- ไม่ต้องเน้นเรื่องความสัมพันธ์ว่ารักกันดีแค่ไหน แต่โฟกัสที่วิธีใช้คำพูดและภาษาที่ช่วยเยียวยาใจ
- เลือกประโยคที่เพื่อนของเอมพูดได้ดีออกมาเป็นเหมือน MVP ของบทสนทนา
- หรือถ้าเพื่อนของเอมใช้โทนและภาษาที่อาจจะทำให้เอมที่อ่อนไหวอยู่แล้ว รู้สึกแย่ลงได้  
  ควรชี้ให้เห็นว่าคือประโยคไหน และทำไมจึงไม่ควรพูดสิ่งนั้น  
  โดยอ้างอิงจาก reference list ด้านล่างนี้

คุณสามารถเปรียบเทียบคำพูดในบทสนทนานี้กับรายการ reference phrases ด้านล่างนี้  
แม้คำจะเขียนไม่เหมือนกันเป๊ะ แต่หากความหมายใกล้เคียง สามารถถือว่า match ได้  

[reference_phrases]
${referenceJson}

[บทสนทนา]
${conversationJson}

ขอให้ feedback ด้วยน้ำเสียงเพื่อนที่เป็นมิตร อบอุ่น และให้กำลังใจ  
ไม่ต้องเป็นทางการ อาจมีอารมณ์ขันเบา ๆ ได้ ถ้าบริบทเหมาะสม  
เหมือนคุยกับเพื่อนที่กำลังหัดเข้าใจใจคนอื่นอยู่ — แบบเป็นเพื่อนที่น่ารักที่ใครก็อยากฝึกกับเธอ
`;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4",
      messages: [{ role: "system", content: analysisPrompt }],
      temperature: 0.7
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      }
    });

    const feedback = response.data.choices[0].message.content.trim();
    console.log("\n📘 Feedback จาก Emmo Coach:\n" + feedback + "\n");
    rl.close();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการวิเคราะห์:", error.message);
    rl.close();
  }
};

loadScenarioFromSupabase(1); // เรียก scenario ID ที่ต้องการ
