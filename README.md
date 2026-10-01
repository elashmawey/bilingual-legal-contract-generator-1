# Bilingual Legal Contract Generator (منشئ العقود القانونية الثنائي)

تطبيق متقدم ومحكم لصياغة وهندسة العقود القانونية الثنائية (عربي - إنجليزي) بالاستناد إلى أحكام القانون المدني والتجاري المصري، أحكام محكمة النقض، ونماذج الشهر العقاري والتوثيق، مع تدقيق شرعي وقضائي فوري مدعوم بالذكاء الاصطناعي (Google Gemini).

---

## 🚀 النشر على موقع Vercel (Deployment to Vercel)

تم تجهيز هذا المشروع بالكامل ليعمل بسلاسة فائقة كـ Serverless Application على منصة **Vercel**.

### الخطوة 1: رفع المشروع إلى مستودع GitHub
1. تأكد من تهيئة مستودع Git ورفع ملفات المشروع (تلقائياً مستثنى منها ملفات `.env` والمفاتيح الحساسة):
   ```bash
   git init
   git add .
   git commit -m "feat: Prepare bilingual contract generator for Vercel deployment"
   git branch -M main
   git remote add origin <رابط-المستودع-الخاص-بك>
   git push -u origin main
   ```

### الخطوة 2: ربط المشروع على Vercel
1. توجّه إلى لوحة تحكم [Vercel Dashboard](https://vercel.com/dashboard).
2. اضغط على **"Add New..."** ثم اختر **"Project"**.
3. قم باستيراد مستودع GitHub الخاص بك (**Import**).
4. ستتعرف Vercel تلقائياً على إعدادات المشروع عبر ملف `vercel.json`:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### الخطوة 3: إضافة المتغيرات البيئية (Environment Variables) ⚠️ **خطوة هامة جداً**
قبل الضغط على Deploy، في قسم **Environment Variables**:
- أضف المتغير التالي:
  - **Key (الاسم):** `GEMINI_API_KEY`
  - **Value (القيمة):** مفتاح الـ API الخاص بك من [Google AI Studio](https://aistudio.google.com/).
- *(اختياري)* يمكنك تحديد موديل معين عبر:
  - **Key:** `GEMINI_MODEL`
  - **Value:** `gemini-2.5-flash` أو `gemini-2.0-flash`

### الخطوة 4: النشر (Deploy)
1. اضغط على زر **"Deploy"**.
2. خلال ثوانٍ معدودة سيكتمل البناء ويصبح موقعك جاهزاً ويعمل برابط عام مباشر ومؤمن بشهادة SSL (https).

---

## 🛠️ كيفية العمل المعماري على Vercel (Architecture Overview)

- **الواجهة الأمامية (Frontend):** مبنية بـ React 19 و Vite ومجهزة بأحدث معايير الأداء والـ Print CSS والتصدير لـ DOCX و PDF.
- **الخلفية (Backend Serverless):** دالة خادومية مستقلة تعمل في المسار `api/generate-contract.ts` بنظام Vercel Serverless Functions مع وقت استجابة ممتد يصل إلى `60s` عبر `vercel.json` لضمان توليد عقود قانونية كاملة (14-22 مادة) دون أي انقطاع للاتصال (Timeout).
- **التشغيل المحلي (Local Development):** ما زال بإمكانك تشغيل المشروع محلياً بكامل مزاياه وبنفس محرك الذكاء الاصطناعي المشترك.

---

## 💻 التشغيل محلياً (Run Locally)

1. **تثبيت الحزم:**
   ```bash
   npm install
   ```

2. **ضبط ملف المفاتيح:**
   - انسخ ملف `.env.example` إلى `.env`:
     ```bash
     cp .env.example .env
     ```
   - ضع مفتاح `GEMINI_API_KEY` داخل ملف `.env`.
   - رمز المالك `OWNER_ACCESS_CODE` سر خادمي فقط. عيّن قيمة عشوائية جديدة في Vercel، ولا تستخدم أي رموز نُشرت سابقاً في الشيفرة.

3. **تشغيل بيئة التطوير:**
   ```bash
   npm run dev
   ```
   سيفتح التطبيق على الرابط: `http://localhost:3000`

---

## 📋 الأوامر المتاحة (Available Scripts)

- `npm run dev`: تشغيل خادم التطوير المحلي.
- `npm run build`: بناء ملفات الإنتاج إلى مجلد `dist`.
- `npm run lint`: فحص أنواع TypeScript والتحقق من سلامة الأكواد.
- `npm run preview`: معاينة البناء النهائي محلياً.
