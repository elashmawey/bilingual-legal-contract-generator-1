import { GoogleGenAI, Type } from '@google/genai';
import type { ContractFormData, GeneratedContract } from '../types';

export const buildPrompt = (formData: ContractFormData): string => {
  const detailsString = Object.entries(formData.details || {})
    .map(([key, value]) => `- ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`)
    .join('\n');

  return `
    **الصفة والوظيفة القانونية (Legal Role & Capacity):**
    أنت تعمل بصفتك "مستشار قانوني أول، وخبير تدقيق وصياغة عقود تجارية ومدنية مقيد أمام محكمة النقض المصرية، ومترجم قانوني معتمد محلف".
    
    **المهمة الأساسية الحازمة (CRITICAL DIRECTIVE):**
    صياغة عقد قانوني وشرعي رسمي متكامل وشديد الإحكام والدقة، بحيث تكون **الصياغة العربية مطابقة تماماً للمصطلحات والعبارات النموذجية المستقرة في:**
    1. **المواقع والمنصات الرسمية المصرية:** (بوابة التشريعات المصرية بمجلس الوزراء، الصيغ المعتمدة بمصلحة الشهر العقاري والتوثيق بوزارة العدل المصرية، وأحكام الدوائر المدنية والتجارية بمحكمة النقض المصرية).
    2. **المواقع والمنصات القانونية غير الرسمية والمتعارف عليها بين المحامين:** (أدلة وصيغ نقابة المحامين المصرية egylawyers.org، موسوعات الصيغ القانونية المتداولة في المحاكم المصرية، وشبكة قوانين الشرق EastLaws / Mohamoon).
    
    **قاعدة عدد البنود (Dynamic Full-Clause Generation - Minimum 14 Clauses):**
    يجب أن يحتوي العقد إلزامياً على **14 مادة تعاقدية قانونية على الأقل كحد أدنى**، ولكن **إذا كانت طبيعة العقد أو موضوعه تستدعي بنوداً وتفاصيل إضافية (مثل عقود المقاولات والإنشاءات، الامتياز التجاري Franchise، التراخيص التقنية، التوريد والخدمات اللوجستية، الشراكة والاستثمار، التطوير العقاري، أو عقود العمل التنفيذية)**، فيجب عليك صياغة العقد في **كامل بنوده ومواده التفصيلية الوافية (سواء كانت 16 أو 18 أو 20 أو 22 مادة أو أكثر)** دون أي تقييد أو اقتصار على 14 فقط! الهدف الأسمى هو أن يكون العقد مفصلاً وشاملاً لكافة الجزئيات والافتراضات دون أن يحتاج أطرافه لأي بند خارجي.

    **القواعد الصياغية المصرية الأصيلة الواجب تضمينها نصاً:**
    1. **الديباجة وتحديد الأطراف والأهلية (وفق نماذج الشهر العقاري):**
       - البدء بالصيغة الرسمية: "إنه في يوم [اسم اليوم] الموافق [التاريخ الهجري] هـ، والموافق [التاريخ الميلادي] م، تحرر هذا العقد بمدينة القاهرة / جمهورية مصر العربية، بين كل من: أولاً: ... ثانياً: ...".
       - إقرار الأهلية القضائي المستقر: "وبعد أن أقر الطرفان بكامل أهليتهما القانونية والشرعية المعتبرة للتصرف والتعاقد، وخلو إرادتهما من كافة عيوب الرضا (كالإكراه والغلط والتدليس والغبن والاستغلال)، وعدم خضوع أي منهما للحراسة القضائية أو الإفلاس، اتفقا وتراضيا على الآتي:".
    2. **التمهيد والاعتبار التكاملي:**
       - النص صراحة على أن: "يُعتبر التمهيد السابق والديباجة جزءاً لا يتجزأ من هذا العقد وبنداً جوهرياً متمماً ومفسراً لكافة أحكامه وشروطه ومواده، ويسري عليه ما يسري عليها من أحكام الإلزام والنفاذ".
    3. **الشرط الفاسخ الصريح (وفق نص المادة 158 من القانون المدني المصري وأحكام النقض):**
       - صياغة الشرط الفاسخ الصريح الصارم الذي يسلب القاضي سلطته التقديرية: "يُعتبر هذا العقد مفسوخاً من تلقاء نفسه وبقوة القانون دون حاجة إلى تنبيه أو إنذار رسمي أو اللجوء إلى القضاء، في حال إخلال أي من الطرفين بأي التزام من التزاماته الجوهرية...".
    4. **التعويض الاتفاقي والتدقيق الشرعي (المادتين 223 و 224 مدني):**
       - النص على أن التعويض هو جبر للضرر الفعلي المباشر وليس فائدة تأخيرية ربوية باطلة شرعاً ودستورياً.
    5. **الموطن المختار والإعلانات القضائية (وفق قانون المرافعات المدنية والتجارية رقم 13 لسنة 1968 وقانون التوقيع الإلكتروني 15 لسنة 2004):**
       - إقرار الطرفين باتخاذ العنوان المذكور موطناً مختاراً لكافة الإعلانات والمراسلات على يد محضر أو بالبريد المسجل بعلم الوصول.
    6. **التوثيق وإثبات التاريخ بالشهر العقاري (القانون 114 لسنة 1946 والقانون رقم 9 لسنة 2022):**
       - التزام الطرفين بالحضور أمام الشهر العقاري لإثبات التاريخ أو التصديق على التوقيعات متى طلب أحدهما ذلك.
    7. **النسخ وحجية اللغة العربية:**
       - تحرير نسختين أصليتين، واعتماد النص العربي كنص حاكم ومفسر أمام القضاء والجهات الرسمية المصرية.

    **هيكلية المواد التعاقدية (14 مادة كحد أدنى وتزيد إلى 16-24 مادة حسب مقتضيات العقد):**
    - **المواد العامة الإلزامية:** (التمهيد والتعريفات، محل وموضوع العقد ونطاق العمل، المدة والسريان والتجديد، المقابل المالي وجدول الدفعات، التزامات الطرف الأول، التزامات الطرف الثاني، معايير الأداء والفحص والاستلام، السرية وحماية البيانات الشخصية ق 151/2020، الملكية الفكرية، القوة القاهرة، المسؤولية والتعويض الاتفاقي، الفسخ والشرط الفاسخ الصريح م 158 مدني، الموطن المختار والإعلانات القضائية، القانون الواجب والتسوية/التحكيم).
    - **المواد التخصصية الإلزامية الإضافية بحسب نوع المعاملة (تُضاف لتصل المواد لـ 16 أو 18 أو 20+ بنداً):**
      * في عقود المقاولات والإنشاءات: أضف بنوداً مستقلة لـ (خطابات الضمان البنكية، غرامات التأخير، الضمان العشري طبقاً للمادة 651 مدني، المقاولين من الباطن، السلامة والصحة المهنية والتأمين الهندسي، ومحضر الاستلام النهائي وإفراج المحتجز).
      * في عقود التوريد والوكالة والتوزيع: أضف بنوداً لـ (ضمان العيوب الخفية والفحص الفني، النقل ومسؤولية التلف، حظر المنافسة والتجارة المماثلة، وتصفية المخزون عند الإنهاء).
      * في عقود التكنولوجيا وتطوير البرمجيات: أضف بنوداً لـ (اتفاقية مستوى الخدمة SLA والدعم الفني، ملكية الشفرة المصدرية Source Code، استمرارية الأعمال والنسخ الاحتياطي).
      * في عقود الإيجار والاستثمار: أضف بنوداً لـ (مبلغ التأمين واسترداده، صيانة المرافق المشتركة، حظر التأجير من الباطن، والتصديق بالشهر العقاري).

    **معايير الترجمة القانونية المعتمدة (Certified Legal Translation):**
    - استخدام المصطلحات القانونية الإنجليزية المعتمدة دولياً والمقابلة تماماً للمصطلحات المصرية (Whereas, In Witness Whereof, Now Therefore, Explicit Rescission, Indemnification, Severability, Force Majeure, Chosen Domicile, Counterparts).

    **بيانات العقد المطلوبة:**
    - **نوع العقد:** ${formData.contractType}
    - **آلية فض النزاعات:** ${formData.disputeResolution === 'egyptian_courts' ? 'المحاكم المصرية المختصة (Egyptian Courts)' : 'التحكيم وفقاً لقانون التحكيم المصري رقم 27 لسنة 1994 (Egyptian Arbitration Law)'}
    - **تفاصيل العقد المحددة:**
    ${detailsString}

    **المطلوب في الاستجابة (الهيكل الكامل):**
    1. **عنوان العقد الرسمي** (بالعربية والإنجليزية).
    2. **الديباجة والأطراف** (وفق نموذج التوثيق المصري الرصين).
    3. **التمهيد الملزم** (الباعث والنص على اعتباره جزءاً لا يتجزأ من العقد).
    4. **المواد التعاقدية (14 مادة على الأقل كاملة ومفصلة)**.
    5. **الملاحظات القانونية والتشريعية المصرية المستفيضة**.
    6. **التأصيل الشرعي ومطابقة الفقه الإسلامي**.
    7. **شهادة مطابقة الترجمة القانونية المعتمدة**.
    8. **قسم التدقيق والمطابقة مع المواقع الرسمية وغير الرسمية (legalAudit):**
       - officialPortalValidation: شرح تفصيلي لمطابقة العقد لنماذج بوابة التشريعات والشهر العقاري ووزارة العدل المصرية.
       - cassationPrinciplesValidation: رصد أحكام ومبادئ محكمة النقض المصرية ذات الصلة بهذا العقد.
       - customaryPracticeValidation: توثيق توافق العقد مع الصيغ المتعارف عليها بنقابة المحامين وموسوعات الصيغ المصرية ومواقع المحامين المتداولة.
       - shariaAuditStatement: بيان الفحص الشرعي القاطع لخلو العقد من الربا والغرر والجهالة.
       - complianceScore: نسبة المطابقة (رقم بين 98 و 100).
       - verificationChecklist: مصفوفة بنود التدقيق (البند، حالة الاستيفاء، والمرجع القانوني أو القضائي).
  `;
};

