// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// import { getFirestore, collection, getDocs, query, orderBy, doc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, doc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDS8-Ib0xnVu9VLCVIpF6k-wENk9Kmvmbg",
  authDomain: "olim-jadashim.firebaseapp.com",
  projectId: "olim-jadashim",
  storageBucket: "olim-jadashim.firebasestorage.app",
  messagingSenderId: "796480619416",
  appId: "1:796480619416:web:867b9cfc4a678a68db21ed"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let userName = "Olim";
let currentLang = 'en';

const dict = {
    en: { title: "Aliyah Dashboard", chat: "AI Assistant", btn: "Complete", done: "✅", hello: "Hello", default: "I can help you with all 7 steps of your Aliyah! Ask about ID, Banks, Health, Sal Klita, Ulpan, License, or Arnona." },
    es: { title: "Panel de Aliyah", chat: "Asistente IA", btn: "Completar", done: "✅", hello: "Hola", default: "¡Puedo ayudarte con los 7 pasos de tu Aliyah! Pregunta sobre el DNI, Bancos, Salud, Sal Klita, Ulpan, Licencia o Arnona." },
    he: { title: "לוח בקרה עלייה", chat: "עוזר בינה מלאכותית", btn: "סיום", done: "✅", hello: "שלום", default: "אני יכול לעזור עם כל 7 השלבים! שאל על תעודת זהות, בנקים, קופות חולים, סל קליטה, אולפן, רישיון או ארנונה." },
    ru: { title: "Панель репатриации", chat: "ИИ Помощник", btn: "Готово", done: "✅", hello: "Привет", default: "Я помогу вам со всеми 7 шагами! Спросите про ID, банки, кассы, корзину, ульпан, права или арнону." }
};

const knowledge = {
    id: { keys: ["teudat", "zeut", "id", "dni", "identidad", "passport", "pasaporte", "תעודת", "זהות", "паспорт"], en: "Your Teudat Zeut (ID) is issued at the Ministry of Interior (Misrad HaPnim). Book your appointment through the MyVisit app.", es: "Tu Teudat Zeut se tramita en el Ministerio del Interior (Misrad HaPnim). Pide tu cita en la app MyVisit.", he: "תעודת הזהות שלך מונפקת במשרד הפנים. קבע תור באפליקציית MyVisit.", ru: "Ваш Теудат Зеут выдается в Министерстве внутренних дел. Запишитесь через MyVisit." },
    bank: { keys: ["bank", "banco", "account", "cuenta", "בנק", "חשבון", "банк", "счет"], en: "To open a bank account, bring your Teudat Zeut and Teudat Oleh. Banks like Leumi or Hapoalim offer special benefits for Olim.", es: "Para abrir la cuenta, lleva tu Teudat Zeut y Teudat Oleh. Bancos como Leumi o Hapoalim tienen beneficios para Olim.", he: "כדי לפתוח חשבון בנק, הבא תעודת זהות ותעודת עולה. בנקים כמו לאומי או הפועלים מציעים הטבות לעולים.", ru: "Для открытия счета возьмите Теудат Зеут и Теудат Оле. Банки Леуми или Апоалим предлагают льготы." },
    health: { keys: ["health", "salud", "insurance", "seguro", "kupat", "holim", "clalit", "maccabi", "קופת", "חולים", "врач", "касса"], en: "Register for a health fund (Kupat Holim) like Maccabi or Clalit. You can do this at the post office or online.", es: "Regístrate en una caja de salud (Kupat Holim) como Maccabi o Clalit. Se hace en el correo o por internet.", he: "הירשם לקופת חולים כמו מכבי או כללית. ניתן לעשות זאת בדואר או באינטרנט.", ru: "Зарегистрируйтесь в кассе здравоохранения (Maccabi, Clalit) на почте или онлайн." },
    sal: { keys: ["sal", "klita", "money", "dinero", "grant", "ayuda", "סל", "קליטה", "כסף", "корзин", "деньги"], en: "Sal Klita is your financial aid. It's paid in 6 monthly installments. Make sure Misrad HaKlita has your bank details.", es: "El Sal Klita es tu ayuda económica. Se paga en 6 cuotas mensuales. Asegúrate de dar tu cuenta a Misrad HaKlita.", he: "סל קליטה הוא הסיוע הכספי שלך. הוא משולם ב-6 תשלומים חודשיים. וודא שלמשרד הקליטה יש את פרטי הבנק שלך.", ru: "Корзина абсорбции — это финансовая помощь в течение 6 месяцев. Проверьте банковские данные в Мисрад аклита." },
    ulpan: { keys: ["ulpan", "hebrew", "hebreo", "ivrit", "language", "idioma", "אולפן", "עברית", "ульпан", "язык"], en: "Ulpan is where you learn Hebrew. You get a voucher for a free course during your first 18 months in Israel.", es: "El Ulpan es para aprender hebreo. Tienes un voucher para un curso gratis durante tus primeros 18 meses.", he: "אולפן הוא המקום ללמוד עברית. מגיע לך שובר לקורס חינם במהלך 18 החודשים הראשונים שלך.", ru: "Ульпан — это изучение иврита. Вы получаете ваучер на бесплатный курс в первые 18 месяцев." },
    license: { keys: ["license", "driver", "licencia", "conducir", "car", "auto", "רישיון", "נהיגה", "права", "машин"], en: "You can convert your foreign driver's license within one year of Aliyah. You'll need an eye test and a simple driving test.", es: "Puedes convertir tu licencia de conducir extranjera durante el primer año. Necesitas un examen de vista y una prueba simple.", he: "ניתן להמיר רישיון נהיגה זר תוך שנה מהעלייה. תצטרך בדיקת עיניים ומבחן נהיגה פשוט.", ru: "Вы можете подтвердить свои права в течение года. Вам потребуется проверка зрения и упрощенный тест." },
    arnona: { keys: ["arnona", "tax", "discount", "descuento", "house", "casa", "ארנונה", "הנחה", "בית", "арнона", "скидка", "дом"], en: "Olim are entitled to a 90% discount on Arnona (property tax) for up to 100sqm during their first year.", es: "Los Olim tienen un 90% de descuento en la Arnona (impuesto de vivienda) hasta 100m2 durante el primer año.", he: "עולים זכאים להנחה של 90% בארנונה (עד 100 מ''ר) במהלך השנה הראשונה.", ru: "Репатрианты имеют право на скидку 90% на арнону (налог на жилье) до 100 кв.м. в первый год." }
};

