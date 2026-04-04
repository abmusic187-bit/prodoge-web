export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  try {
    const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Examine this image. Does it show a profile that has been 'Followed', 'Subscribed', or 'Liked'? Answer only with TRUE or FALSE." },
            { inlineData: { mimeType: "image/jpeg", data: image } }
          ]
        }]
      })
    });

    const data = await googleRes.json();
    const text = data.candidates[0].content.parts[0].text.toUpperCase();

    res.status(200).json({ success: text.includes("TRUE") });
  } catch (err) {
    res.status(500).json({ success: false, error: "AI Processing Error" });
  }
        }
