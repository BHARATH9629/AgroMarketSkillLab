// routes/ai.js — AgroMarket AI Features (Groq + MongoDB logging)
const express = require('express');
const router  = express.Router();
require('dotenv').config();

// MongoDB Models for background logging
let MongoModels = null;
try {
  MongoModels = require('../mongodb');
} catch (e) {
  console.warn('MongoDB models not loaded in ai.js:', e.message);
}

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

function extractJSON(str) {
  if (!str) return null;
  const cleaned = str.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstCurly = cleaned.indexOf('{');
  const firstSquare = cleaned.indexOf('[');
  let target = cleaned;
  if (firstCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
    const lastCurly = cleaned.lastIndexOf('}');
    if (lastCurly !== -1) target = cleaned.slice(firstCurly, lastCurly + 1);
  } else if (firstSquare !== -1) {
    const lastSquare = cleaned.lastIndexOf(']');
    if (lastSquare !== -1) target = cleaned.slice(firstSquare, lastSquare + 1);
  }
  return JSON.parse(target);
}

async function askClaude(systemPrompt, userMessage, maxTokens = 500) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || '';
}

/* ── 1. CHATBOT ───────────────────────────────────────────── */
// POST /api/ai/chat   { message: "...", userId: 1, userName: "Farmer Ram", lang: "kn"|"en" }
router.post('/chat', async (req, res) => {
  const startTime = Date.now();
  try {
    const { message, userId, userName, lang } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'No message provided.' });

    const isKannada = lang === 'kn' || /[\u0C80-\u0CFF]/.test(message);

    const systemPrompt = isKannada
      ? `ನೀವು "ಆಗ್ರೋಬಾಟ್" (AgroBot), ಅಗ್ರೋಮಾರ್ಕೆಟ್ (AgroMarket) ಪೋರ್ಟಲ್‌ನ ಅತ್ಯಂತ ಸ್ನೇಹಪರ ಮತ್ತು ಪರಿಣಿತ AI ಕೃಷಿ ಸಲಹೆಗಾರ.
ರೈತರು, ಖರೀದಿದಾರರು ಮತ್ತು ವಿತರಕರಿಗೆ ಸಹಾಯ ಮಾಡಿ.
ಬೆಳೆಗಳು, ಮಣ್ಣಿನ ಫಲವತ್ತತೆ, ಋತುಮಾನಗಳು, ಕೃಷಿ ಸಲಹೆಗಳು, ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ, ಸಾವಯವ ಕೃಷಿ, ಕರ್ನಾಟಕ ಮತ್ತು ಭಾರತದ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು (mandi rates ₹ ಗಳಲ್ಲಿ) ಮತ್ತು ಅಗ್ರೋಮಾರ್ಕೆಟ್‌ನಲ್ಲಿ ಮಾರಾಟ ಮಾಡುವ ಬಗ್ಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಮಾರ್ಗದರ್ಶನ ನೀಡಿ.
ನಿಯಮಗಳು:
1. ಸಂಪೂರ್ಣ ಉತ್ತರವನ್ನು ಶುದ್ಧ, ಸರಳ ಮತ್ತು ಗೌರವಾನ್ವಿತ ಕನ್ನಡದಲ್ಲಿ (Kannada script) ಮಾತ್ರ ನೀಡಿ.
2. ಉತ್ತರವು 100-150 ಪದಗಳ ಒಳಗೆ ಸ್ಪಷ್ಟ ಮತ್ತು ಉಪಯುಕ್ತವಾಗಿರಲಿ.
3. ದರಗಳನ್ನು ಕೇಳಿದರೆ ಪ್ರಸ್ತುತ ಭಾರತೀಯ ಮಾರುಕಟ್ಟೆಯ ವಾಸ್ತವಿಕ ಬೆಲೆಗಳನ್ನು ರೂಪಾಯಿಗಳಲ್ಲಿ (₹) ತಿಳಿಸಿ.`
      : `You are AgroBot, a friendly AI agricultural consultant for AgroMarket — an Indian agricultural marketplace 
connecting farmers, buyers, and distributors.
Answer questions about: crops, soil, farming tips, Indian mandi rates, seasons, 
organic farming, selling on AgroMarket, and agricultural best practices.
Keep answers under 120 words. Be warm, helpful, and use simple English.
If asked about prices, give realistic Indian market ranges in rupees.`;

    const reply = await askClaude(systemPrompt, message, 350);

    // Asynchronously log to MongoDB
    if (MongoModels?.ChatHistory) {
      MongoModels.ChatHistory.create({
        userId: userId || null,
        userName: userName || 'Guest',
        message,
        reply,
        language: isKannada ? 'kn' : 'en',
        responseTimeMs: Date.now() - startTime
      }).catch(e => console.warn('Mongo Chat log error:', e.message));
    }

    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 2. PRICE SUGGESTION ─────────────────────────────────── */
// POST /api/ai/price  { productName, category }
router.post('/price', async (req, res) => {
  try {
    const { productName, category } = req.body;
    if (!productName) return res.status(400).json({ success: false, message: 'Product name required.' });

    const reply = await askClaude(
      `You are an agricultural pricing expert for India.
       Respond ONLY with valid JSON, no markdown, no extra text.`,
      `Suggest a fair market price for: "${productName}" in category "${category || 'General'}".
       Based on current Indian mandi rates (2025-2026 season).
       Return ONLY this JSON: {"price": 45, "unit": "kg", "min": 40, "max": 50, "reason": "brief reason under 12 words"}`,
      150
    );

    const parsed = extractJSON(reply);

    // Log price tracking to MongoDB
    if (MongoModels?.PriceTracker && parsed?.price) {
      MongoModels.PriceTracker.create({
        productName,
        category: category || 'General',
        price: parsed.price,
        unit: parsed.unit || 'kg',
        source: 'ai_suggestion'
      }).catch(e => console.warn('Mongo Price log error:', e.message));
    }

    res.json({ success: true, ...parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 3. SMART DESCRIPTION ────────────────────────────────── */
// POST /api/ai/description  { productName, category, isOrganic }
router.post('/description', async (req, res) => {
  try {
    const { productName, category, isOrganic } = req.body;
    if (!productName) return res.status(400).json({ success: false, message: 'Product name required.' });

    const reply = await askClaude(
      `You are a product copywriter for an Indian agricultural marketplace.
       Write attractive, honest product descriptions for farm produce listings.`,
      `Write a product description for: "${productName}"
       Category: ${category || 'General'}
       Organic: ${isOrganic ? 'Yes — certified organic' : 'No'}
       
       Requirements:
       - Under 60 words
       - Mention freshness and quality
       - Mention health/nutritional benefit if relevant  
       - Persuasive for buyers
       - No quotes around the text, just the description itself`,
      150
    );

    res.json({ success: true, description: reply.trim() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 4. CROP ADVISOR ─────────────────────────────────────── */
// POST /api/ai/crop  { state, season, soil, water, land, previousCrop }
router.post('/crop', async (req, res) => {
  try {
    const { state, season, soil, water, land, previousCrop, userId } = req.body;
    if (!state) return res.status(400).json({ success: false, message: 'State is required.' });

    const reply = await askClaude(
      `You are an expert Indian agricultural advisor with deep knowledge of 
       state-wise crops, soil types, irrigation, and mandi prices.
       Respond ONLY with valid JSON array, no markdown, no extra text.`,
      `Farm details:
       - State: ${state}
       - Season: ${season || 'Kharif'}
       - Land: ${land || '5'} acres
       - Soil: ${soil || 'Alluvial'}
       - Water: ${water || 'Rain-fed'}
       - Previous crop: ${previousCrop || 'None'}

       Recommend exactly 3 crops. Return ONLY this JSON array:
       [
         {
           "crop": "Crop Name",
           "yield": "X-Y quintals/acre",
           "price": "₹X-Y/quintal",
           "tip": "one practical farming tip under 12 words",
           "profit": "High"
         }
       ]
       profit must be exactly: High, Medium, or Low`,
      500
    );

    const parsed = extractJSON(reply);

    // Log to MongoDB
    if (MongoModels?.CropRecommendation) {
      MongoModels.CropRecommendation.create({
        userId: userId || null,
        state,
        season: season || 'Kharif',
        soil: soil || '',
        water: water || '',
        recommendations: parsed || []
      }).catch(e => console.warn('Mongo Crop log error:', e.message));
    }

    res.json({ success: true, crops: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 5. SMART SEARCH ─────────────────────────────────────── */
// POST /api/ai/search  { query }
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query required.' });

    const reply = await askClaude(
      `You are a search assistant for an Indian agricultural marketplace.
       Extract search intent from natural language queries.
       Respond ONLY with valid JSON, no markdown, no extra text.`,
      `User search query: "${query}"
       
       Available categories: Grains, Vegetables, Fruits, Organic, Pulses, Spices, Dairy, Oilseeds
       
       Return ONLY this JSON:
       {"keywords": ["main keyword"], "category": "category or empty string", "isOrganic": false, "displayText": "what to show user"}`,
      120
    );

    const parsed = extractJSON(reply);
    res.json({ success: true, ...parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 6. DEMAND FORECAST ──────────────────────────────────── */
// POST /api/ai/forecast  { products: [...] }
router.post('/forecast', async (req, res) => {
  try {
    const { products } = req.body;

    const context = products?.length
      ? `The farmer sells: ${products.join(', ')}.`
      : 'General agricultural products.';

    const reply = await askClaude(
      `You are an Indian agricultural market analyst.
       Forecast demand based on current season, festivals, and market trends.
       Respond ONLY with valid JSON array, no markdown, no extra text.`,
      `${context}
       
       Forecast demand for the next 30 days for 5 product categories.
       Return ONLY this JSON array:
       [
         {
           "product": "Product Name",
           "demand": "High",
           "trend": "↑ Rising",
           "reason": "reason under 8 words",
           "suggestedPrice": "₹X/kg"
         }
       ]
       demand must be: High, Medium, or Low
       trend must be: ↑ Rising, ↓ Falling, or → Stable`,
      450
    );

    const parsed = extractJSON(reply);
    res.json({ success: true, forecast: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 7. NEW: AI WEATHER & CLIMATE ADVISOR ────────────────── */
// POST /api/ai/weather-advisor  { state, season, temperature, condition }
router.post('/weather-advisor', async (req, res) => {
  try {
    const { state, season, temperature, condition } = req.body;
    if (!state) return res.status(400).json({ success: false, message: 'State is required.' });

    const reply = await askClaude(
      `You are an agro-meteorology and weather impact specialist for Indian farming.
       Analyze weather patterns and advise farmers on optimal scheduling and risk prevention.
       Respond ONLY with valid JSON, no markdown, no extra text.`,
      `Farm location: ${state}
       Current season: ${season || 'Current'}
       Reported Temperature/Weather: ${temperature || 'Normal'} (${condition || 'Partly Cloudy'})

       Return ONLY this JSON format:
       {
         "summary": "Brief 1-sentence climate overview",
         "sowingWindow": "Best sowing timeframe for this weather",
         "irrigationAlert": "Specific watering advice (e.g., Hold irrigation for 48h)",
         "pestRisk": "Low / Moderate / High",
         "weatherRisks": ["Risk 1", "Risk 2"],
         "actionItems": [
           "Action item 1 under 12 words",
           "Action item 2 under 12 words",
           "Action item 3 under 12 words"
         ]
       }`,
      350
    );

    const parsed = extractJSON(reply);
    res.json({ success: true, weatherAdvice: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 8. NEW: AI PRODUCE QUALITY GRADER ──────────────────── */
// POST /api/ai/quality-grade  { cropName, appearance, moisture, defects }
router.post('/quality-grade', async (req, res) => {
  try {
    const { cropName, appearance, moisture, defects } = req.body;
    if (!cropName) return res.status(400).json({ success: false, message: 'Crop name required.' });

    const reply = await askClaude(
      `You are an agricultural quality inspection expert for Indian APMC mandis.
       Grade produce according to standard AGMARK/APMC parameters.
       Respond ONLY with valid JSON, no markdown, no extra text.`,
      `Crop: ${cropName}
       Appearance / Size / Color: ${appearance || 'Standard uniform shape and color'}
       Moisture Condition: ${moisture || 'Dry and well-cured'}
       Defects or Blemishes: ${defects || 'Minimal or none'}

       Return ONLY this JSON:
       {
         "grade": "Grade A" (or Grade B, Grade C),
         "score": 92,
         "marketTier": "Premium (+15% above mandi average)",
         "shelfLifeDays": 12,
         "assessment": "Brief 15-word quality breakdown",
         "storageAdvice": "Specific storage condition to maintain grade",
         "buyerAppeal": "High / Medium / Low"
       }`,
      300
    );

    const parsed = extractJSON(reply);
    res.json({ success: true, gradeData: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 9. NEW: AI PRICE NEGOTIATION ASSISTANT ─────────────── */
// POST /api/ai/negotiate  { product, basePrice, buyerOffer, quantity, role }
router.post('/negotiate', async (req, res) => {
  try {
    const { product, basePrice, buyerOffer, quantity, role } = req.body;
    if (!product || !basePrice || !buyerOffer) {
      return res.status(400).json({ success: false, message: 'Product, base price, and buyer offer required.' });
    }

    const reply = await askClaude(
      `You are an AI trade mediator and price negotiation coach for agricultural commerce.
       Help buyers and farmers reach fair, win-win transactions based on volume, mandi rates, and margins.
       Respond ONLY with valid JSON, no markdown, no extra text.`,
      `Product: ${product}
       Farmer's Listed Price: ₹${basePrice}/kg
       Buyer's Offer: ₹${buyerOffer}/kg
       Order Volume: ${quantity || '100'} kg
       User Role: ${role || 'farmer'}

       Return ONLY this JSON:
       {
         "verdict": "Fair Offer / Undervalued / Aggressive",
         "counterPrice": 47,
         "reasoning": "Under 15 words explaining the economic reason",
         "counterScript": "Exact polite bargaining message the user can copy-paste to the other party",
         "dealRecommendation": "Accept / Counter-Offer / Reject"
       }`,
      300
    );

    const parsed = extractJSON(reply);
    res.json({ success: true, negotiation: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 10. NEW: AI SOIL HEALTH & NPK ANALYZER ──────────────── */
// POST /api/ai/soil-analyzer  { soilType, ph, nitrogen, phosphorus, potassium, targetCrop, region }
router.post('/soil-analyzer', async (req, res) => {
  try {
    const { soilType, ph, nitrogen, phosphorus, potassium, targetCrop, region } = req.body;

    const reply = await askClaude(
      `You are a senior soil scientist and agronomist in India.
       Analyze soil properties and give targeted nutrient restoration advice.
       Respond ONLY with valid JSON, no markdown, no extra text.`,
      `Region: ${region || 'India'}
       Soil Type: ${soilType || 'Black Soil'}
       pH Level: ${ph || '6.5'}
       NPK Balance: N=${nitrogen || 'Medium'}, P=${phosphorus || 'Medium'}, K=${potassium || 'High'}
       Target Crop Planned: ${targetCrop || 'General rotation'}

       Return ONLY this JSON:
       {
         "soilStatus": "Good / Moderate / Acidic / Alkaline / Nutrient Deficient",
         "phAssessment": "pH impact explanation in 10 words",
         "fertilizerPlan": "Specific NPK / Urea / DAP recommendation",
         "organicRemedies": [
           "Organic remedy 1",
           "Organic remedy 2"
         ],
         "idealAlternativeCrops": ["Crop 1", "Crop 2", "Crop 3"],
         "yieldPotential": "Expected yield rating e.g., 85-95%"
       }`,
      350
    );

    const parsed = extractJSON(reply);
    res.json({ success: true, soilAnalysis: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;