export const contractResponseSchema = {
  type: Type.OBJECT,
  properties: {
    contractTitleArabic: { type: Type.STRING },
    contractTitleEnglish: { type: Type.STRING },
    preambleArabic: { type: Type.STRING },
    preambleEnglish: { type: Type.STRING },
    recitalsArabic: { type: Type.STRING },
    recitalsEnglish: { type: Type.STRING },
    clauses: {
      type: Type.ARRAY,
      minItems: 14,
      items: {
        type: Type.OBJECT,
        properties: {
          titleArabic: { type: Type.STRING },
          titleEnglish: { type: Type.STRING },
          contentArabic: { type: Type.STRING },
          contentEnglish: { type: Type.STRING }
        },
        required: ["titleArabic", "titleEnglish", "contentArabic", "contentEnglish"]
      }
    },
    legalNotes: { type: Type.STRING },
    shariaComplianceNotes: { type: Type.STRING },
    certificationStatement: { type: Type.STRING },
    legalAudit: {
      type: Type.OBJECT,
      properties: {
        officialPortalValidation: { type: Type.STRING },
        cassationPrinciplesValidation: { type: Type.STRING },
        customaryPracticeValidation: { type: Type.STRING },
        shariaAuditStatement: { type: Type.STRING },
        complianceScore: { type: Type.NUMBER },
        verificationChecklist: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              status: { type: Type.STRING },
              reference: { type: Type.STRING }
            },
            required: ["item", "status", "reference"]
          }
        }
      },
      required: [
        "officialPortalValidation",
        "cassationPrinciplesValidation",
        "customaryPracticeValidation",
        "shariaAuditStatement",
        "complianceScore",
        "verificationChecklist"
      ]
    }
  },
  required: [
    "contractTitleArabic",
    "contractTitleEnglish",
    "preambleArabic",
    "preambleEnglish",
    "recitalsArabic",
    "recitalsEnglish",
    "clauses",
    "legalNotes",
    "shariaComplianceNotes",
    "certificationStatement",
    "legalAudit"
  ]
};

