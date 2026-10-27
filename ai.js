/* ============================================================
   AgroMarket — AI Features (Frontend)
   File: ai.js  — calls /api/ai/* (Claude claude-sonnet-4-20250514 via backend)

   Features:
     1. AI Chatbot          — floating bubble, bottom-right
     2. AI Price Suggestion — inside farmer product form
     3. Smart Description   — inside farmer product form
     4. AI Crop Advisor     — nav link + full modal
     5. AI Smart Search     — marketplace search bar
     6. AI Demand Forecast  — inside farmer dashboard
   ============================================================ */

/* ── Core caller — hits your own backend ────────────────── */
async function callAI(endpoint, body = {}) {
  const res  = await fetch(`/api/ai/${endpoint}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'AI error');
  return data;
}

/* ============================================================
   FEATURE 1 — AI CHATBOT (Bilingual: English & ಕನ್ನಡ)
   Floating green robot bubble, bottom-right corner
   ============================================================ */
function renderQuickChips(isKn) {
  if (isKn) {
    return `
      <button type="button" onclick="askQuickPrompt('ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಉತ್ತಮ?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">🌾 ಬೆಳೆ ಸಲಹೆ</button>
      <button type="button" onclick="askQuickPrompt('ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರಗಳು ಹೇಗಿವೆ?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">💰 ಮಾರುಕಟ್ಟೆ ದರ</button>
      <button type="button" onclick="askQuickPrompt('ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಲು ಏನು ಮಾಡಬೇಕು?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">🧪 ಮಣ್ಣು &amp; ಗೊಬ್ಬರ</button>
      <button type="button" onclick="askQuickPrompt('ಬೆಳೆಗಳಿಗೆ ಕೀಟ ರಕ್ಷಣೆ ಹೇಗೆ ಮಾಡುವುದು?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">🐛 ಕೀಟ ರಕ್ಷಣೆ</button>
      <button type="button" onclick="askQuickPrompt('ಅಗ್ರೋಮಾರ್ಕೆಟ್‌ನಲ್ಲಿ ಬೆಳೆ ಮಾರಾಟ ಮಾಡುವುದು ಹೇಗೆ?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">📦 ಮಾರಾಟ ವಿಧಾನ</button>
    `;
  }
  return `
    <button type="button" onclick="askQuickPrompt('What is the best fertilizer for tomatoes?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">🌾 Crop Advice</button>
    <button type="button" onclick="askQuickPrompt('What are today\'s mandi market prices?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">💰 Mandi Rates</button>
    <button type="button" onclick="askQuickPrompt('How to improve soil health and NPK balance?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">🧪 Soil Health</button>
    <button type="button" onclick="askQuickPrompt('How to protect crops from seasonal pests?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">🐛 Pest Control</button>
    <button type="button" onclick="askQuickPrompt('How to sell produce on AgroMarket?')" style="background:#f0fdf4;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;cursor:pointer;flex-shrink:0;">📦 How to Sell</button>
  `;
}

window.askQuickPrompt = function(promptText) {
  const chips = document.getElementById('aiQuickChips');
  if (chips) chips.innerHTML = renderQuickChips(isKn);

  const input = document.getElementById('chatInput');
  if (input) {
    input.value = promptText;
    sendChat();
  }
};

function buildChatbot() {
  const isKn = typeof AgroLang !== 'undefined' && AgroLang.current === 'kn';

  /* Floating button */
  const btn = document.createElement('div');
  btn.id = 'aiChatBtn';
  btn.innerHTML = `<i class="fas fa-robot"></i>
    <span id="aiBtnLabel" style="font-size:12px;font-weight:700;margin-left:6px;font-family:'Poppins',sans-serif;">${isKn ? 'AI ಕೇಳಿ' : 'Ask AI'}</span>`;
  btn.style.cssText = `
    position:fixed;bottom:28px;right:28px;
    background:linear-gradient(135deg,#16a34a,#22c55e);
    color:#fff;border-radius:30px;padding:12px 18px;
    display:flex;align-items:center;cursor:pointer;z-index:8000;
    box-shadow:0 6px 24px rgba(22,163,74,0.5);
    transition:transform 0.2s,box-shadow 0.2s;font-size:20px;`;
  btn.title = isKn ? 'ಆಗ್ರೋಬಾಟ್ — AI ಕೃಷಿ ಸಹಾಯಕ' : 'AgroBot — AI Farming Assistant';
  btn.onmouseover = () => btn.style.transform = 'scale(1.06)';
  btn.onmouseout  = () => btn.style.transform = 'scale(1)';
  btn.onclick     = toggleChatbot;
  document.body.appendChild(btn);

  /* Chat window */
  const win = document.createElement('div');
  win.id = 'aiChatWin';
  win.style.cssText = `
    position:fixed;bottom:96px;right:28px;width:370px;max-width:95vw;
    height:500px;background:#fff;border-radius:20px;
    box-shadow:0 20px 60px rgba(0,0,0,0.2);z-index:8001;
    display:none;flex-direction:column;overflow:hidden;
    font-family:'Poppins',sans-serif;`;
  win.innerHTML = `
    <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
      <div style="display:flex;align-items:center;gap:10px;color:#fff;">
        <i class="fas fa-robot" style="font-size:22px;"></i>
        <div>
          <div id="aiChatTitle" style="font-weight:800;font-size:15px;">${isKn ? 'ಆಗ್ರೋಬಾಟ್ 🌱' : 'AgroBot 🌱'}</div>
          <div id="aiChatSub" style="font-size:11px;opacity:0.9;">${isKn ? 'ಕ್ಲಾಡ್ AI ನಿಂದ ಚಾಲಿತವಾಗಿದೆ' : 'Powered by Claude AI'}</div>
        </div>
      </div>
      <button onclick="toggleChatbot()" style="background:rgba(255,255,255,0.25);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:700;">✕</button>
    </div>

    <div id="chatMessages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;">
      <div id="aiWelcomeMsg" style="background:#f0fdf4;border-radius:14px 14px 14px 4px;padding:12px 14px;font-size:13px;color:#374151;max-width:88%;line-height:1.5;">
        ${isKn ? `
          👋 ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಲಹೆಗಾರ <b>ಆಗ್ರೋಬಾಟ್</b>.<br/><br/>
          ನನ್ನನ್ನು ಕೇಳಿ:<br/>
          🌾 ಬೆಳೆ ಸಲಹೆ ಮತ್ತು ಉತ್ತಮ ಋತುಗಳು<br/>
          💰 ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ಪ್ರವೃತ್ತಿ<br/>
          🚜 ಕೃಷಿ ಸಲಹೆಗಳು ಮತ್ತು ತಂತ್ರಗಳು<br/>
          📦 ಅಗ್ರೋಮಾರ್ಕೆಟ್‌ನಲ್ಲಿ ಮಾರಾಟ ಮಾಡುವುದು
        ` : `
          👋 Hi! I'm <b>AgroBot</b>, your AI farming assistant.<br/><br/>
          Ask me about:<br/>
          🌾 Crop advice &amp; best seasons<br/>
          💰 Market prices &amp; trends<br/>
          🚜 Farming tips &amp; techniques<br/>
          📦 Selling on AgroMarket
        `}
      </div>
    </div>

    <div id="aiQuickChips" style="padding:6px 12px;display:flex;gap:6px;overflow-x:auto;border-top:1px solid #f0fdf4;background:#fafdfb;flex-shrink:0;">${renderQuickChips(isKn)}</div>
    <div style="padding:10px 12px;border-top:1px solid #e5e7eb;display:flex;gap:8px;flex-shrink:0;">
      <input id="chatInput" placeholder="${isKn ? 'ಬೆಳೆಗಳು, ದರಗಳು, ಕೃಷಿ ಬಗ್ಗೆ ಕೇಳಿ…' : 'Ask about crops, prices, farming…'}"
        style="flex:1;padding:10px 14px;border:1.5px solid #d1fae5;border-radius:25px;font-size:13px;outline:none;font-family:'Poppins',sans-serif;"
        onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'"
        onkeydown="if(event.key==='Enter')sendChat()"/>
      <button onclick="sendChat()"
        style="background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:15px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>`;
  document.body.appendChild(win);
}

function toggleChatbot() {
  const win  = document.getElementById('aiChatWin');
  if (!win) return;
  const isKn = typeof AgroLang !== 'undefined' && AgroLang.current === 'kn';
  const open = win.style.display === 'flex';
  win.style.display = open ? 'none' : 'flex';
  const label = document.getElementById('aiBtnLabel');
  if (label) {
    if (isKn) {
      label.textContent = open ? 'AI ಕೇಳಿ' : 'ಮುಚ್ಚಿ';
    } else {
      label.textContent = open ? 'Ask AI' : 'Close';
    }
  }
}

function chatBubble(text, isUser) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.style.cssText = `
    background:${isUser ? 'linear-gradient(135deg,#16a34a,#22c55e)' : '#f0fdf4'};
    color:${isUser ? '#fff' : '#374151'};
    border-radius:${isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px'};
    padding:10px 14px;font-size:13px;max-width:88%;
    align-self:${isUser ? 'flex-end' : 'flex-start'};
    line-height:1.5;white-space:pre-wrap;`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  chatBubble(msg, true);

  const isKn = typeof AgroLang !== 'undefined' && AgroLang.current === 'kn';
  const typing = chatBubble(isKn ? '🌱 ಯೋಚಿಸುತ್ತಿದೆ...' : '🌱 Thinking…', false);
  try {
    const u = (typeof AgroAPI !== 'undefined' && AgroAPI.currentUser) ? AgroAPI.currentUser() : null;
    const data   = await callAI('chat', {
      message: msg,
      userId: u ? u.id : null,
      userName: u ? u.full_name : 'Guest',
      lang: isKn ? 'kn' : 'en'
    });
    typing.textContent = data.reply;
  } catch (err) {
    typing.textContent = `⚠️ ${err.message}`;
  }
}

/* ── Dynamic AI Language Switching ── */
function updateAILanguage(lang) {
  const isKn = lang === 'kn';

  // Floating AI Chat button & window
  const label = document.getElementById('aiBtnLabel');
  if (label) label.textContent = isKn ? 'AI ಕೇಳಿ' : 'Ask AI';

  const title = document.getElementById('aiChatTitle');
  if (title) title.textContent = isKn ? 'ಆಗ್ರೋಬಾಟ್ 🌱' : 'AgroBot 🌱';

  const sub = document.getElementById('aiChatSub');
  if (sub) sub.textContent = isKn ? 'ಕ್ಲಾಡ್ AI ನಿಂದ ಚಾಲಿತವಾಗಿದೆ' : 'Powered by Claude AI';

  const input = document.getElementById('chatInput');
  if (input) input.placeholder = isKn ? 'ಬೆಳೆಗಳು, ದರಗಳು, ಕೃಷಿ ಬಗ್ಗೆ ಕೇಳಿ…' : 'Ask about crops, prices, farming…';

  const welcome = document.getElementById('aiWelcomeMsg');
  if (welcome) {
    welcome.innerHTML = isKn ? `
      👋 ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಲಹೆಗಾರ <b>ಆಗ್ರೋಬಾಟ್</b>.<br/><br/>
      ನನ್ನನ್ನು ಕೇಳಿ:<br/>
      🌾 ಬೆಳೆ ಸಲಹೆ ಮತ್ತು ಉತ್ತಮ ಋತುಗಳು<br/>
      💰 ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ಪ್ರವೃತ್ತಿ<br/>
      🚜 ಕೃಷಿ ಸಲಹೆಗಳು ಮತ್ತು ತಂತ್ರಗಳು<br/>
      📦 ಅಗ್ರೋಮಾರ್ಕೆಟ್‌ನಲ್ಲಿ ಮಾರಾಟ ಮಾಡುವುದು
    ` : `
      👋 Hi! I'm <b>AgroBot</b>, your AI farming assistant.<br/><br/>
      Ask me about:<br/>
      🌾 Crop advice &amp; best seasons<br/>
      💰 Market prices &amp; trends<br/>
      🚜 Farming tips &amp; techniques<br/>
      📦 Selling on AgroMarket
    `;
  }

  // AI Suite Nav button
  const suiteBtn = document.getElementById('aiSuiteNavBtn');
  if (suiteBtn) {
    suiteBtn.innerHTML = `<i class="fas fa-brain"></i> ${isKn ? 'AI ಸೂಟ್' : 'AI Suite'} <i class="fas fa-chevron-down" style="font-size:9px;"></i>`;
  }

  // AI Suite Dropdown
  const dd = document.getElementById('aiSuiteDropdown');
  if (dd) {
    dd.innerHTML = isKn ? `
      <div onclick="openModal('cropAdvisorModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-seedling" style="color:#16a34a;width:16px;"></i> 🌾 ಬೆಳೆ ಸಲಹೆಗಾರ (Crop Advisor)
      </div>
      <div onclick="openModal('weatherAdvisorModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-cloud-sun-rain" style="color:#0284c7;width:16px;"></i> 🌤️ ಹವಾಮಾನ ಸಲಹೆಗಾರ (Weather)
      </div>
      <div onclick="openModal('qualityGraderModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-award" style="color:#ca8a04;width:16px;"></i> 🔍 ಗುಣಮಟ್ಟ ಶ್ರೇಣೀಕರಣ (Quality)
      </div>
      <div onclick="openModal('soilAnalyzerModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-vial" style="color:#059669;width:16px;"></i> 🧪 ಮಣ್ಣಿನ ಆರೋಗ್ಯ & NPK (Soil)
      </div>
      <div onclick="buildNegotiateModal();toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-handshake" style="color:#8b5cf6;width:16px;"></i> 🤝 ದರ ಚೌಕಾಶಿ ಮಾರ್ಗದರ್ಶಿ (Bargain)
      </div>
    ` : `
      <div onclick="openModal('cropAdvisorModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-seedling" style="color:#16a34a;width:16px;"></i> 🌾 Crop Advisor
      </div>
      <div onclick="openModal('weatherAdvisorModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-cloud-sun-rain" style="color:#0284c7;width:16px;"></i> 🌤️ Weather Advisor
      </div>
      <div onclick="openModal('qualityGraderModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-award" style="color:#ca8a04;width:16px;"></i> 🔍 Quality Grader
      </div>
      <div onclick="openModal('soilAnalyzerModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-vial" style="color:#059669;width:16px;"></i> 🧪 Soil Health NPK
      </div>
      <div onclick="buildNegotiateModal();toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
        <i class="fas fa-handshake" style="color:#8b5cf6;width:16px;"></i> 🤝 Bargain Coach
      </div>
    `;
  }

  // Product form AI buttons
  const priceBtn = document.getElementById('aiPriceBtn');
  if (priceBtn) {
    priceBtn.innerHTML = `<i class="fas fa-rupee-sign"></i> ${isKn ? 'AI ಬೆಲೆ ಸಲಹೆ' : 'AI Suggest Price'}`;
  }
  const descBtn = document.getElementById('aiDescBtn');
  if (descBtn) {
    descBtn.innerHTML = `<i class="fas fa-magic"></i> ${isKn ? 'AI ವಿವರಣೆ ಬರೆಯಿರಿ' : 'AI Write Description'}`;
  }
}
window.updateAILanguage = updateAILanguage;

/* ============================================================
   FEATURE 2 — AI PRICE SUGGESTION
   FEATURE 3 — SMART DESCRIPTION
   Both inject buttons into the farmer's Add Product form
   ============================================================ */
function injectAIIntoProductForm() {
  // Works with whatever IDs app.js uses for the product form
  const nameInput = document.getElementById('pName')
    || document.querySelector('input[placeholder*="roduct"]');
  if (!nameInput || document.getElementById('aiFormToolbar')) return;

  const toolbar = document.createElement('div');
  toolbar.id = 'aiFormToolbar';
  toolbar.style.cssText = 'display:flex;gap:8px;margin:8px 0 14px;flex-wrap:wrap;align-items:center;';
  toolbar.innerHTML = `
    <button id="aiPriceBtn" type="button" onclick="aiSuggestPrice()"
      style="display:flex;align-items:center;gap:6px;padding:7px 14px;background:#f0fdf4;border:1.5px solid #16a34a;color:#15803d;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Poppins',sans-serif;">
      <i class="fas fa-rupee-sign"></i> AI Suggest Price
    </button>
    <button id="aiDescBtn" type="button" onclick="aiWriteDescription()"
      style="display:flex;align-items:center;gap:6px;padding:7px 14px;background:#f0fdf4;border:1.5px solid #16a34a;color:#15803d;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Poppins',sans-serif;">
      <i class="fas fa-magic"></i> AI Write Description
    </button>
    <div id="aiFormMsg" style="width:100%;font-size:12px;color:#15803d;display:none;padding:6px 10px;background:#f0fdf4;border-radius:8px;border-left:3px solid #16a34a;"></div>`;

  // Insert right after the product name field's parent
  const target = nameInput.closest('div') || nameInput.parentElement;
  target.insertAdjacentElement('afterend', toolbar);
}

async function aiSuggestPrice() {
  const nameInput  = document.getElementById('pName') || document.querySelector('input[placeholder*="roduct"]');
  const priceInput = document.getElementById('pPrice') || document.querySelector('input[type="number"]');
  const catSelect  = document.getElementById('pCategory') || document.querySelector('select');
  const msg        = document.getElementById('aiFormMsg');
  const btn        = document.getElementById('aiPriceBtn');

  const productName = nameInput?.value.trim();
  const category    = catSelect?.options?.[catSelect.selectedIndex]?.text || '';
  if (!productName) { showToast('Enter product name first', 'warning', 'AI Price'); return; }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting price…';
  btn.disabled  = true;
  if (msg) { msg.style.display = 'block'; msg.textContent = '🤖 Checking current mandi rates…'; }

  try {
    const data = await callAI('price', { productName, category });
    if (priceInput) priceInput.value = data.price;
    if (msg) msg.textContent = `✅ Suggested ₹${data.price}/${data.unit} (range ₹${data.min}–₹${data.max}) — ${data.reason}`;
    showToast(`AI suggests ₹${data.price}/${data.unit}`, 'success', '💰 Price Suggestion');
  } catch (err) {
    if (msg) msg.textContent = `⚠️ ${err.message}`;
    showToast('AI price failed', 'error', 'AI Error');
  } finally {
    btn.innerHTML = '<i class="fas fa-rupee-sign"></i> AI Suggest Price';
    btn.disabled  = false;
  }
}

async function aiWriteDescription() {
  const nameInput = document.getElementById('pName') || document.querySelector('input[placeholder*="roduct"]');
  const descInput = document.getElementById('pDesc') || document.querySelector('textarea');
  const catSelect = document.getElementById('pCategory') || document.querySelector('select');
  const orgCheck  = document.getElementById('pOrganic') || document.querySelector('input[type="checkbox"]');
  const msg       = document.getElementById('aiFormMsg');
  const btn       = document.getElementById('aiDescBtn');

  const productName = nameInput?.value.trim();
  const category    = catSelect?.options?.[catSelect.selectedIndex]?.text || '';
  const isOrganic   = orgCheck?.checked || false;
  if (!productName) { showToast('Enter product name first', 'warning', 'AI Description'); return; }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Writing…';
  btn.disabled  = true;
  if (msg) { msg.style.display = 'block'; msg.textContent = '🤖 Writing product description…'; }

  try {
    const data = await callAI('description', { productName, category, isOrganic });
    if (descInput) descInput.value = data.description;
    if (msg) msg.textContent = '✅ Description written! Edit if needed.';
    showToast('AI description added!', 'success', '✍️ Smart Description');
  } catch (err) {
    if (msg) msg.textContent = `⚠️ ${err.message}`;
    showToast('AI description failed', 'error', 'AI Error');
  } finally {
    btn.innerHTML = '<i class="fas fa-magic"></i> AI Write Description';
    btn.disabled  = false;
  }
}

/* ============================================================
   FEATURE 4 — AI CROP ADVISOR (full modal)
   ============================================================ */
function buildCropAdvisor() {
  if (document.getElementById('cropAdvisorModal')) return;
  const modal = document.createElement('div');
  modal.id    = 'cropAdvisorModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
  modal.addEventListener('click', e => { if (e.target === modal) closeModal('cropAdvisorModal'); });

  const states = ['Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Maharashtra','Rajasthan',
    'Gujarat','Karnataka','Andhra Pradesh','Tamil Nadu','Telangana','Bihar',
    'West Bengal','Odisha','Chhattisgarh','Kerala','Himachal Pradesh','Assam'];

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:92%;max-width:600px;max-height:90vh;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.2);display:flex;flex-direction:column;">

      <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:20px 26px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div style="color:#fff;">
          <div style="font-size:18px;font-weight:800;font-family:'Poppins',sans-serif;">🌾 AI Crop Advisor</div>
          <div style="font-size:11px;opacity:0.85;margin-top:2px;">Powered by Claude AI · Personalised for your farm</div>
        </div>
        <button onclick="closeModal('cropAdvisorModal')" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:700;">✕</button>
      </div>

      <div style="padding:22px 26px;overflow-y:auto;flex:1;font-family:'Poppins',sans-serif;">
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px;">Tell me about your farm — I'll recommend the best crops for this season.</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">

          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Your State</label>
            <select id="cropState" style="width:100%;padding:10px;border:1.5px solid #d1fae5;border-radius:10px;font-size:13px;font-family:'Poppins',sans-serif;outline:none;box-sizing:border-box;background:#f9fafb;" onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'">
              <option value="">Select state…</option>
              ${states.map(s => `<option>${s}</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Season</label>
            <select id="cropSeason" style="width:100%;padding:10px;border:1.5px solid #d1fae5;border-radius:10px;font-size:13px;font-family:'Poppins',sans-serif;outline:none;box-sizing:border-box;background:#f9fafb;" onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'">
              <option value="Kharif (Jun-Oct)">Kharif (Jun–Oct)</option>
              <option value="Rabi (Nov-Mar)">Rabi (Nov–Mar)</option>
              <option value="Zaid (Mar-Jun)">Zaid (Mar–Jun)</option>
            </select>
          </div>

          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Land Size (acres)</label>
            <input id="cropLand" type="number" placeholder="e.g. 5" min="0.5" step="0.5"
              style="width:100%;padding:10px;border:1.5px solid #d1fae5;border-radius:10px;font-size:13px;font-family:'Poppins',sans-serif;outline:none;box-sizing:border-box;"
              onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'"/>
          </div>

          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Soil Type</label>
            <select id="cropSoil" style="width:100%;padding:10px;border:1.5px solid #d1fae5;border-radius:10px;font-size:13px;font-family:'Poppins',sans-serif;outline:none;box-sizing:border-box;background:#f9fafb;" onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'">
              <option>Alluvial</option><option>Black (Regur)</option><option>Red</option>
              <option>Laterite</option><option>Sandy</option><option>Loamy</option><option>Clay</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:6px;">Water Availability</label>
          <div style="display:flex;gap:14px;flex-wrap:wrap;">
            ${['Rain-fed only','Irrigation available','Borewell','River nearby'].map((w,i) => `
              <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer;">
                <input type="radio" name="cropWater" value="${w}" ${i===0?'checked':''} style="accent-color:#16a34a;"/> ${w}
              </label>`).join('')}
          </div>
        </div>

        <div style="margin-bottom:18px;">
          <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Previous Crop (optional)</label>
          <input id="cropPrev" type="text" placeholder="e.g. Wheat, Rice, Cotton…"
            style="width:100%;padding:10px;border:1.5px solid #d1fae5;border-radius:10px;font-size:13px;font-family:'Poppins',sans-serif;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'"/>
        </div>

        <button onclick="getAICropAdvice()" id="cropAdviceBtn"
          style="width:100%;padding:13px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;">
          <i class="fas fa-seedling"></i> Get AI Crop Recommendations
        </button>

        <div id="cropResults" style="display:none;margin-top:20px;"></div>
      </div>
    </div>`;

  document.body.appendChild(modal);
}

async function getAICropAdvice() {
  const state  = document.getElementById('cropState')?.value;
  const season = document.getElementById('cropSeason')?.value;
  const land   = document.getElementById('cropLand')?.value || '5';
  const soil   = document.getElementById('cropSoil')?.value;
  const water  = document.querySelector('input[name="cropWater"]:checked')?.value || 'Rain-fed only';
  const prev   = document.getElementById('cropPrev')?.value || 'None';
  const results = document.getElementById('cropResults');
  const btn     = document.getElementById('cropAdviceBtn');

  if (!state) { showToast('Please select your state', 'warning', 'Crop Advisor'); return; }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Claude AI is analysing your farm…';
  btn.disabled  = true;
  results.style.display = 'none';

  try {
    const data  = await callAI('crop', { state, season, soil, water, land, previousCrop: prev });
    const crops = data.crops;
    const clr   = { High: '#16a34a', Medium: '#f59e0b', Low: '#ef4444' };
    const bg    = { High: '#f0fdf4', Medium: '#fffbeb', Low: '#fef2f2' };

    results.style.display = 'block';
    results.innerHTML = `
      <div style="font-weight:700;font-size:14px;color:#052e16;margin-bottom:14px;font-family:'Poppins',sans-serif;">
        🌾 Top 3 Crops for your ${state} farm this ${season}:
      </div>
      ${crops.map((c, i) => `
        <div style="background:${bg[c.profit]||'#f9fafb'};border:1px solid ${clr[c.profit]||'#e5e7eb'}44;border-radius:14px;padding:16px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:15px;font-weight:800;color:#052e16;font-family:'Poppins',sans-serif;">${i+1}. ${c.crop}</span>
            <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:${clr[c.profit]}22;color:${clr[c.profit]};">${c.profit} Profit</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
            <div style="font-size:12px;color:#6b7280;font-family:'Poppins',sans-serif;"><i class="fas fa-weight-hanging" style="color:#16a34a;margin-right:4px;"></i>${c.yield}</div>
            <div style="font-size:12px;color:#6b7280;font-family:'Poppins',sans-serif;"><i class="fas fa-rupee-sign" style="color:#16a34a;margin-right:4px;"></i>${c.price}</div>
          </div>
          <div style="font-size:12px;color:#374151;background:#fff;border-radius:8px;padding:8px 10px;font-family:'Poppins',sans-serif;">💡 ${c.tip}</div>
        </div>`).join('')}
      <p style="font-size:11px;color:#9ca3af;text-align:right;font-family:'Poppins',sans-serif;">Powered by Claude AI</p>`;

  } catch (err) {
    results.style.display = 'block';
    results.innerHTML = `<div style="color:#ef4444;font-size:13px;padding:12px;background:#fef2f2;border-radius:10px;">⚠️ ${err.message}</div>`;
  } finally {
    btn.innerHTML = '<i class="fas fa-seedling"></i> Get AI Crop Recommendations';
    btn.disabled  = false;
  }
}

/* ============================================================
   FEATURE 5 — AI SMART SEARCH
   ============================================================ */
function patchSmartSearch() {
  const searchInput = document.querySelector(
    '.market-search input, input[placeholder*="earch"], #searchInput'
  );
  if (!searchInput || searchInput.dataset.aiPatched) return;
  searchInput.dataset.aiPatched = 'true';

  // AI badge below search box
  const badge = document.createElement('div');
  badge.id = 'aiSearchBadge';
  badge.style.cssText = 'font-size:11px;color:#16a34a;font-family:Poppins,sans-serif;padding:4px 8px;display:none;';
  badge.innerHTML = '<i class="fas fa-robot"></i> <span id="aiSearchText">AI is understanding your search…</span>';
  const wrap = searchInput.closest('div') || searchInput.parentElement;
  wrap.insertAdjacentElement('afterend', badge);

  let timer;
  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    const q = searchInput.value.trim();
    if (q.length < 4) { badge.style.display = 'none'; return; }
    badge.style.display = 'block';
    document.getElementById('aiSearchText').textContent = 'AI is understanding your search…';
    timer = setTimeout(() => runAISearch(q), 900);
  });
}