window.changeLang = (lang) => {
    currentLang = lang;
    document.getElementById('main-title').textContent = dict[lang].title;
    document.getElementById('chat-header').textContent = dict[lang].chat;
    loadApp();
    loadShoppingList();
};

document.getElementById('start-btn').onclick = () => {
    userName = document.getElementById('user-name-input').value.trim() || "Olim";
    document.getElementById('login-modal').style.display = 'none';
    loadApp();
    loadShoppingList();
};

document.getElementById('send-btn').onclick = handleChat;

function handleChat() {
    const input = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const text = input.value.toLowerCase();
    if(!text.trim()) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'user-bubble';
    userDiv.textContent = input.value;
    chatWindow.appendChild(userDiv);

    const aiDiv = document.createElement('div');
    aiDiv.className = 'ai-bubble';
    
    let resp = dict[currentLang].default;
    for (const category in knowledge) {
        if (knowledge[category].keys.some(key => text.includes(key))) {
            resp = knowledge[category][currentLang];
            break;
        }
    }

    aiDiv.textContent = `AI Advisor: ${resp}`;
    chatWindow.appendChild(aiDiv);
    input.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function loadApp() {
    const container = document.getElementById('task-container');
    const bar = document.getElementById('progress-bar');
    const adv = document.getElementById('ai-advisor');
    if(!container) return;
    container.innerHTML = '';

    try {
        const q = query(collection(db, "tasks"), orderBy("step_number"));
        const snap = await getDocs(q);
        let doneCount = 0;
        let prevCompleted = true;

        snap.forEach(docSnap => {
            const t = docSnap.data();
            const id = docSnap.id;
            
            // LOGICA LOCAL: Revisar si este usuario específico marcó esta tarea en SU navegador
            const storageKey = `completed_${id}_${userName}`;
            const isCompletedLocal = localStorage.getItem(storageKey) === 'true';

            if(isCompletedLocal) doneCount++;

            const item = document.createElement('div');
            item.className = 'task-item';
            const isLocked = !prevCompleted;
            const buttonLabel = isCompletedLocal ? dict[currentLang].done : dict[currentLang].btn;

            item.innerHTML = `<span>${t.step_number}. ${t.name}</span><button id="btn-${id}" ${isLocked ? 'disabled' : ''}>${buttonLabel}</button>`;
            container.appendChild(item);

            document.getElementById(`btn-${id}`).onclick = () => {
                // Alternar el estado solo en el navegador del usuario
                localStorage.setItem(storageKey, !isCompletedLocal);
                loadApp();
            };
            
            prevCompleted = isCompletedLocal;
        });

        const progressPercent = snap.size > 0 ? (doneCount / snap.size) * 100 : 0;
        bar.style.width = `${progressPercent}%`;
        adv.textContent = `AI Advisor: ${dict[currentLang].hello} ${userName}!`;
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// La Shopping List sigue siendo global para compartir cosas si quieren, o puedes aplicar la misma lógica si prefieres que sea privada
async function loadShoppingList() {
    const container = document.getElementById('shop-list-container');
    if(!container) return;
    container.innerHTML = '';
    try {
        const q = query(collection(db, "shopping"), orderBy("name"));
        const snap = await getDocs(q);
        snap.forEach(docSnap => {
            const item = docSnap.data();
            const id = docSnap.id;
            const div = document.createElement('div');
            div.className = 'task-item'; 
            div.innerHTML = `<span>${item.name}</span><button id="del-${id}" style="background: #ff4d4d; padding: 5px 15px; color: white; border: none; border-radius: 5px; cursor: pointer;">X</button>`;
            container.appendChild(div);
            document.getElementById(`del-${id}`).onclick = async () => {
                await deleteDoc(doc(db, "shopping", id));
                loadShoppingList();
            };
        });
    } catch (e) { console.error(e); }
}

if(document.getElementById('add-shop-btn')) {
    document.getElementById('add-shop-btn').onclick = async () => {
        const input = document.getElementById('shop-input');
        const name = input.value.trim();
        if (name) {
            await addDoc(collection(db, "shopping"), { name: name, created_at: Date.now() });
            input.value = '';
            loadShoppingList();
        }
    };
}
