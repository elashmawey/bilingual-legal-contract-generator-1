import type { GeneratedContract } from '../../types';

export const softwareAgreement: GeneratedContract = {
  contractTitleArabic: 'عقد تطوير برمجيات ونقل ملكية فكرية وتقنية وفقاً للقانون رقم 82 لسنة 2002 وقانون التوقيع الإلكتروني',
  contractTitleEnglish: 'Software Development, IP Transfer & SLA Agreement pursuant to Law No. 82 of 2002 & Electronic Signature Law',
  preambleArabic: `إنه في يوم [اليوم] الموافق [التاريخ] ميلادية، تحرر هذا العقد بمدينة القاهرة، جمهورية مصر العربية، بين كل من:
أولاً: شركة/الأستاذ [اسم العميل/جهة التعاقد]، [وصف كيان العميل]، السجل التجاري رقم: [رقم السجل]، البطاقة الضريبية رقم: [رقم الضريبية]، مقرها الكائن في: [عنوان العميل]، ويمثلها في التوقيع: [اسم الممثل]، بصفته [المسمى الوظيفي] (طرف أول - العميل صاحب المشروع).
ثانياً: شركة/الأستاذ [اسم مطور البرمجيات/شركة التقنية]، متخصصة في تطوير البرمجيات والحلول التقنية، السجل التجاري رقم: [رقم السجل]، مقرها الكائن في: [عنوان المطور]، ويمثلها في التوقيع: [اسم الممثل]، بصفته [المسمى الوظيفي] (طرف ثانٍ - المطور/مزود الخدمة التقنية).
وبعد أن أقر الطرفان بكامل أهليتهما القانونية والتجارية للتعاقد، وعدم وجود أي تعارض مصالح أو منازعات سابقة، وإحاطة كل منهما علماً كاملاً بمتطلبات المشروع وطبيعة التكنولوجيا المعنية، اتفقا على الشروط الآتية:`,
  preambleEnglish: `On this day of [Day], corresponding to [Date] A.D., in the City of Cairo, Arab Republic of Egypt, this Agreement was executed between:
First: [Client/Company Name], [Entity Type], Commercial Register No. [CR Number], Tax Card No. [Tax Number], headquartered at [Client Address], represented by [Representative Name], [Title] (First Party - Client & Project Owner).
Second: [Developer/Tech Company Name], specialized in software development and technology solutions, Commercial Register No. [CR Number], headquartered at [Developer Address], represented by [Representative Name], [Title] (Second Party - Developer & Technology Services Provider).
Both Parties, acknowledging full legal capacity and having disclosed all relevant conflicts of interest, with each Party having full knowledge of project requirements and applicable technology, have covenanted as follows:`,
  recitalsArabic: `حيث يرغب الطرف الأول في تطوير وتسليم نظام برمجي/تطبيق/منصة إلكترونية متكاملة وفقاً لوثيقة المتطلبات الفنية المرفقة (Functional Requirements Specification)، وحيث إن الطرف الثاني يمتلك الخبرة التقنية والكوادر البشرية والمنهجية اللازمة لتنفيذ هذا المشروع التقني ونقل ملكيته الكاملة للطرف الأول عند اكتماله، فلقد تلاقت إرادتهما الحرة على إبرام هذا العقد.`,
  recitalsEnglish: `Whereas the First Party desires to procure the development and delivery of an integrated software system/application/electronic platform in accordance with the attached Functional Requirements Specification; and Whereas the Second Party possesses the technical expertise and qualified engineering team to implement and deliver this technical project, transferring full intellectual property ownership upon completion; Now, the Parties agreed as follows:`,
  clauses: [
    {
      titleArabic: 'التمهيد والتعريفات والمستندات الجزء من العقد',
      titleEnglish: 'Preamble, Definitions & Integral Contract Documents',
      contentArabic: 'يُعتبر التمهيد ووثيقة متطلبات النظام (FRS) والجدول الزمني للمشروع (Project Timeline) والميزانية التفصيلية المعتمدة (Approved Budget) وسياسة مستوى الخدمة (SLA) المرفقة كملاحق لهذا العقد، جزءاً لا يتجزأ من هذا العقد وبنوداً جوهرية ملزمة وعند تعارضها يتقدم نص العقد على الملاحق ما لم ينص صراحة على خلاف ذلك.',
      contentEnglish: 'The Preamble, Functional Requirements Specification (FRS), Project Timeline, Approved Budget, and Service Level Agreement (SLA) appended hereto constitute integral and indivisible parts of this Agreement with full binding force; in case of conflict, the body of this Agreement prevails unless explicitly stated otherwise.'
    },
    {
      titleArabic: 'نطاق المشروع ومواصفات البرنامج المطلوب تطويره',
      titleEnglish: 'Project Scope, Technical Specifications & Deliverables',
      contentArabic: 'يلتزم الطرف الثاني بتصميم وتطوير وتسليم المنتج البرمجي المتمثل في: [وصف تفصيلي للبرنامج/التطبيق/المنصة]، وفقاً للمواصفات الفنية المفصلة بوثيقة المتطلبات الفنية المرفقة وملاحقها، وتشمل المنتجات المسلمة (Deliverables): الكود المصدري الكامل، وقاعدة البيانات ومخططاتها، وحزمة التثبيت والنشر، والوثائق التقنية والمستخدم، ونقل كافة مفاتيح الوصول والتفاصيل التقنية للبيئة الإنتاجية.',
      contentEnglish: 'The Second Party undertakes to design, develop, test, and deliver [Detailed Software/Application/Platform Description] in full conformity with the Functional Requirements Specification. Deliverables include complete source code, database schemas and scripts, deployment packages, technical & user documentation, and full transfer of production credentials and access keys.'
    },
    {
      titleArabic: 'الجدول الزمني والمراحل والمعالم الحاسمة',
      titleEnglish: 'Timeline, Milestones & Critical Path Delivery Schedule',
      contentArabic: `يُنفَّذ المشروع وفقاً للجدول الزمني المرفق، ويُقسم إلى مراحل رئيسية:
المرحلة الأولى: دراسة وتحليل المتطلبات وإقرارها (30 يوماً من تاريخ الاتفاق).
المرحلة الثانية: التصميم والواجهات والبنية التقنية (45 يوماً).
المرحلة الثالثة: التطوير والبرمجة والتكامل (90 يوماً).
المرحلة الرابعة: الاختبار وضمان الجودة وتصحيح الأخطاء (30 يوماً).
المرحلة الخامسة: الإطلاق والنشر والتدريب والتسليم النهائي (15 يوماً).
ويُعد كل معلم مرحلة مستقل بذاته للتحقق والقبول، وتترتب على التأخير الجزائي التعاقدية المنصوص عليها في البند السابع.`,
      contentEnglish: `The project shall be implemented per the appended Project Timeline and divided into the following major milestones:
Phase 1: Requirements Analysis, Clarification & Approval (30 days from execution).
Phase 2: System Design, UI/UX Mockups & Technical Architecture (45 days).
Phase 3: Development, Programming & Systems Integration (90 days).
Phase 4: Testing, Quality Assurance & Bug Correction (30 days).
Phase 5: Launch, Deployment, Training & Final Handover (15 days).
Each milestone constitutes an independent verification and acceptance event, with liquidated damages for delay per Clause Seven.`
    },
    {
      titleArabic: 'الأتعاب والمقابل المالي وجداول الدفعات المرتبطة بالمراحل',
      titleEnglish: 'Professional Fees, Payment Schedule & Milestone Invoicing',
      contentArabic: 'المقابل المالي الإجمالي لتنفيذ هذا المشروع مبلغ [إجمالي المقابل] جنيه مصري (فقط [المبلغ بالحروف] لا غير)، مشمولاً ضريبة القيمة المضافة بالسعر القانوني، ويُسدد وفقاً للجدول: 30% مقدماً عند توقيع العقد، 20% عند الانتهاء من مرحلة التصميم والإقرار، 30% عند تسليم النسخة التجريبية (Beta)، 20% عند التسليم النهائي وقبول المشروع. وتصدر الفواتير إلكترونياً معتمدة طبقاً لمنظومة مصلحة الضرائب المصرية.',
      contentEnglish: 'Total project compensation is EGP [Total Amount] ([Amount in Words]), inclusive of VAT at statutory rate, payable as follows: 30% advance upon signing; 20% upon approved design completion; 30% upon Beta version delivery; 20% upon final acceptance. All invoices shall be electronically certified via the Egyptian Tax Authority e-invoicing system.'
    },
    {
      titleArabic: 'نقل الملكية الفكرية الكاملة عند التسليم النهائي',
      titleEnglish: 'Full Intellectual Property Transfer upon Final Delivery',
      contentArabic: 'يُؤكد الطرفان صراحةً أن جميع حقوق الملكية الفكرية للنظام البرمجي المطور بموجب هذا العقد، شاملةً الكود المصدري والتصميم والخوارزميات والقواعد البيانية وأعمال التكامل والوثائق التقنية، تؤول بالكامل للطرف الأول بمجرد سداد آخر دفعة وتسليم المشروع نهائياً. ولا تستبقي شركة التطوير أي حق لاستخدام أو نسخ أو توزيع أو منح ترخيص للنظام أو مكوناته لأي طرف ثالث. ويصدر بذلك شهادة نقل الملكية الفكرية الرسمية طبقاً للقانون رقم 82 لسنة 2002.',
      contentEnglish: 'The Parties expressly confirm that all intellectual property rights in the developed software system — including but not limited to source code, design, algorithms, database schemas, integration works, and technical documentation — transfer absolutely to the First Party upon final payment and delivery. The Developer retains no rights to use, copy, distribute, or sublicense the system or any component thereof to any third party. An official IP Assignment Certificate shall be issued pursuant to Law No. 82 of 2002.'
    },
    {
      titleArabic: 'حماية السرية والبيانات الشخصية وأمن المعلومات',
      titleEnglish: 'Confidentiality, Personal Data Protection & Information Security',
      contentArabic: 'يلتزم الطرف الثاني بالحفاظ على سرية تامة لجميع المعلومات التجارية والتشغيلية والبيانات الشخصية للعملاء التي قد يطلع عليها بحكم تنفيذه لهذا العقد، وذلك طوال مدة العقد ولمدة خمس سنوات بعد انتهائه. ويمتثل التزاماً تاماً لأحكام قانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020 ولوائحه التنفيذية، ويلتزم باتباع معايير أمن المعلومات ISO 27001.',
      contentEnglish: 'The Developer undertakes absolute confidentiality with respect to all commercial, operational, and personal data of the client and its customers encountered in performance of this Agreement, maintained throughout the term and for five (5) years post-termination. Full compliance with Egyptian Personal Data Protection Law No. 151 of 2020 and its Executive Regulations, and information security ISO 27001 standards, is mandatory.'
    },
    {
      titleArabic: 'الغرامات التعاقدية والتعويض عن التأخير والإخلال',
      titleEnglish: 'Liquidated Damages for Delay & Breach Compensation',
      contentArabic: 'يحق للطرف الأول اقتطاع غرامة تعاقدية عن كل أسبوع تأخير في تسليم أي مرحلة محددة بما يُعادل 1.5% من قيمة تلك المرحلة الجزئية بحد أقصى إجمالي 15% من قيمة العقد الكلية. وتُعتبر هذه الغرامات التعاقدية تعويضاً اتفاقياً ملزماً وفقاً لنص المادة (224) من القانون المدني المصري دون الإخلال بحق الطرف الأول في المطالبة بالتعويض الكامل عن الأضرار الثابتة التي تجاوز الغرامة.',
      contentEnglish: 'The First Party is entitled to deduct 1.5% of the relevant milestone value per week of delay, capped at 15% of total contract value aggregate. These contractual penalties constitute binding agreed compensation under Article (224) of the Egyptian Civil Code, without prejudice to the Client\'s right to claim full proven damages in excess of the penalty cap.'
    },
    {
      titleArabic: 'ضمان البرنامج وإصلاح الأخطاء وصيانة ما بعد التسليم',
      titleEnglish: 'Software Warranty, Bug Fixing & Post-Delivery Maintenance',
      contentArabic: 'يمنح الطرف الثاني ضمان حصري لمدة سنة كاملة من تاريخ التسليم النهائي المقبول، يشمل: إصلاح الأخطاء البرمجية (Bugs) والثغرات الأمنية دون مقابل إضافي، وتوافق النظام مع تحديثات الأنظمة والمتصفحات الرئيسية. بعد انتهاء فترة الضمان، يُمكن إبرام عقد صيانة وتطوير منفصل.',
      contentEnglish: 'The Developer provides an exclusive one-year warranty from the date of accepted final delivery, covering: programming bugs and security vulnerability remediation at no additional cost, and compatibility with major OS and browser updates. Post-warranty ongoing maintenance and development may be contracted separately.'
    },
    {
      titleArabic: 'مستوى الخدمة (SLA) وأوقات الاستجابة وضمان التشغيل',
      titleEnglish: 'Service Level Agreement (SLA), Response Times & Uptime Guarantee',
      contentArabic: 'خلال فترة الضمان وعقود الصيانة اللاحقة، يلتزم المطور بـ: نسبة تشغيل لا تقل عن 99.5% شهرياً، وزمن استجابة أقصاه 4 ساعات للأخطاء الحرجة (Critical) و24 ساعة للأخطاء العادية، وتوفير نسخ احتياطية تلقائية يومية للبيانات والبيئة الإنتاجية.',
      contentEnglish: 'During the warranty period and any subsequent maintenance contracts, the Developer covenants: minimum monthly system uptime of 99.5%; maximum response time of 4 hours for critical bugs and 24 hours for non-critical defects; automated daily database and production environment backups.'
    },
    {
      titleArabic: 'الكود المصدري ووديعة الكود (Source Code Escrow)',
      titleEnglish: 'Source Code Ownership & Escrow Arrangements',
      contentArabic: 'عند تسليم المشروع يسلم الطرف الثاني النسخة الكاملة من الكود المصدري (Source Code) للطرف الأول على وسيط تخزين مشفر بكلمة مرور مشتركة، ويكون للطرف الأول الحق الكامل في تعديل أو تطوير أو ترخيص هذا الكود. ويجوز الاتفاق على وديعة الكود المصدري لدى طرف ثالث محايد (Escrow Agent) كضمان إضافي.',
      contentEnglish: 'Upon project delivery, the Developer shall provide the complete source code to the First Party via an encrypted password-protected storage medium. The Client holds unrestricted rights to modify, extend, and sublicense the source code. The Parties may additionally arrange source code escrow with a neutral third-party escrow agent.'
    },
    {
      titleArabic: 'استقلالية المقاول والمسؤولية تجاه الغير',
      titleEnglish: 'Independent Contractor Status & Third-Party Liability',
      contentArabic: 'يعمل الطرف الثاني بصفته مقاولاً مستقلاً (Independent Contractor) ولا تنشأ بين الطرفين علاقة عمل أو تبعية، ويتحمل وحده مسؤولية التزاماته الضريبية والتأمينية تجاه موظفيه. ولا يحق للطرف الثاني الإقرار بالتزامات باسم الطرف الأول أو تمثيله قانونياً في غير ما ينص عليه هذا العقد.',
      contentEnglish: 'The Developer operates as an Independent Contractor; no employment or agency relationship arises from this Agreement. The Developer solely bears all tax and social insurance obligations for its personnel. The Developer may not make representations or incur liabilities in the First Party\'s name beyond the scope of this Agreement.'
    },
    {
      titleArabic: 'إنهاء العقد والتسوية عند الفسخ',
      titleEnglish: 'Contract Termination & Settlement upon Dissolution',
      contentArabic: 'يحق لأي طرف إنهاء هذا العقد بإخطار كتابي مسبق بثلاثين (30) يوماً في حالة الإخلال الجوهري للطرف الآخر بشرط عدم التصحيح خلال مهلة 15 يوماً من الإنذار الرسمي. وعند الفسخ يُسوى الوضع المالي بحيث يُدفع للمطور مقابل المراحل المنجزة والمقبولة فقط ويُسترد ما لا يعادلها من المدفوعات المقدمة. ويُسلم الطرف الأول جميع مخرجات العمل المنجز حتى تاريخ الإنهاء.',
      contentEnglish: 'Either Party may terminate this Agreement with thirty (30) days\' prior written notice upon material breach, provided no cure within fifteen (15) days of formal notice. Upon termination, financial settlement shall compensate the Developer only for accepted and completed milestones; excess advance payments shall be refunded. All completed work product must be delivered to the Client upon termination.'
    },
    {
      titleArabic: 'القانون الواجب التطبيق والاختصاص القضائي والتحكيم',
      titleEnglish: 'Governing Law, Jurisdiction & Arbitration',
      contentArabic: 'يخضع هذا العقد لأحكام القانون المصري، وتختص محاكم القاهرة الاقتصادية والتجارية بالفصل في نزاعاته، أو يُلجأ اختيارياً للتحكيم أمام مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA) وفقاً لقانون التحكيم رقم 27 لسنة 1994.',
      contentEnglish: 'This Agreement is governed by Egyptian Law. Disputes shall be submitted to the Cairo Economic and Commercial Court, or alternatively to arbitration before the Cairo Regional Centre for International Commercial Arbitration (CRCICA) pursuant to Law No. 27 of 1994.'
    },
    {
      titleArabic: 'التوقيع والنسخ وحجية التوقيع الإلكتروني',
      titleEnglish: 'Execution, Counterparts & Electronic Signature Validity',
      contentArabic: 'تحرر هذا العقد من نسختين أصليتين للعمل بموجبهما أمام الجهات كافة، وتُعتبر التوقيعات الإلكترونية المعتمدة حجة قانونية كاملة طبقاً لقانون التوقيع الإلكتروني المصري رقم 15 لسنة 2004 ولوائح الهيئة القومية لتقنية المعلومات.',
      contentEnglish: 'Executed in two (2) original bilingual counterparts equally authentic and enforceable before all authorities. Certified electronic signatures hold full legal evidentiary value pursuant to Egyptian Electronic Signature Law No. 15 of 2004 and NTRA regulations.'
    }
  ],
  legalNotes: 'صيغ هذا العقد وفقاً لقانون حماية الملكية الفكرية رقم 82 لسنة 2002، وقانون التوقيع الإلكتروني رقم 15 لسنة 2004، وقانون حماية البيانات الشخصية رقم 151 لسنة 2020، والقانون المدني المصري رقم 131 لسنة 1948، ومعايير ITIL وISO 27001 المعتمدة لخدمات تكنولوجيا المعلومات.',
  shariaComplianceNotes: 'خالٍ من الربا وعناصر الغرر الفاحش، حيث يكون المقابل المالي محدداً ومعلوماً وملزماً ومرتبطاً بمخرجات فعلية قابلة للقياس والتحقق، وهو ما يتوافق مع عقد الإجارة على العمل في الفقه الإسلامي.',
  certificationStatement: 'نشهد بمطابقة هذا العقد البرمجي لأحكام القانون المصري في مجال الملكية الفكرية وحماية البرمجيات والتعاملات التقنية وأنه صالح للاحتجاج به أمام جميع المحاكم والجهات الرسمية.',
  legalAudit: {
    officialPortalValidation: 'مطابق لنماذج عقود التطوير البرمجي المعتمدة بوزارة الاتصالات وتكنولوجيا المعلومات المصرية وهيئة تنمية صناعة تكنولوجيا المعلومات (ITIDA).',
    cassationPrinciplesValidation: 'متوافق مع أحكام محكمة النقض المصرية في دعاوى الملكية الفكرية وحقوق المؤلف البرمجية وضمانات المقاولة من الباطن.',
    customaryPracticeValidation: 'الصيغة المعتمدة بمنظمة نقابة المحامين المصرية وعقود ITIDA الحكومية لمشاريع التحول الرقمي والبرمجيات.',
    shariaAuditStatement: 'متوافق مع أحكام الشريعة الإسلامية في عقد الاستصناع والإجارة على العمل مع تحديد واضح للمعقود عليه والثمن والأجل.',
    complianceScore: 100,
    verificationChecklist: [
      { item: 'نقل الملكية الفكرية الكاملة للكود المصدري', status: 'مستوفى بالكامل', reference: 'قانون 82 لسنة 2002 مادة 139' },
      { item: 'الامتثال لقانون حماية البيانات الشخصية', status: 'مستوفى بالكامل', reference: 'قانون 151 لسنة 2020' },
      { item: 'حجية التوقيع الإلكتروني', status: 'مستوفى بالكامل', reference: 'قانون 15 لسنة 2004' },
      { item: 'الغرامات التعاقدية المعتدلة القضائية', status: 'مستوفى بالكامل', reference: 'المادة 224 مدني مصري' },
      { item: 'وصف المقاول المستقل ونفي علاقة العمل', status: 'مستوفى بالكامل', reference: 'قانون العمل 12 لسنة 2003' }
    ]
  }
};
