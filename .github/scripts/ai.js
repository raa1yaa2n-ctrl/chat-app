const fs = require('fs');
const key = process.env.GEMINI_API_KEY;
const prompt = process.env.PROMPT;

async function main() {
  const file = 'index.html';
  const code = fs.readFileSync(file, 'utf8');

  // اسم مدل رو دقیق‌تر کردیم و آدرس رو اصلاح کردیم
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Here is an HTML file:\n${code}\n\nUser request: ${prompt}\n\nReturn ONLY the new full HTML code, no markdown, no explanation.` }] }]
    })
  });
  
  const data = await res.json();
  
  // این بخش جدید اضافه شد تا اگه خطایی بود، دقیق بهمون بگه
  if (data.error) {
    console.error("Gemini API Error:", data.error.message);
    process.exit(1); 
  }

  if (!data.candidates || !data.candidates[0]) {
    console.error("Unexpected response:", JSON.stringify(data));
    process.exit(1);
  }

  let newCode = data.candidates[0].content.parts[0].text;
  newCode = newCode.replace(/```html/g, '').replace(/```/g, '').trim();
  fs.writeFileSync(file, newCode);
}
main();