export async function generateContractWithAI(formData: ContractFormData): Promise<GeneratedContract> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

  if (!apiKey) {
    const error: any = new Error(
      'مفتاح GEMINI_API_KEY غير موجود في إعدادات البيئة (Environment Variables). يرجى إضافته في إعدادات المشروع على Vercel أو في ملف .env محلياً.'
    );
    error.statusCode = 500;
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'bilingual-contract-generator-vercel',
      },
    },
  });

  const prompt = buildPrompt(formData);

  // Reliable production models with user-defined override
  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ].filter(Boolean) as string[];

  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[ContractGenerator] Invoking model: ${model} (attempt ${attempt})...`);
        const startTime = Date.now();

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: contractResponseSchema,
            temperature: 0.15,
          },
        });

        const elapsed = Date.now() - startTime;
        console.log(`[ContractGenerator] Model ${model} finished in ${elapsed}ms.`);

        const jsonText = response.text?.trim() || '';
        const parsedResponse = JSON.parse(jsonText) as GeneratedContract;

        if (
          parsedResponse.clauses &&
          Array.isArray(parsedResponse.clauses) &&
          parsedResponse.clauses.length > 0 &&
          parsedResponse.legalNotes &&
          parsedResponse.preambleArabic
        ) {
          return parsedResponse;
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        const status = err?.status || err?.code;
        console.warn(`[ContractGenerator] Model ${model} attempt ${attempt} failed:`, msg);

        // Fast-fail if API key is invalid or quota expired to avoid hanging the serverless timeout
        if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
          const authError: any = new Error(
            'مفتاح GEMINI_API_KEY غير صالح. يرجى التأكد من نسخه بشكل صحيح من Google AI Studio وضبطه في Vercel.'
          );
          authError.statusCode = 401;
          authError.code = 'INVALID_API_KEY';
          throw authError;
        }

        if (status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota exceeded')) {
          const quotaError: any = new Error('RATE_LIMIT_EXCEEDED');
          quotaError.statusCode = 429;
          quotaError.code = 'RATE_LIMIT_EXCEEDED';
          throw quotaError;
        }

        if (attempt < 2 && (status === 503 || status === 500)) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        break;
      }
    }
  }

  const finalMsg = lastError?.message || 'فشل توليد العقد بواسطة الذكاء الاصطناعي.';
  const genError: any = new Error(finalMsg);
  genError.statusCode = 500;
  genError.code = 'GENERATION_FAILED';
  throw genError;
}