async function runAISearch(query) {
  const badge = document.getElementById('aiSearchBadge');
  const text  = document.getElementById('aiSearchText');
  try {
    const data = await callAI('search', { query });
    // Trigger the existing loadProducts or handleFilter
    if (typeof loadProducts === 'function') {
      const params = {};
      if (data.keywords?.length) params.search = data.keywords[0];
      if (data.category)         params.category = data.category;
      if (data.isOrganic)        params.is_organic = 'true';
      loadProducts(params);
    } else if (data.category && typeof handleFilter === 'function') {
      const btn = document.querySelector(`.filter-btn[data-filter="${data.category.toLowerCase()}"]`);
      if (btn) btn.click();
    }
    if (text) text.textContent = `Found: ${data.displayText || data.keywords?.join(', ') || query}`;
    setTimeout(() => badge && (badge.style.display = 'none'), 3000);
  } catch {
    badge && (badge.style.display = 'none');
  }
}

/* ============================================================
   FEATURE 6 — AI DEMAND FORECAST
   Injected into the Farmer Dashboard modal
   ============================================================ */
function injectDemandForecast() {
  const modal = document.getElementById('farmerModal');
  if (!modal || document.getElementById('aiForecastSection')) return;

  // Find the inner white card div
  const inner = modal.querySelector('div[style*="background:#fff"]')
    || modal.querySelector('div > div');
  if (!inner) return;

  const section = document.createElement('div');
  section.id = 'aiForecastSection';
  section.style.cssText = 'margin-top:20px;padding-top:16px;border-top:1px solid #f0fdf4;font-family:"Poppins",sans-serif;';
  section.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <h4 style="font-size:14px;font-weight:700;color:#052e16;margin:0;">
        <i class="fas fa-chart-line" style="color:#16a34a;margin-right:6px;"></i>AI Demand Forecast
      </h4>
      <button onclick="loadAIDemandForecast()" id="forecastBtn"
        style="background:#f0fdf4;border:1.5px solid #16a34a;color:#15803d;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Poppins',sans-serif;">
        <i class="fas fa-robot"></i> Run AI Forecast
      </button>
    </div>
    <div id="forecastResults" style="font-size:12px;color:#9ca3af;padding:8px 0;">
      Click "Run AI Forecast" to see which crops are in high demand this season.
    </div>`;

  inner.appendChild(section);
}

async function loadAIDemandForecast() {
  const btn     = document.getElementById('forecastBtn');
  const results = document.getElementById('forecastResults');
  if (!btn || !results) return;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analysing…';
  btn.disabled  = true;
  results.innerHTML = '<i class="fas fa-spinner fa-spin" style="color:#16a34a;"></i> Claude AI is forecasting demand…';

  try {
    // Optionally pass farmer's product names if visible in DOM
    const productNames = [...document.querySelectorAll('#farmerModal h4, #farmerModal .product-name')]
      .map(el => el.textContent.trim()).filter(Boolean).slice(0, 5);

    const data  = await callAI('forecast', { products: productNames });
    const items = data.forecast;

    const clr = { High: '#16a34a', Medium: '#f59e0b', Low: '#ef4444' };
    const bg  = { High: '#f0fdf4', Medium: '#fffbeb', Low: '#fef2f2' };

    results.innerHTML = `
      <div style="display:grid;gap:7px;">
        ${items.map(item => `
          <div style="background:${bg[item.demand]||'#f9fafb'};border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <div style="flex:1;min-width:0;">
              <span style="font-weight:700;color:#052e16;font-size:13px;">${item.product}</span>
              <span style="font-size:11px;color:#6b7280;margin-left:6px;">${item.reason}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
              <span style="font-size:12px;">${item.trend}</span>
              <span style="font-size:12px;color:#16a34a;font-weight:600;">${item.suggestedPrice}</span>
              <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;background:${clr[item.demand]}22;color:${clr[item.demand]};">${item.demand}</span>
            </div>
          </div>`).join('')}
      </div>
      <p style="font-size:11px;color:#9ca3af;margin-top:8px;text-align:right;">Claude AI Forecast · ${new Date().toLocaleDateString('en-IN')}</p>`;

  } catch (err) {
    results.innerHTML = `<div style="color:#ef4444;font-size:12px;padding:8px;background:#fef2f2;border-radius:8px;">⚠️ ${err.message}</div>`;
  } finally {
    btn.innerHTML = '<i class="fas fa-robot"></i> Run AI Forecast';
    btn.disabled  = false;
  }
}

/* ============================================================
   FEATURE 7 — AI WEATHER & CLIMATE ADVISOR (Modal)
   ============================================================ */
function buildWeatherAdvisor() {
  if (document.getElementById('weatherAdvisorModal')) return;
  const modal = document.createElement('div');
  modal.id    = 'weatherAdvisorModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
  modal.addEventListener('click', e => { if (e.target === modal) closeModal('weatherAdvisorModal'); });

  const states = ['Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Maharashtra','Rajasthan',
    'Gujarat','Karnataka','Andhra Pradesh','Tamil Nadu','Telangana','Bihar',
    'West Bengal','Odisha','Chhattisgarh','Kerala','Himachal Pradesh','Assam'];

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:92%;max-width:620px;max-height:90vh;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.2);display:flex;flex-direction:column;font-family:'Poppins',sans-serif;">
      <div style="background:linear-gradient(135deg,#0284c7,#38bdf8);padding:20px 26px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div style="color:#fff;">
          <div style="font-size:18px;font-weight:800;"><i class="fas fa-cloud-sun-rain"></i> AI Weather &amp; Climate Advisor</div>
          <div style="font-size:11px;opacity:0.9;margin-top:2px;">Agro-meteorology &amp; intelligent sowing protection</div>
        </div>
        <button onclick="closeModal('weatherAdvisorModal')" style="background:rgba(255,255,255,0.25);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:700;">✕</button>
      </div>

      <div style="padding:22px 26px;overflow-y:auto;flex:1;">
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px;">Get personalized weather-aware agricultural scheduling and risk mitigation.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">State / Location</label>
            <select id="wState" style="width:100%;padding:10px;border:1.5px solid #bae6fd;border-radius:10px;font-size:13px;outline:none;background:#f0f9ff;">
              <option value="">Select state…</option>
              ${states.map(s => `<option>${s}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Season</label>
            <select id="wSeason" style="width:100%;padding:10px;border:1.5px solid #bae6fd;border-radius:10px;font-size:13px;outline:none;background:#f0f9ff;">
              <option>Kharif (Monsoon / Autumn)</option>
              <option>Rabi (Winter / Spring)</option>
              <option>Zaid (Summer)</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Est. Temperature</label>
            <input id="wTemp" placeholder="e.g. 28°C - 34°C" style="width:100%;padding:10px;border:1.5px solid #bae6fd;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Forecast Condition</label>
            <select id="wCondition" style="width:100%;padding:10px;border:1.5px solid #bae6fd;border-radius:10px;font-size:13px;outline:none;background:#f0f9ff;">
              <option>Normal Seasonal Weather</option>
              <option>Heavy Rain / Monsoon Inflow</option>
              <option>Dry Spell / Heatwave</option>
              <option>Cloudy with High Humidity</option>
              <option>Unseasonal Hail / Storm Alert</option>
            </select>
          </div>
        </div>

        <button onclick="getAIWeatherAdvice()" id="weatherAdviceBtn"
          style="width:100%;padding:12px;background:linear-gradient(135deg,#0284c7,#38bdf8);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 15px rgba(2,132,199,0.3);">
          <i class="fas fa-meteor"></i> Analyze Weather Impact
        </button>

        <div id="weatherResults" style="display:none;margin-top:16px;"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function getAIWeatherAdvice() {
  const state     = document.getElementById('wState')?.value;
  const season    = document.getElementById('wSeason')?.value;
  const temp      = document.getElementById('wTemp')?.value || 'Seasonal';
  const condition = document.getElementById('wCondition')?.value;
  const btn       = document.getElementById('weatherAdviceBtn');
  const results   = document.getElementById('weatherResults');

  if (!state) { showToast('Select your state', 'warning', 'Weather Advisor'); return; }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Consulting Meteorological Models…';
  btn.disabled  = true;
  results.style.display = 'none';

  try {
    const data = await callAI('weather-advisor', { state, season, temperature: temp, condition });
    const w = data.weatherAdvice;
    results.style.display = 'block';
    results.innerHTML = `
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:14px;padding:16px;">
        <div style="font-weight:800;color:#0369a1;font-size:14px;margin-bottom:6px;"><i class="fas fa-info-circle"></i> ${w.summary || 'Weather Advisory'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;">
          <div style="background:#fff;padding:10px;border-radius:10px;border:1px solid #e0f2fe;">
            <div style="font-size:11px;color:#64748b;font-weight:600;">SOWING WINDOW</div>
            <div style="font-size:13px;font-weight:700;color:#0284c7;margin-top:2px;">${w.sowingWindow}</div>
          </div>
          <div style="background:#fff;padding:10px;border-radius:10px;border:1px solid #e0f2fe;">
            <div style="font-size:11px;color:#64748b;font-weight:600;">PEST RISK LEVEL</div>
            <div style="font-size:13px;font-weight:700;color:#e11d48;margin-top:2px;">${w.pestRisk}</div>
          </div>
        </div>
        <div style="background:#fff;padding:10px;border-radius:10px;border-left:4px solid #0284c7;font-size:12px;color:#334155;margin-bottom:10px;">
          <strong>💧 Irrigation Alert:</strong> ${w.irrigationAlert}
        </div>
        <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:6px;">Recommended Actions:</div>
        <ul style="margin:0;padding-left:18px;font-size:12px;color:#334155;line-height:1.6;">
          ${(w.actionItems || []).map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>`;
  } catch (err) {
    results.style.display = 'block';
    results.innerHTML = `<div style="color:#ef4444;font-size:13px;padding:10px;background:#fef2f2;border-radius:10px;">⚠️ ${err.message}</div>`;
  } finally {
    btn.innerHTML = '<i class="fas fa-meteor"></i> Analyze Weather Impact';
    btn.disabled  = false;
  }
}

/* ============================================================
   FEATURE 8 — AI QUALITY GRADER (Modal)
   ============================================================ */
function buildQualityGrader() {
  if (document.getElementById('qualityGraderModal')) return;
  const modal = document.createElement('div');
  modal.id    = 'qualityGraderModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
  modal.addEventListener('click', e => { if (e.target === modal) closeModal('qualityGraderModal'); });

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:92%;max-width:580px;max-height:90vh;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.2);display:flex;flex-direction:column;font-family:'Poppins',sans-serif;">
      <div style="background:linear-gradient(135deg,#eab308,#ca8a04);padding:20px 26px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div style="color:#fff;">
          <div style="font-size:18px;font-weight:800;"><i class="fas fa-award"></i> AI Produce Quality Grader</div>
          <div style="font-size:11px;opacity:0.9;margin-top:2px;">APMC / AGMARK standards evaluation</div>
        </div>
        <button onclick="closeModal('qualityGraderModal')" style="background:rgba(255,255,255,0.25);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:700;">✕</button>
      </div>

      <div style="padding:22px 26px;overflow-y:auto;flex:1;">
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px;">Describe your harvest condition to get an instant AI APMC quality grade &amp; pricing tier.</p>
        
        <div style="margin-bottom:12px;">
          <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Crop Name</label>
          <input id="qCrop" placeholder="e.g. Sharbati Wheat, Alphonso Mango, Red Tomatoes" style="width:100%;padding:10px;border:1.5px solid #fef08a;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
        </div>
        <div style="margin-bottom:12px;">
          <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Appearance / Color / Uniformity</label>
          <input id="qLook" placeholder="e.g. Bright red, uniform size, glossy skin" style="width:100%;padding:10px;border:1.5px solid #fef08a;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Moisture State</label>
            <select id="qMoisture" style="width:100%;padding:10px;border:1.5px solid #fef08a;border-radius:10px;font-size:13px;outline:none;background:#fefce8;">
              <option>Optimal &amp; Dry (&lt;12%)</option>
              <option>Moderate Fresh Moisture</option>
              <option>Slightly Wet / Needs Drying</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Blemishes / Defects</label>
            <select id="qDefects" style="width:100%;padding:10px;border:1.5px solid #fef08a;border-radius:10px;font-size:13px;outline:none;background:#fefce8;">
              <option>None (Flawless condition)</option>
              <option>Minor natural blemishes (&lt;5%)</option>
              <option>Moderate marks / mixed sizes</option>
            </select>
          </div>
        </div>

        <button onclick="getAIQualityGrade()" id="qualityGradeBtn"
          style="width:100%;padding:12px;background:linear-gradient(135deg,#eab308,#ca8a04);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 15px rgba(202,138,4,0.3);">
          <i class="fas fa-certificate"></i> Grade My Harvest
        </button>

        <div id="qualityResults" style="display:none;margin-top:16px;"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function getAIQualityGrade() {
  const cropName   = document.getElementById('qCrop')?.value?.trim();
  const appearance = document.getElementById('qLook')?.value?.trim();
  const moisture   = document.getElementById('qMoisture')?.value;
  const defects    = document.getElementById('qDefects')?.value;
  const btn        = document.getElementById('qualityGradeBtn');
  const results    = document.getElementById('qualityResults');

  if (!cropName) { showToast('Enter crop name', 'warning', 'Quality Grader'); return; }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running Vision &amp; APMC Audit…';
  btn.disabled  = true;
  results.style.display = 'none';

  try {
    const data = await callAI('quality-grade', { cropName, appearance, moisture, defects });
    const g = data.gradeData;
    const gradeColors = { 'Grade A': '#16a34a', 'Grade B': '#ca8a04', 'Grade C': '#dc2626' };
    const gradeBg     = { 'Grade A': '#f0fdf4', 'Grade B': '#fefce8', 'Grade C': '#fef2f2' };
    const col = gradeColors[g.grade] || '#16a34a';

    results.style.display = 'block';
    results.innerHTML = `
      <div style="background:${gradeBg[g.grade]||'#fefce8'};border:1.5px solid ${col};border-radius:14px;padding:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div>
            <span style="font-size:24px;font-weight:900;color:${col};">${g.grade}</span>
            <span style="font-size:12px;color:#6b7280;margin-left:8px;">Score: ${g.score}/100</span>
          </div>
          <span style="font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;background:${col}22;color:${col};">${g.marketTier}</span>
        </div>
        <p style="font-size:13px;color:#374151;margin:0 0 10px;">${g.assessment}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;margin-bottom:12px;">
          <div style="background:#fff;padding:8px;border-radius:8px;"><strong>Shelf Life:</strong> ~${g.shelfLifeDays} Days</div>
          <div style="background:#fff;padding:8px;border-radius:8px;"><strong>Buyer Appeal:</strong> ${g.buyerAppeal}</div>
        </div>
        <div style="font-size:12px;color:#4b5563;background:#fff;padding:8px 10px;border-radius:8px;">
          <strong>Storage Tip:</strong> ${g.storageAdvice}
        </div>
      </div>`;
  } catch (err) {
    results.style.display = 'block';
    results.innerHTML = `<div style="color:#ef4444;font-size:13px;padding:10px;background:#fef2f2;border-radius:10px;">⚠️ ${err.message}</div>`;
  } finally {
    btn.innerHTML = '<i class="fas fa-certificate"></i> Grade My Harvest';
    btn.disabled  = false;
  }
}

/* ============================================================
   FEATURE 9 — AI NEGOTIATION ASSISTANT (Modal)
   ============================================================ */
function buildNegotiateModal(productName = '', basePrice = 50) {
  let modal = document.getElementById('negotiateModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id    = 'negotiateModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', e => { if (e.target === modal) closeModal('negotiateModal'); });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:92%;max-width:560px;max-height:90vh;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.2);display:flex;flex-direction:column;font-family:'Poppins',sans-serif;">
      <div style="background:linear-gradient(135deg,#8b5cf6,#a855f7);padding:20px 26px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div style="color:#fff;">
          <div style="font-size:18px;font-weight:800;"><i class="fas fa-handshake"></i> AI Deal &amp; Bargain Coach</div>
          <div style="font-size:11px;opacity:0.9;margin-top:2px;">Fair market counter-offers for buyers &amp; farmers</div>
        </div>
        <button onclick="closeModal('negotiateModal')" style="background:rgba(255,255,255,0.25);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:700;">✕</button>
      </div>

      <div style="padding:22px 26px;overflow-y:auto;flex:1;">
        <div style="margin-bottom:12px;">
          <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Product</label>
          <input id="negProduct" value="${productName || 'Basmati Rice'}" style="width:100%;padding:10px;border:1.5px solid #ddd6fe;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Original Price (₹/kg)</label>
            <input id="negBase" type="number" value="${basePrice || 50}" style="width:100%;padding:10px;border:1.5px solid #ddd6fe;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Proposed Offer (₹/kg)</label>
            <input id="negOffer" type="number" placeholder="e.g. 42" style="width:100%;padding:10px;border:1.5px solid #ddd6fe;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Order Volume (kg)</label>
            <input id="negQty" type="number" value="100" style="width:100%;padding:10px;border:1.5px solid #ddd6fe;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">I am Negotiating As</label>
            <select id="negRole" style="width:100%;padding:10px;border:1.5px solid #ddd6fe;border-radius:10px;font-size:13px;outline:none;background:#f5f3ff;">
              <option value="farmer">Farmer (Selling Produce)</option>
              <option value="buyer">Buyer (Purchasing)</option>
            </select>
          </div>
        </div>

        <button onclick="getAINegotiationAdvice()" id="negBtn"
          style="width:100%;padding:12px;background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 15px rgba(139,92,246,0.3);">
          <i class="fas fa-balance-scale"></i> Calculate Fair Counter-Offer
        </button>

        <div id="negResults" style="display:none;margin-top:16px;"></div>
      </div>
    </div>`;
  openModal('negotiateModal');
}

async function getAINegotiationAdvice() {
  const product    = document.getElementById('negProduct')?.value?.trim();
  const basePrice  = document.getElementById('negBase')?.value;
  const buyerOffer = document.getElementById('negOffer')?.value;
  const quantity   = document.getElementById('negQty')?.value || '100';
  const role       = document.getElementById('negRole')?.value || 'farmer';
  const btn        = document.getElementById('negBtn');
  const results    = document.getElementById('negResults');

  if (!product || !basePrice || !buyerOffer) {
    showToast('Enter product and prices', 'warning', 'Negotiation Bot');
    return;
  }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Evaluating Mandi Margins…';
  btn.disabled  = true;
  results.style.display = 'none';

  try {
    const data = await callAI('negotiate', { product, basePrice, buyerOffer, quantity, role });
    const n = data.negotiation;
    results.style.display = 'block';
    results.innerHTML = `
      <div style="background:#f5f3ff;border:1.5px solid #c4b5fd;border-radius:14px;padding:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-weight:800;color:#6d28d9;font-size:14px;">Deal Verdict: ${n.verdict}</span>
          <span style="font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;background:#8b5cf622;color:#6d28d9;">${n.dealRecommendation}</span>
        </div>
        <div style="background:#fff;padding:12px;border-radius:10px;margin:8px 0;border-left:4px solid #8b5cf6;">
          <div style="font-size:11px;color:#6b7280;font-weight:600;">RECOMMENDED COUNTER PRICE</div>
          <div style="font-size:18px;font-weight:900;color:#6d28d9;">₹${n.counterPrice}/kg</div>
          <div style="font-size:12px;color:#374151;margin-top:4px;">${n.reasoning}</div>
        </div>
        <div style="margin-top:10px;">
          <div style="font-size:11px;font-weight:700;color:#6d28d9;margin-bottom:4px;">COPY-PASTE MESSAGE TO OTHER PARTY:</div>
          <div style="background:#fff;padding:10px;border-radius:8px;font-size:12px;color:#1e293b;border:1px dashed #a855f7;line-height:1.5;" id="negScript">
            ${n.counterScript}
          </div>
          <button onclick="navigator.clipboard.writeText(document.getElementById('negScript').innerText);showToast('Negotiation message copied!','success','Copied 📋');"
            style="margin-top:8px;padding:6px 14px;background:#8b5cf6;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">
            <i class="fas fa-copy"></i> Copy Message
          </button>
        </div>
      </div>`;
  } catch (err) {
    results.style.display = 'block';
    results.innerHTML = `<div style="color:#ef4444;font-size:13px;padding:10px;background:#fef2f2;border-radius:10px;">⚠️ ${err.message}</div>`;
  } finally {
    btn.innerHTML = '<i class="fas fa-balance-scale"></i> Calculate Fair Counter-Offer';
    btn.disabled  = false;
  }
}

/* ============================================================
   FEATURE 10 — AI SOIL HEALTH & NPK ANALYZER (Modal)
   ============================================================ */
function buildSoilAnalyzer() {
  if (document.getElementById('soilAnalyzerModal')) return;
  const modal = document.createElement('div');
  modal.id    = 'soilAnalyzerModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
  modal.addEventListener('click', e => { if (e.target === modal) closeModal('soilAnalyzerModal'); });

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:92%;max-width:620px;max-height:90vh;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.2);display:flex;flex-direction:column;font-family:'Poppins',sans-serif;">
      <div style="background:linear-gradient(135deg,#059669,#10b981);padding:20px 26px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div style="color:#fff;">
          <div style="font-size:18px;font-weight:800;"><i class="fas fa-vial"></i> AI Soil Health &amp; NPK Analyzer</div>
          <div style="font-size:11px;opacity:0.9;margin-top:2px;">Nutrient balance, pH correction &amp; organic remedies</div>
        </div>
        <button onclick="closeModal('soilAnalyzerModal')" style="background:rgba(255,255,255,0.25);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:700;">✕</button>
      </div>

      <div style="padding:22px 26px;overflow-y:auto;flex:1;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Soil Type</label>
            <select id="sSoil" style="width:100%;padding:10px;border:1.5px solid #a7f3d0;border-radius:10px;font-size:13px;outline:none;background:#ecfdf5;">
              <option>Alluvial Soil</option>
              <option>Black (Regur) Soil</option>
              <option>Red &amp; Yellow Soil</option>
              <option>Laterite Soil</option>
              <option>Sandy / Coastal Soil</option>
              <option>Clay Loam Soil</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Soil pH (Approx)</label>
            <input id="sPh" placeholder="e.g. 6.2 (Acidic) or 7.0 (Neutral)" style="width:100%;padding:10px;border:1.5px solid #a7f3d0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Target Crop Planned</label>
            <input id="sCrop" placeholder="e.g. Wheat, Sugarcane, Cotton" style="width:100%;padding:10px;border:1.5px solid #a7f3d0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Region</label>
            <input id="sRegion" placeholder="e.g. Punjab, Maharashtra" style="width:100%;padding:10px;border:1.5px solid #a7f3d0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;"/>
          </div>
        </div>

        <button onclick="getAISoilAnalysis()" id="soilBtn"
          style="width:100%;padding:12px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 15px rgba(5,150,105,0.3);">
          <i class="fas fa-flask"></i> Generate Soil Health &amp; Fertilizer Plan
        </button>

        <div id="soilResults" style="display:none;margin-top:16px;"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function getAISoilAnalysis() {
  const soilType   = document.getElementById('sSoil')?.value;
  const ph         = document.getElementById('sPh')?.value || '6.5';
  const targetCrop = document.getElementById('sCrop')?.value || 'General';
  const region     = document.getElementById('sRegion')?.value || 'India';
  const btn        = document.getElementById('soilBtn');
  const results    = document.getElementById('soilResults');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running Soil Chemistry Analysis…';
  btn.disabled  = true;
  results.style.display = 'none';

  try {
    const data = await callAI('soil-analyzer', { soilType, ph, targetCrop, region });
    const s = data.soilAnalysis;
    results.style.display = 'block';
    results.innerHTML = `
      <div style="background:#ecfdf5;border:1.5px solid #a7f3d0;border-radius:14px;padding:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-weight:800;color:#065f46;font-size:14px;"><i class="fas fa-check-circle"></i> Status: ${s.soilStatus}</span>
          <span style="font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;background:#05966922;color:#065f46;">Yield Potential: ${s.yieldPotential}</span>
        </div>
        <p style="font-size:12px;color:#374151;margin:0 0 10px;">${s.phAssessment}</p>
        <div style="background:#fff;padding:12px;border-radius:10px;margin-bottom:10px;border-left:4px solid #059669;">
          <div style="font-size:11px;font-weight:700;color:#065f46;">FERTILIZER &amp; NPK DOSAGE:</div>
          <div style="font-size:13px;color:#1e293b;margin-top:2px;">${s.fertilizerPlan}</div>
        </div>
        <div style="background:#fff;padding:10px;border-radius:10px;margin-bottom:8px;">
          <div style="font-size:11px;font-weight:700;color:#059669;margin-bottom:4px;">ORGANIC REMEDIES &amp; COMPOST:</div>
          <ul style="margin:0;padding-left:18px;font-size:12px;color:#334155;line-height:1.5;">
            ${(s.organicRemedies || []).map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      </div>`;
  } catch (err) {
    results.style.display = 'block';
    results.innerHTML = `<div style="color:#ef4444;font-size:13px;padding:10px;background:#fef2f2;border-radius:10px;">⚠️ ${err.message}</div>`;
  } finally {
    btn.innerHTML = '<i class="fas fa-flask"></i> Generate Soil Health &amp; Fertilizer Plan';
    btn.disabled  = false;
  }
}

/* ============================================================
   NAVBAR & FLOATING AI SUITE LAUNCHER
   ============================================================ */
function addAISuiteLauncher() {
  const navList = document.querySelector('.nav-links ul, nav ul');
  if (navList && !document.getElementById('aiSuiteNavBtn')) {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="position:relative;display:inline-block;">
        <button id="aiSuiteNavBtn" onclick="toggleAISuiteDropdown()"
          style="background:none;border:none;color:#16a34a;font-weight:700;font-size:0.83rem;font-family:'Poppins',sans-serif;display:flex;align-items:center;gap:4px;cursor:pointer;padding:4px 8px;border-radius:20px;transition:background 0.2s;white-space:nowrap;">
          <i class="fas fa-brain"></i> AI Suite <i class="fas fa-chevron-down" style="font-size:9px;"></i>
        </button>
        <div id="aiSuiteDropdown" style="display:none;position:absolute;top:110%;left:0;background:#fff;border-radius:14px;box-shadow:0 15px 40px rgba(0,0,0,0.15);border:1px solid #d1fae5;min-width:230px;padding:8px;z-index:9000;font-family:'Poppins',sans-serif;">
          <div onclick="openModal('cropAdvisorModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
            <i class="fas fa-seedling" style="color:#16a34a;width:16px;"></i> 🌾 Crop Advisor
          </div>
          <div onclick="openModal('weatherAdvisorModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
            <i class="fas fa-cloud-sun-rain" style="color:#0284c7;width:16px;"></i> 🌤️ Weather Advisor
          </div>
          <div onclick="openModal('qualityGraderModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
            <i class="fas fa-award" style="color:#ca8a04;width:16px;"></i> 🔍 Quality Grader
          </div>
          <div onclick="openModal('soilAnalyzerModal');toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
            <i class="fas fa-vial" style="color:#059669;width:16px;"></i> 🧪 Soil Health NPK
          </div>
          <div onclick="buildNegotiateModal();toggleAISuiteDropdown();" style="padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;color:#374151;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
            <i class="fas fa-handshake" style="color:#8b5cf6;width:16px;"></i> 🤝 Bargain Coach
          </div>
        </div>
      </div>`;
    navList.appendChild(li);
  }
}

function toggleAISuiteDropdown() {
  const dd = document.getElementById('aiSuiteDropdown');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('click', e => {
  const dd = document.getElementById('aiSuiteDropdown');
  if (dd && !e.target.closest('#aiSuiteNavBtn') && !e.target.closest('#aiSuiteDropdown')) dd.style.display = 'none';
});

/* ============================================================
   PATCH openFarmerDash to inject AI tools after it renders
   ============================================================ */
function patchFarmerDash() {
  const orig = window.openFarmerDash;
  if (!orig || orig._aiPatched) return;

  window.openFarmerDash = async function(...args) {
    await orig.apply(this, args);
    setTimeout(() => {
      injectAIIntoProductForm();
      injectDemandForecast();
    }, 600);
  };
  window.openFarmerDash._aiPatched = true;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildChatbot();
  buildCropAdvisor();
  buildWeatherAdvisor();
  buildQualityGrader();
  buildSoilAnalyzer();
  setTimeout(addAISuiteLauncher,  400);
  setTimeout(patchFarmerDash,     500);
  setTimeout(patchSmartSearch,   1200);
});

/* Global exposure for inline onclick handlers */
window.toggleChatbot        = toggleChatbot;
window.sendChat             = sendChat;
window.aiSuggestPrice       = aiSuggestPrice;
window.aiWriteDescription   = aiWriteDescription;
window.getAICropAdvice      = getAICropAdvice;
window.loadAIDemandForecast = loadAIDemandForecast;
window.getAIWeatherAdvice   = getAIWeatherAdvice;
window.getAIQualityGrade    = getAIQualityGrade;
window.buildNegotiateModal  = buildNegotiateModal;
window.getAINegotiationAdvice = getAINegotiationAdvice;
window.getAISoilAnalysis    = getAISoilAnalysis;
window.toggleAISuiteDropdown = toggleAISuiteDropdown;