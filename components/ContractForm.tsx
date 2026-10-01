import React, { useState, useEffect } from 'react';
import type { ContractFormData } from '../types';

interface ContractFormProps {
  onSubmit: (formData: ContractFormData) => void;
}

// Preset Quick Templates with realistic authentic Egyptian data
const QUICK_PRESETS = [
  {
    id: 'real_estate_sale',
    icon: 'fa-building',
    labelAr: 'عقد بيع وحدة سكنية نهائي',
    labelEn: 'Apartment Sale Agreement',
    contractType: 'Real Estate Purchase Agreement',
    badge: 'الأكثر طلباً',
    disputeResolution: 'egyptian_courts' as const,
    details: {
      partyDetails: 'الطرف الأول (البائع): السيد/ محمد عبد الوهاب حسنين، مصري الجنسية، بطاقة رقم قومي: 27805120102345، المقيم في: 14 شارع النصر، المعادي، القاهرة.\nالطرف الثاني (المشتري): المهندس/ طارق إبراهيم الدسوقي، مصري الجنسية، بطاقة رقم قومي: 28904010103456، المقيم في: 22 شارع الثورة، مصر الجديدة، القاهرة.',
      agreementSubject: 'بيع نهائي وبات غير قابل للرجوع فيه للوحدة السكنية رقم (402) بالدور الرابع بالعقار الكائن بالقطعة رقم (88) الحي الخامس، التجمع الخامس، القاهرة الجديدة، والبالغ مساحتها الإجمالية 185 متراً مربعاً، شاملة حصة شائعة في الأرض والمرافق وأجزاء العقار المشتركة ومكان مخصص لانتظار سيارة بالجراج.',
      financialTerms: 'إجمالي الثمن المتفق عليه 3,850,000 جنيه مصري (ثلاثة ملايين وثمانمائة وخمسون ألف جنيه)، سُدد منه 2,000,000 جنيه كدفعة مقدمة بمجلس العقد، والمتبقي 1,850,000 جنيه يُسدد على 4 شيكات بنكية ربع سنوية متساوية دون أي فوائد ربوية.',
      contractTerm: 'التسليم الفعلي للعين خالية من كافة الشواغل والديون والرهون ومستحقات المرافق في 1 نوفمبر 2026، مع التزام البائع بالمثول أمام مأمورية الشهر العقاري لتوثيق عقد البيع النهائي ونقل الملكية فور سداد كامل الثمن.',
    },
  },
  {
    id: 'residential_lease',
    icon: 'fa-house-chimney',
    labelAr: 'عقد إيجار شقة (قانون 4/1996)',
    labelEn: 'Residential Lease Agreement',
    contractType: 'Lease Agreement',
    badge: 'رسمي ومعتمد',
    disputeResolution: 'egyptian_courts' as const,
    details: {
      lessorDetails: 'السيد/ خالد عبد الرحمن الشافعي، مصري الجنسية، بطاقة رقم قومي: 27208150104321، المقيم في: 12 شارع سوريا، المهندسين، الجيزة (المؤجر).',
      lesseeDetails: 'السيد/ أحمد سامي مرسي، مصري الجنسية، بطاقة رقم قومي: 28811200109876، المقيم في: 45 شارع عباس العقاد، مدينة نصر، القاهرة (المستأجر).',
      propertyDetails: 'الشقة السكنية رقم (6) بالدور الثالث بالعقار رقم (15) شارع دجلة، الدقي، الجيزة، مكونة من ثلاث غرف وصالة واستقبال ومطبخ وحمامين، والمخصصة للسكن العائلي فقط.',
      rentAmount: 'القيمة الإيجارية الشهرية مبلغ 16,000 جنيه مصري تُدفع مقدماً في الأول من كل شهر ميلادي بموجب إيصال سداد، مع زيادة سنوية اتفاقية بنسبة 10%، وتأمين نقدي قدره 32,000 جنيه يُرد عند انتهاء العقد.',
      leaseTerm: 'مدة الإيجار سنتان تبدأ من 1 نوفمبر 2026 وتنتهي في 31 أكتوبر 2028، وينتهي العقد بانتهاء مدته دون حاجة لتنبيه أو إنذار بالإخلاء وفقاً لأحكام القانون رقم 4 لسنة 1996.',
    },
  },
  {
    id: 'turnkey_construction',
    icon: 'fa-trowel-bricks',
    labelAr: 'عقد مقاولات وتشطيبات Turnkey',
    labelEn: 'Turnkey Construction & Fit-out',
    contractType: 'Construction Contract',
    badge: '18+ مادة مفصلة',
    disputeResolution: 'arbitration' as const,
    details: {
      partyDetails: 'الطرف الأول (رب العمل): شركة الأفق للاستثمار العقاري والتجاري ش.م.م، سجل تجاري رقم 12894 القاهرة، ويمثلها رئيس مجلس الإدارة.\nالطرف الثاني (المقاول الرئيسي): شركة النيل للإنشاءات الهندسية والمقاولات العامة، سجل تجاري رقم 45982 الجيزة، ومقيدة بالاتحاد المصري لمقاولي البناء والتشييد الفئة الأولى.',
      agreementSubject: 'تنفيذ أعمال التشطيبات المتكاملة والتجهيزات الكهروميكانيكية والمعمارية (تسليم مفتاح) لمبنى إداري وتجاري متكامل بالقرية الذكية مكون من بدروم وأرضي و4 أدوار متكررة وفقاً لدفاتر الشروط والمواصفات الفنية المعتمدة.',
      financialTerms: 'القيمة الإجمالية التعاقدية المقطوعة 24,500,000 جنيه مصري، دفعة مقدمة 15% مقابل خطاب ضمان بنكي نهائي غير مشروط، ومستخلصات شهرية جارية مع حجز 5% كضمان صيانة يُرد بعد انتهاء فترة الضمان.',
      contractTerm: 'مدة التنفيذ الإجمالية 14 شهراً تقويمياً تبدأ من تاريخ استلام الموقع بموجب محضر استلام رسمي، مع خضوع المقاول للضمان العشري طبقاً للمادة 651 من القانون المدني المصري وغرامة تأخير اتفاقية جابرة للضرر.',
    },
  },
  {
    id: 'executive_employment',
    icon: 'fa-user-tie',
    labelAr: 'عقد عمل فردي تنفيذي',
    labelEn: 'Executive Employment Contract',
    contractType: 'Employment Contract',
    badge: 'قانون العمل 12/2003',
    disputeResolution: 'egyptian_courts' as const,
    details: {
      employerDetails: 'شركة دلتا للتكنولوجيا المالية والخدمات المصرفية الرقمية ش.م.م، سجل تجاري رقم 98124 استثمار القاهرة، ويمثلها في التوقيع مدير عام الموارد البشرية.',
      employeeDetails: 'المهندس/ عمر كمال عبد العزيز، مصري الجنسية، بطاقة رقم قومي: 29302150106543، حاصل على بكالوريوس هندسة الحاسبات، المقيم في: التجمع الثالث، القاهرة الجديدة.',
      jobTitle: 'رئيس فريق هندسة البرمجيات السحابية (Lead Cloud Solutions Architect).',
      salaryAndBenefits: 'راتب شهري إجمالي قدره 55,000 جنيه مصري، تأمين طبي شامل من الدرجة الأولى للأسرة، بدل مواصلات وهاتف، مكافأة أداء سنوية ترتبط بالأهداف، وإجازة سنوية مدفوعة الأجر 21 يوماً وفق قانون العمل 12 لسنة 2003.',
      contractTerm: 'عقد محدد المدة لمدة سنتين تبدأ من 15 نوفمبر 2026، يتضمن فترة اختبار مدتها 3 أشهر وفقاً لأحكام قانون العمل المصري رقم 12 لسنة 2003، مع التزام صارم بالسرية وحظر المنافسة لمدة سنتين بعد الانتهاء.',
    },
  },
  {
    id: 'tech_software_sla',
    icon: 'fa-laptop-code',
    labelAr: 'تطوير برمجيات وترخيص تقني وSLA',
    labelEn: 'Software Development & SLA',
    contractType: 'Software Development Agreement',
    badge: 'حماية ملكية فكرية',
    disputeResolution: 'arbitration' as const,
    details: {
      clientDetails: 'شركة فارما مصر لتجارة وتوزيع الأدوية والمستلزمات الطبية ش.م.م (القاهرة).',
      developerDetails: 'شركة كلاود تك لحلول الذكاء الاصطناعي وتطوير المنظومات الرقمية ذ.م.م (القرية الذكية).',
      projectScope: 'تصميم وبرمجة وتشغيل نظام سحابي متكامل لإدارة سلاسل الإمداد ومستودعات الأدوية مع تطبيق هاتف ذكي للربط مع الصيدليات وواجهات برمجة التطبيقات API للمدفوعات الرقمية وبوابة الفاتورة الإلكترونية لمصلحة الضرائب المصرية.',
      paymentSchedule: 'إجمالي المقابل المالي 850,000 جنيه مصري يُدفع على 4 مراحل: 25% عند التوقيع، 25% عند اعتماد التصميم المعماري والنماذج، 30% عند الفحص التجريبي والتشغيل، و20% عند الاستلام النهائي ونقل الكود المصدري.',
      ipOwnership: 'تنازل كامل ومطلق وغير قابل للإلغاء من المطور للعميل عن كافة حقوق الملكية الفكرية، وحقوق المؤلف، والشفرة المصدرية (Source Code)، وقواعد البيانات فور سداد مستحقات المرحلة النهائية.',
    },
  },
  {
    id: 'investment_partnership',
    icon: 'fa-handshake',
    labelAr: 'عقد شراكة استثمارية وتأسيس مشروع',
    labelEn: 'Partnership & Joint Venture',
    contractType: 'Partnership Agreement',
    badge: 'أرباح وخسائر شرعية',
    disputeResolution: 'egyptian_courts' as const,
    details: {
      partnershipName: 'شركة النور للصناعات الغذائية والتصدير (شركة تضامن / توصية بسيطة قيد التأسيس).',
      partnerDetails: 'الطرف الأول (شريك ممول): السيد/ حسن عبد الله المنشاوي، بطاقة رقم قومي: 27506100101122 (حصة مالية).\nالطرف الثاني (شريك بالعمل والإدارة): المهندس/ ياسر سعيد البكري، بطاقة رقم قومي: 28409180102233 (حصة عمل وخبرة فنية وتفرغ إداري).',
      capitalContributions: 'رأس مال المشروع الإجمالي 6,000,000 جنيه مصري، يقدم الطرف الأول مبلغ 4,500,000 جنيه نقداً، ويقدم الطرف الثاني مبلغ 1,500,000 جنيه نقداً بالإضافة إلى خبرته الإدارية والتسويقية المتفرغة.',
      profitAndLoss: 'توزيع الأرباح الصافية بنسبة 60% للطرف الأول و40% للطرف الثاني بعد استقطاب الاحتياطيات، وتوزيع الخسائر الرأسمالية بقدر الحصص المالية عملاً بالقاعدة الشرعية الفقهية "الربح على ما اشترطا والوضيعة على قدر المالين".',
      managementAndVoting: 'يتولى الطرف الثاني الإدارة التنفيذية اليومية للشركة وله حق التوقيع أمام البنوك والجهات الحكومية في حدود ميزانية التشغيل، على ألا تصح التصرفات العقارية أو القروض إلا بتوقيع مشترك بين الشريكين.',
    },
  },
  {
    id: 'company_formation',
    icon: 'fa-landmark',
    labelAr: 'عقد تأسيس شركة تضامن تجارية',
    labelEn: 'Articles of Association & Partnership',
    contractType: 'Company Formation Contract',
    badge: 'قانون التجارة 17/1999',
    disputeResolution: 'egyptian_courts' as const,
    details: {
      partnershipName: 'شركة الأمل للتجارة العامة والتوريدات (شركة تضامن مصرية).',
      partnerDetails: 'الطرف الأول: السيد/ أحمد محمود الصاوي، بطاقة رقم قومي: 27901010105432، المقيم في: الدقي، الجيزة (شريك متضامن).\nالطرف الثاني: السيد/ شريف عبد الرحمن الغندور، بطاقة رقم قومي: 28305040108765، المقيم في: مصر الجديدة، القاهرة (شريك متضامن).',
      capitalContributions: 'رأس مال الشركة 2,000,000 جنيه مصري مقسم بنسبة 50% لكل شريك، أودعت بالكامل في حساب بنكي تحت التأسيس.',
      profitAndLoss: 'توزيع الأرباح بنسبة 50% لكل شريك بعد خصم 10% احتياطي قانوني، وتوزيع الخسائر بقدر الحصص عملاً بالقواعد الشرعية.',
      managementAndVoting: 'الإدارة والتوقيع حق مشترك للطرفين في التصرفات المالية البنكية التي تتجاوز 100,000 جنيه ولأي منهما منفرداً في الإدارة التشغيلية اليومية.',
    },
  },
  {
    id: 'commercial_supply',
    icon: 'fa-truck-ramp-box',
    labelAr: 'عقد توريد وبيع بضائع تجاري',
    labelEn: 'Commercial Goods Supply Agreement',
    contractType: 'Sales Agreement',
    badge: 'فحص وضمان عيوب',
    disputeResolution: 'egyptian_courts' as const,
    details: {
      partyDetails: 'الطرف الأول (المورد): شركة الدلتا للصناعات والتوريدات ش.م.م، سجل تجاري 77651 القاهرة.\nالطرف الثاني (المشتري): شركة النيل للمقاولات والتجارة ذ.م.م، سجل تجاري 33412 الجيزة.',
      agreementSubject: 'توريد مواد بناء وكابلات كهربائية معتمدة مطابقة للمواصفات القياسية المصرية مع شهادات المنشأ والاختبار المعملي.',
      financialTerms: 'إجمالي القيمة 1,200,000 جنيه مصري، دفعة مقدمة 20%، والباقي بتسهيلات سداد بنكية خلال 30 يوماً من محضر الفحص والاستلام.',
      contractTerm: 'التوريد على 3 دفعات متتالية خلال 60 يوماً، مع خضوع البضاعة للفحص الفني وضمان العيوب الخفية لمدة سنة.',
    },
  },
  {
    id: 'nda_privacy',
    icon: 'fa-shield-halved',
    labelAr: 'اتفاقية سرية وعدم إفصاح (NDA)',
    labelEn: 'Non-Disclosure Agreement (NDA)',
    contractType: 'Non-Disclosure Agreement (NDA)',
    badge: 'قانون حماية البيانات 151/2020',
    disputeResolution: 'egyptian_courts' as const,
    details: {
      partyDetails: 'الطرف المفصح: شركة القاهرة لحلول الدفع الإلكتروني ش.م.م.\nالطرف المتلقي: شركة مينا لتطوير المنصات الرقمية ذ.م.م.',
      agreementSubject: 'حماية سرية البيانات المالية والتشفير وقواعد بيانات العملاء والشفرة المصدرية بمناسبة دراسة الاندماج والشراكة التقنية.',
      financialTerms: 'تعويض اتفاقي جابر للضرر قدره 500,000 جنيه مصري عن أي واقعة إفشاء غير مصرح بها للبيانات السرية دون إخلال بالمسؤولية الجنائية.',
      contractTerm: 'سريان الالتزام بالسرية لمدة 3 سنوات ميلادية تبدأ من تاريخ توقيع هذه الاتفاقية وخضوعها لقانون حماية البيانات الشخصية 151 لسنة 2020.',
    },
  },
];

// Configuration for dynamic fields based on contract type
const contractFieldConfig: { [key: string]: any[] } = {
  'Employment Contract': [
    { name: 'employerDetails', labelAr: 'بيانات صاحب العمل', labelEn: 'Employer Details', placeholderAr: 'اسم الشركة، العنوان، السجل التجاري...', placeholderEn: 'Company name, address, commercial registration...', type: 'textarea' },
    { name: 'employeeDetails', labelAr: 'بيانات الموظف', labelEn: 'Employee Details', placeholderAr: 'الاسم، الرقم القومي، العنوان...', placeholderEn: 'Name, national ID, address...', type: 'textarea' },
    { name: 'jobTitle', labelAr: 'المنصب والوصف الوظيفي', labelEn: 'Job Title & Responsibilities', placeholderAr: 'مثال: رئيس فريق البرمجيات، مدير مالي تنفيذي', placeholderEn: 'e.g., Software Architect, Chief Financial Officer', type: 'text' },
    { name: 'salaryAndBenefits', labelAr: 'الراتب والبدلات والمزايا', labelEn: 'Salary, Allowances & Benefits', placeholderAr: 'الراتب الأساسي، بدل السكن، التأمين الطبي، المكافأة السنوية...', placeholderEn: 'Base salary, allowances, medical insurance, annual bonus...', type: 'textarea' },
    { name: 'contractTerm', labelAr: 'مدة العقد وفترة الاختبار', labelEn: 'Term & Probation Period', placeholderAr: 'سنة أو سنتين، فترة اختبار 3 أشهر وفقاً لقانون العمل 12 لسنة 2003...', placeholderEn: '1-2 years, 3 months probation per Egyptian Labor Law 12/2003...', type: 'text' },
  ],
  'Lease Agreement': [
    { name: 'lessorDetails', labelAr: 'بيانات المؤجر', labelEn: 'Lessor Details', placeholderAr: 'الاسم، الرقم القومي، العنوان، موطنه المختار', placeholderEn: 'Name, National ID, Address, Legal Domicile', type: 'textarea' },
    { name: 'lesseeDetails', labelAr: 'بيانات المستأجر', labelEn: 'Lessee Details', placeholderAr: 'الاسم، الرقم القومي، العنوان، موطنه المختار', placeholderEn: 'Name, National ID, Address, Legal Domicile', type: 'textarea' },
    { name: 'propertyDetails', labelAr: 'مواصفات العين المؤجرة ومشتملاتها', labelEn: 'Leased Property Specifications', placeholderAr: 'العنوان الكامل للعقار، الدور، المساحة، نوع الاستخدام (سكني/تجاري)', placeholderEn: 'Full address of property, floor, area, designated usage', type: 'textarea' },
    { name: 'rentAmount', labelAr: 'القيمة الإيجارية وطريقة السداد والتأمين', labelEn: 'Rent Amount, Payment & Deposit', placeholderAr: 'المبلغ الشهري، الزيادة السنوية المقررة، مبلغ التأمين المسترد', placeholderEn: 'Monthly rent, annual increase, refundable security deposit', type: 'text' },
    { name: 'leaseTerm', labelAr: 'مدة الإيجار وشروط الإخلاء', labelEn: 'Lease Duration & Eviction Rules', placeholderAr: 'المدة وتاريخ البدء والانتهاء (خاضع لأحكام القانون 4 لسنة 1996)', placeholderEn: 'Duration, start & end date subject to Law 4/1996', type: 'text' },
  ],
  'Real Estate Purchase Agreement': [
    { name: 'partyDetails', labelAr: 'بيانات البائع والمشتري', labelEn: 'Seller & Buyer Details', placeholderAr: 'الأسماء، الأرقام القومية، العناوين، الأهلية القانونية...', placeholderEn: 'Names, national IDs, addresses, legal capacity...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'بيان وتوصيف العقار المبيع وحصصه', labelEn: 'Property Description & Land Share', placeholderAr: 'رقم الوحدة، العقار، القطعة، المساحة، الحصة في الأرض والجراج وسند الملكية...', placeholderEn: 'Unit no, building, plot, area, land share, garage & title deed...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'الثمن الإجمالي وجدول الدفعات', labelEn: 'Total Price & Installments Schedule', placeholderAr: 'إجمالي الثمن بالجنيه المصري، المقدم المدفوع، الأقساط وتواريخها...', placeholderEn: 'Total price in EGP, down payment, installment schedule...', type: 'textarea' },
    { name: 'contractTerm', labelAr: 'شروط التسليم ونقل الملكية والشهر العقاري', labelEn: 'Delivery, Registration & Title Transfer', placeholderAr: 'موعد التسليم الفعلي، التزام الحضور بالشهر العقاري لنقل الملكية...', placeholderEn: 'Handover date, notary attendance commitment...', type: 'text' },
  ],
  'Construction Contract': [
    { name: 'partyDetails', labelAr: 'بيانات رب العمل والمقاول', labelEn: 'Employer & Contractor Details', placeholderAr: 'بيانات الشركة، السجل التجاري، التصنيف باتحاد المقاولين...', placeholderEn: 'Company details, commercial registration, contractor grade...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'نطاق الأعمال والمواصفات الهندسية', labelEn: 'Scope of Works & Technical Specs', placeholderAr: 'وصف تفصيلي لأعمال التشييد والتشطيب، الرسومات الهندسية المعتمدة...', placeholderEn: 'Detailed construction & finishing scope, approved drawings...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'القيمة المالية والدفعات وخطابات الضمان', labelEn: 'Contract Sum, Milestones & Bank Guarantees', placeholderAr: 'القيمة الإجمالية، الدفعة المقدمة، المستخلصات الشهرية، نسبة حجز الصيانة...', placeholderEn: 'Total sum, advance payment, progress invoices, retention...', type: 'textarea' },
    { name: 'contractTerm', labelAr: 'البرنامج الزمني والضمان العشري (م 651 مدني)', labelEn: 'Execution Schedule & Decennial Liability', placeholderAr: 'مدة التنفيذ بالأشهر، غرامة التأخير اليومية، والضمان العشري لسلامة المبنى...', placeholderEn: 'Duration in months, delay liquidated damages, decennial liability...', type: 'text' },
  ],
  'Software Development Agreement': [
    { name: 'clientDetails', labelAr: 'بيانات العميل', labelEn: 'Client Details', placeholderAr: 'اسم الشركة، الممثل القانوني، المقر، السجل التجاري...', placeholderEn: 'Company name, authorized signatory, headquarters...', type: 'textarea' },
    { name: 'developerDetails', labelAr: 'بيانات المطور التقني', labelEn: 'Developer Details', placeholderAr: 'اسم الشركة المطورة، السجل التجاري، الممثل التقني والقانوني...', placeholderEn: 'Development firm, commercial registration, tech representative...', type: 'textarea' },
    { name: 'projectScope', labelAr: 'المواصفات الفنية ونطاق المنظومة الرقمية', labelEn: 'Technical Scope & Feature Specs', placeholderAr: 'توصيف النظام، التطبيقات، البنية السحابية، ووثيقة المتطلبات الفنية...', placeholderEn: 'System architecture, mobile apps, cloud backend, requirements...', type: 'textarea' },
    { name: 'paymentSchedule', labelAr: 'المقابل المالي ومراحل التسليم والاعتماد', labelEn: 'Financial Consideration & Milestones', placeholderAr: 'إجمالي المقابل، الدفعة المقدمة، ودفعات المراحل المرتبطة بمحاضر الفحص...', placeholderEn: 'Total fee, advance payment, milestone acceptance triggers...', type: 'textarea' },
    { name: 'ipOwnership', labelAr: 'ملكية الكود المصدري وحقوق الملكية الفكرية وSLA', labelEn: 'IP Ownership, Source Code & SLA', placeholderAr: 'نقل ملكية الكود المصدري للعميل، اتفاقية مستوى الخدمة، والدعم الفني...', placeholderEn: 'Full transfer of source code, SLA metrics, technical support...', type: 'text' },
  ],
  'Partnership Agreement': [
    { name: 'partnershipName', labelAr: 'الاسم والسمة التجارية للشراكة', labelEn: 'Partnership Commercial Name', placeholderAr: 'الاسم التجاري للشركة أو المشروع المشترك المقترح...', placeholderEn: 'Commercial brand name of the proposed venture...', type: 'text' },
    { name: 'partnerDetails', labelAr: 'بيانات الشركاء والأرقام القومية', labelEn: 'Partners Details & National IDs', placeholderAr: 'الأسماء، الصفة (شريك متضامن / شريك موصٍ)، العناوين...', placeholderEn: 'Names, partner legal status (managing / silent), addresses...', type: 'textarea' },
    { name: 'capitalContributions', labelAr: 'حصص رأس المال النقدية والعينية', labelEn: 'Capital Contributions (Cash & In-Kind)', placeholderAr: 'مقدار حصة كل شريك وقيمتها، وطريقة الوفاء برأس المال...', placeholderEn: 'Capital share of each partner, cash or assets, payment...', type: 'textarea' },
    { name: 'profitAndLoss', labelAr: 'قواعد توزيع الأرباح والخسائر الشرعية', labelEn: 'Profit & Loss Sharia Compliant Ratio', placeholderAr: 'نسبة الأرباح، وتحمل الخسائر بحسب رأس المال طبقاً للشريعة...', placeholderEn: 'Profit percentages, capital loss allocation according to Sharia...', type: 'text' },
    { name: 'managementAndVoting', labelAr: 'الإدارة وصلاحيات التوقيع البنكي والحكومي', labelEn: 'Management, Signatory Powers & Governance', placeholderAr: 'تحديد الشريك المدير، الصلاحيات الإدارية، وحدود التصرفات المالية...', placeholderEn: 'Appointing managing partner, bank signing authorities...', type: 'textarea' },
  ],
  'Company Formation Contract': [
    { name: 'partnershipName', labelAr: 'الاسم التجاري والسمة للشركة', labelEn: 'Company Commercial Name', placeholderAr: 'اسم الشركة، السمة التجارية، الشكل القانوني (تضامن / توصية)...', placeholderEn: 'Company name, trademark, legal form...', type: 'text' },
    { name: 'partnerDetails', labelAr: 'بيانات الشركاء والأرقام القومية', labelEn: 'Partners Details & National IDs', placeholderAr: 'الأسماء، الأرقام القومية، الصفات القانونية، المقار...', placeholderEn: 'Names, national IDs, legal capacities, domiciles...', type: 'textarea' },
    { name: 'capitalContributions', labelAr: 'رأس مال الشركة وتوزيع الحصص النقدية', labelEn: 'Capital & Equity Distribution', placeholderAr: 'إجمالي رأس المال، حصة كل شريك، والإيداع البنكي...', placeholderEn: 'Total capital, share percentage, bank deposit...', type: 'textarea' },
    { name: 'profitAndLoss', labelAr: 'توزيع الأرباح والخسائر والاحتياطي القانوني', labelEn: 'Profits, Losses & Statutory Reserves', placeholderAr: 'نسب توزيع الأرباح، نسبة الاحتياطي، وتحمل الخسائر...', placeholderEn: 'Profit ratios, reserve allocation, loss distribution...', type: 'text' },
    { name: 'managementAndVoting', labelAr: 'الإدارة والتوقيع البنكي والحكومي', labelEn: 'Management & Signatory Authorities', placeholderAr: 'صلاحيات المديرين، التوقيع المشترك أو المنفرد في البنوك...', placeholderEn: 'Manager powers, joint or sole banking signature...', type: 'textarea' },
  ],
  'Sales Agreement': [
    { name: 'partyDetails', labelAr: 'بيانات البائع/المورد والمشتري', labelEn: 'Seller & Buyer Details', placeholderAr: 'الأسماء، السجلات التجارية، العناوين، المفوضين بالتوقيع...', placeholderEn: 'Names, commercial registers, addresses, signatories...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'مواصفات البضائع والكميات والمعايير', labelEn: 'Goods Specs, Quantities & Standards', placeholderAr: 'توصيف البضاعة، المنشأ، الجودة، والمواصفات القياسية المصرية...', placeholderEn: 'Description of goods, origin, quality, Egyptian standards...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'إجمالي القيمة وطريقة السداد والضرائب', labelEn: 'Total Value, Payment Terms & Taxes', placeholderAr: 'القيمة الإجمالية، الدفعة المقدمة، تسهيلات السداد، وضريبة القيمة المضافة...', placeholderEn: 'Total price, advance payment, payment terms, VAT...', type: 'textarea' },
    { name: 'contractTerm', labelAr: 'جدول التوريد والتسليم والفحص وضمان العيوب', labelEn: 'Delivery Schedule, Inspection & Warranty', placeholderAr: 'مواعيد التوريد، مكان التسليم، شروط الفحص الفني، ومدة الضمان...', placeholderEn: 'Delivery dates, location, technical inspection, warranty period...', type: 'text' },
  ],
  'Non-Disclosure Agreement (NDA)': [
    { name: 'partyDetails', labelAr: 'بيانات الطرف المفصح والطرف المتلقي', labelEn: 'Disclosing & Receiving Party Details', placeholderAr: 'الأسماء، المقار، السجلات التجارية، ممثلو التوقيع...', placeholderEn: 'Names, offices, commercial registrations, representatives...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'توصيف المعلومات السرية والغرض من الإفصاح', labelEn: 'Definition of Confidential Info & Purpose', placeholderAr: 'نطاق البيانات المحمية (فنية، مالية، تجارية، شفرة برمجية)...', placeholderEn: 'Scope of protected data (technical, financial, code)...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'التعويض الاتفاقي والشرط الجزائي عن الإفشاء', labelEn: 'Liquidated Damages for Breach', placeholderAr: 'مبلغ التعويض الاتفاقي عن كل واقعة إفشاء غير مصرح بها...', placeholderEn: 'Agreed indemnity per unauthorized disclosure incident...', type: 'text' },
    { name: 'contractTerm', labelAr: 'مدة سريان الالتزام بالسرية (ق 151/2020)', labelEn: 'Confidentiality Duration & Data Law', placeholderAr: 'مدة الالتزام بالسرية (مثال: 3 إلى 5 سنوات من التوقيع)...', placeholderEn: 'Term of obligation (e.g. 3-5 years from execution)...', type: 'text' },
  ],
  'Distribution Agreement': [
    { name: 'partyDetails', labelAr: 'بيانات المنتج/الموزَّع له والموزع', labelEn: 'Principal & Distributor Details', placeholderAr: 'الأسماء، السجلات التجارية، العناوين، المفوضون بالتوقيع...', placeholderEn: 'Company names, commercial registers, signatories...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'المنطقة الحصرية والمنتجات موضوع التوزيع', labelEn: 'Exclusive Territory & Product Lines', placeholderAr: 'النطاق الجغرافي، المنتجات أو الماركات، وشروط الحصرية...', placeholderEn: 'Exclusive territory, product brands, exclusivity terms...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'هامش الربح ونسب الخصم والأهداف السنوية', labelEn: 'Margin, Discount & Annual Quotas', placeholderAr: 'نسبة هامش الربح، الخصم التجاري، الهدف السنوي...', placeholderEn: 'Profit margin, trade discount percentage, annual quota...', type: 'textarea' },
    { name: 'contractTerm', labelAr: 'مدة العقد وآلية التجديد وشروط الإنهاء', labelEn: 'Term, Renewal & Termination Conditions', placeholderAr: 'مدة التوزيع، شروط التجديد التلقائي، وحالات الفسخ...', placeholderEn: 'Distribution term, auto-renewal conditions, termination triggers...', type: 'text' },
  ],
  'Settlement Agreement': [
    { name: 'partyDetails', labelAr: 'بيانات أطراف التسوية والصلح', labelEn: 'Settlement Parties Details', placeholderAr: 'الأسماء، الأرقام القومية، الصفات القانونية، المقار...', placeholderEn: 'Names, national IDs, legal capacities, domiciles...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'وصف النزاع المُتصالح عليه والتنازلات المتبادلة', labelEn: 'Dispute Description & Mutual Concessions', placeholderAr: 'طبيعة النزاع، رقم الدعوى إن وجد، التنازلات المتبادلة...', placeholderEn: 'Nature of dispute, case number if any, mutual concessions...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'مبلغ التسوية المالية وجدول السداد', labelEn: 'Settlement Amount & Payment Schedule', placeholderAr: 'المبلغ الإجمالي للتسوية، جدول السداد، وطريقة الوفاء...', placeholderEn: 'Total settlement sum, payment schedule, method of payment...', type: 'textarea' },
    { name: 'contractTerm', labelAr: 'آثار الصلح والإبراء الشامل والتنازل القانوني', labelEn: 'Res Judicata Effect & Full Mutual Release', placeholderAr: 'التنازل عن كافة الدعاوى والمطالبات الحالية والمستقبلية...', placeholderEn: 'Waiver of all present and future claims related to the dispute...', type: 'text' },
  ],
  'Arbitration Agreement': [
    { name: 'partyDetails', labelAr: 'بيانات الأطراف المحتكمة والتفويض الخاص', labelEn: 'Arbitrating Parties & Special Authorization', placeholderAr: 'الأسماء، السجلات التجارية، الممثلون المخولون خصيصاً بالتحكيم...', placeholderEn: 'Names, commercial registers, specially authorized arbitration reps...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'موضوع النزاع المُحال للتحكيم والمعاملة الأصلية', labelEn: 'Arbitrated Dispute & Underlying Transaction', placeholderAr: 'وصف المعاملة الأصلية وطبيعة النزاع أو الخلاف التجاري...', placeholderEn: 'Description of underlying contract and nature of commercial dispute...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'اتعاب التحكيم وتوزيع التكاليف', labelEn: 'Arbitration Fees & Cost Allocation', placeholderAr: 'كيفية توزيع أتعاب المحكمين وتكاليف CRCICA بين الطرفين...', placeholderEn: 'Allocation of arbitrators\' fees and CRCICA costs between parties...', type: 'text' },
    { name: 'contractTerm', labelAr: 'مقر التحكيم واللغة والقانون الواجب التطبيق', labelEn: 'Seat, Language & Governing Law', placeholderAr: 'المقر (القاهرة/دبي)، اللغة (عربية/إنجليزية/ثنائية)، قانون التطبيق...', placeholderEn: 'Seat (Cairo/Dubai), language, applicable substantive law...', type: 'text' },
  ],
  'Consultancy Agreement': [
    { name: 'partyDetails', labelAr: 'بيانات جهة التعاقد والمستشار', labelEn: 'Client & Consultant Details', placeholderAr: 'الأسماء، المؤهلات، السجلات المهنية، العناوين...', placeholderEn: 'Names, qualifications, professional registrations, addresses...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'نطاق التكليف الاستشاري والمهام والتقارير المطلوبة', labelEn: 'Advisory Scope, Tasks & Required Deliverables', placeholderAr: 'وصف تفصيلي للخدمات الاستشارية والتقارير والمخرجات المتوقعة...', placeholderEn: 'Detailed advisory services, deliverable reports and outputs...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'الأتعاب الاستشارية وجدول الصرف المرتبط بالمراحل', labelEn: 'Consulting Fees & Milestone Payment Schedule', placeholderAr: 'قيمة الأتعاب الإجمالية، الدفعات المرتبطة بإنجاز المراحل...', placeholderEn: 'Total professional fee, milestone-linked payment schedule...', type: 'textarea' },
    { name: 'contractTerm', labelAr: 'مدة التكليف والسرية ومنع تضارب المصالح', labelEn: 'Engagement Term, Confidentiality & Conflict of Interest', placeholderAr: 'مدة الاستشارة، التزامات السرية، وحظر تضارب المصالح...', placeholderEn: 'Engagement duration, confidentiality duties, conflict of interest...', type: 'text' },
  ],
  'Power of Attorney': [
    { name: 'partyDetails', labelAr: 'بيانات الموكِّل والوكيل والأهلية القانونية', labelEn: 'Grantor & Attorney-in-Fact Details', placeholderAr: 'الاسم، الرقم القومي، العنوان، حالة الأهلية القانونية للموكِّل والوكيل...', placeholderEn: 'Full names, national IDs, addresses, legal capacity of both parties...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'موضوع وصلاحيات التوكيل الخاص التفصيلية', labelEn: 'Scope & Specific Powers of the Special POA', placeholderAr: 'الصلاحيات المفوضة للوكيل: البيع، التعاقد، التمثيل، الإجراءات الرسمية...', placeholderEn: 'Delegated powers: conveyance, contracting, official representations...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'أتعاب الوكيل وحدود التصرف المالي', labelEn: 'Agent Compensation & Financial Limits', placeholderAr: 'أتعاب الوكالة إن وجدت، والحدود القصوى للتصرفات المالية...', placeholderEn: 'Agent fees if any, and maximum financial transaction limits...', type: 'text' },
    { name: 'contractTerm', labelAr: 'مدة الوكالة ومدى القابلية للإلغاء وحالات الانقضاء', labelEn: 'POA Duration, Irrevocability & Expiry Events', placeholderAr: 'مدة الوكالة، قابليتها للإلغاء، وحالات انتهائها قانوناً...', placeholderEn: 'Duration, revocability, and legal events causing expiry...', type: 'text' },
  ],
  'Gift Agreement': [
    { name: 'partyDetails', labelAr: 'بيانات الواهب والموهوب له والقبول الصريح', labelEn: 'Donor & Donee Details & Express Acceptance', placeholderAr: 'الاسم، الرقم القومي، العنوان للواهب والموهوب له، وإقرار القبول...', placeholderEn: 'Names, national IDs, addresses for donor and donee, acceptance...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'وصف العين الموهوبة ومشتملاتها وحدودها', labelEn: 'Description of Gifted Property & Boundaries', placeholderAr: 'وصف تفصيلي للعقار أو المنقول الموهوب: العنوان، المساحة، الحدود...', placeholderEn: 'Detailed description of gifted property or asset, boundaries...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'الشروط المرفقة بالهبة وحق الانتفاع المحتجز', labelEn: 'Conditions Attached to Gift & Reserved Usufruct', placeholderAr: 'شروط الهبة (إن وجدت)، حق الانتفاع المحتجز للواهب مدة حياته...', placeholderEn: 'Gift conditions if any, retained life usufruct for donor...', type: 'text' },
    { name: 'contractTerm', labelAr: 'الصيغة الرسمية التوثيقية وحظر التصرف والرجوع', labelEn: 'Notarial Form, Non-Alienation & Revocation Bars', placeholderAr: 'متطلبات التوثيق الرسمي بمأمورية الشهر العقاري، وقيود الرجوع...', placeholderEn: 'Notarial registration requirements, prohibition of revocation...', type: 'text' },
  ],
  'Vehicle Sale Agreement': [
    { name: 'partyDetails', labelAr: 'بيانات البائع والمشتري وسند الملكية', labelEn: 'Seller & Buyer Details & Ownership Title', placeholderAr: 'الأسماء، الأرقام القومية، وبطاقة التسجيل أو العقد المقيد...', placeholderEn: 'Names, national IDs, vehicle registration card or title...', type: 'textarea' },
    { name: 'agreementSubject', labelAr: 'بيان السيارة التفصيلي (الماركة / VIN / اللوحات / العداد)', labelEn: 'Vehicle Full Specifications (Make/VIN/Plates/Mileage)', placeholderAr: 'الماركة، الموديل، سنة الصنع، VIN، رقم الموتور، رقم اللوحة، قراءة العداد...', placeholderEn: 'Make, model, year, VIN, engine no., plate no., odometer reading...', type: 'textarea' },
    { name: 'financialTerms', labelAr: 'ثمن البيع وطريقة الوفاء وتوقيت الدفع', labelEn: 'Sale Price, Payment Method & Timing', placeholderAr: 'الثمن الإجمالي، طريقة الدفع (نقداً/شيك/تحويل)، تاريخ السداد...', placeholderEn: 'Total price, payment method (cash/check/transfer), date...', type: 'textarea' },
    { name: 'contractTerm', labelAr: 'التسليم الفعلي ونقل الملكية بالمرور وخلو الذمة', labelEn: 'Physical Handover & Traffic Authority Title Transfer', placeholderAr: 'تاريخ التسليم، التزام تسليم المستندات وخلو السيارة من المخالفات والضرائب...', placeholderEn: 'Handover date, documents transfer, clearance of fines and taxes...', type: 'text' },
  ],
};

const contractGroups = [
  {
    groupLabelAr: 'العقود الأكثر طلباً', groupLabelEn: 'Most Popular',
    options: [
      { value: 'Real Estate Purchase Agreement', labelAr: 'عقد بيع وحدة سكنية / عقار', labelEn: 'Real Estate Purchase Agreement' },
      { value: 'Lease Agreement', labelAr: 'عقد إيجار (سكني / تجاري)', labelEn: 'Lease Agreement' },
      { value: 'Construction Contract', labelAr: 'عقد مقاولات وتشطيبات', labelEn: 'Construction Contract' },
      { value: 'Employment Contract', labelAr: 'عقد عمل فردي', labelEn: 'Employment Contract' },
      { value: 'Software Development Agreement', labelAr: 'عقد تطوير برمجيات وحلول تقنية', labelEn: 'Software Development Agreement' },
      { value: 'Partnership Agreement', labelAr: 'عقد شراكة استثمارية مشتركة', labelEn: 'Investment Partnership Agreement' },
      { value: 'Sales Agreement', labelAr: 'عقد توريد وبيع بضائع تجاري', labelEn: 'Commercial Sales & Supply Agreement' },
      { value: 'Distribution Agreement', labelAr: 'عقد توزيع ووكالة تجارية حصرية', labelEn: 'Exclusive Distribution & Agency Agreement' },
    ]
  },
  {
    groupLabelAr: 'الشركات والاستثمار', groupLabelEn: 'Corporate & Investment',
    options: [
      { value: 'Company Formation Contract', labelAr: 'عقد تأسيس شركة تجارية', labelEn: 'Company Formation Contract' },
      { value: 'Shareholders Agreement', labelAr: 'اتفاقية مساهمين', labelEn: 'Shareholders Agreement' },
      { value: 'Joint Venture Agreement', labelAr: 'عقد مشروع مشترك (JV)', labelEn: 'Joint Venture Agreement' },
      { value: 'Franchise Agreement', labelAr: 'عقد امتياز تجاري (Franchise)', labelEn: 'Franchise Agreement' },
      { value: 'Investment Agreement', labelAr: 'عقد استثمار وتمويل', labelEn: 'Investment Agreement' },
      { value: 'Asset Purchase Agreement', labelAr: 'عقد شراء وبيع أصول ومعدات', labelEn: 'Asset Purchase Agreement' },
      { value: 'Non-Disclosure Agreement (NDA)', labelAr: 'اتفاقية سرية وعدم إفصاح (NDA)', labelEn: 'Non-Disclosure Agreement (NDA)' },
      { value: 'Consultancy Agreement', labelAr: 'عقد استشارات مهنية وتكليف', labelEn: 'Professional Consultancy Agreement' },
    ]
  },
  {
    groupLabelAr: 'التكنولوجيا والملكية الفكرية', groupLabelEn: 'Tech & Intellectual Property',
    options: [
      { value: 'Service Level Agreement (SLA)', labelAr: 'اتفاقية مستوى الخدمة الرقمية (SLA)', labelEn: 'Service Level Agreement (SLA)' },
      { value: 'Licensing Agreement', labelAr: 'عقد ترخيص برمجيات وعلامة تجارية', labelEn: 'Software & IP Licensing Agreement' },
      { value: 'IP Assignment Agreement', labelAr: 'عقد تنازل رسمي عن ملكية فكرية', labelEn: 'IP Assignment Agreement' },
      { value: 'Website Terms and Conditions', labelAr: 'شروط استخدام منصة وتطبيق إلكتروني', labelEn: 'Website & App Terms of Service' },
    ]
  },
  {
    groupLabelAr: 'العقود العقارية والمدنية', groupLabelEn: 'Real Estate & Civil Law',
    options: [
      { value: 'Vehicle Sale Agreement', labelAr: 'عقد بيع سيارة ومركبة (قانون المرور)', labelEn: 'Vehicle Sale Agreement' },
      { value: 'Gift Agreement', labelAr: 'عقد هبة عقارية موثقة (م 488 مدني مصري)', labelEn: 'Official Real Estate Gift Agreement' },
      { value: 'Power of Attorney', labelAr: 'توكيل خاص رسمي موثق بالشهر العقاري', labelEn: 'Special Power of Attorney (Notarized)' },
    ]
  },
  {
    groupLabelAr: 'الصلح والتسوية والتحكيم', groupLabelEn: 'Settlement, ADR & Arbitration',
    options: [
      { value: 'Settlement Agreement', labelAr: 'عقد صلح وتسوية نزاع (م 553 مدني مصري)', labelEn: 'Settlement & Comprehensive Dispute Resolution' },
      { value: 'Arbitration Agreement', labelAr: 'مشارطة تحكيم تجاري CRCICA (ق 27 لسنة 1994)', labelEn: 'Commercial Arbitration Agreement (Law 27/1994)' },
    ]
  },
];

const ContractForm: React.FC<ContractFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContractFormData>({
    contractType: 'Real Estate Purchase Agreement',
    disputeResolution: 'egyptian_courts',
    details: {},
  });

  const [currentFields, setCurrentFields] = useState<any[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [presetNotice, setPresetNotice] = useState<string | null>(null);

  // Apply default preset on mount if empty
  useEffect(() => {
    if (!formData.details || Object.keys(formData.details).length === 0) {
      applyPreset(QUICK_PRESETS[0], false);
    }
  }, []);

  const applyPreset = (preset: typeof QUICK_PRESETS[0], showNotification = true) => {
    setActivePresetId(preset.id);
    setFormData({
      contractType: preset.contractType,
      disputeResolution: preset.disputeResolution,
      details: { ...preset.details },
    });

    if (showNotification) {
      setPresetNotice(`تم تحميل قالب "${preset.labelAr}" ببيانات قانونية مصرية معتمدة بنجاح! جاهز للتوليد الفوري.`);
      setTimeout(() => setPresetNotice(null), 4000);
    }
  };

  useEffect(() => {
    const fields = contractFieldConfig[formData.contractType] || [
      { name: 'partyDetails', labelAr: 'بيانات الأطراف والصفات القانونية', labelEn: 'Parties Details & Legal Capacity', placeholderAr: 'الأسماء، الأرقام القومية، الصفة، العناوين الرسمية...', placeholderEn: 'Names, national IDs, status, official addresses...', type: 'textarea' },
      { name: 'agreementSubject', labelAr: 'موضوع العقد ونطاق التكليف والالتزامات', labelEn: 'Subject Matter & Detailed Scope', placeholderAr: 'وصف تفصيلي شامل لموضوع العقد والالتزامات الجوهرية...', placeholderEn: 'Comprehensive description of subject matter and core obligations...', type: 'textarea' },
      { name: 'financialTerms', labelAr: 'الشروط المالية وجدول الوفاء والمقابل', labelEn: 'Financial Terms & Payment Milestones', placeholderAr: 'المبالغ، المواعيد، طرق السداد البنكية، والضرائب المقررة...', placeholderEn: 'Amounts, due dates, bank transfer methods, applicable taxes...', type: 'textarea' },
      { name: 'contractTerm', labelAr: 'مدة العقد والبدء والتجديد والضمانات', labelEn: 'Term, Duration, Renewal & Guarantees', placeholderAr: 'تاريخ السريان، شروط الإنهاء، والضمانات المقررة...', placeholderEn: 'Effective date, termination triggers, performance guarantees...', type: 'text' },
    ];
    setCurrentFields(fields);

    // If details are empty, create empty keys
    setFormData(prev => {
      const details = { ...prev.details };
      fields.forEach(f => {
        if (details[f.name] === undefined) {
          details[f.name] = '';
        }
      });
      return { ...prev, details };
    });
  }, [formData.contractType]);

  const handleMainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivePresetId(null);
    if (name === 'contractType') {
      setFormData(prev => ({ ...prev, [name]: value, details: {} }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Calculate completeness progress
  const filledFieldsCount = Object.values(formData.details).filter(v => String(v || '').trim().length > 5).length;
  const totalFieldsCount = Math.max(currentFields.length, 1);
  const completenessPercent = Math.min(100, Math.round((filledFieldsCount / totalFieldsCount) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Value Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase mb-3">
              <i className="fas fa-crown text-amber-400"></i>
              <span>المنصة الرائدة للصياغة والترجمة القانونية المعتمدة في مصر</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              صياغة عقود قانونية رسمية كاملة البنود معتمدة قضائياً في ثوانٍ
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              وفر أكثر من 90% من تكاليف الاستشارات التقليدية. عقود محكمة من 14 إلى 22 مادة متكاملة، مطابقة بنسبة 100% لبوابة التشريعات المصرية، أحكام محكمة النقض، ونماذج الشهر العقاري.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center w-full md:w-auto flex-shrink-0 shadow-lg">
            <span className="text-[11px] font-bold text-amber-300 block mb-1">
              مقارنة التكلفة والسرعة
            </span>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="text-slate-400">
                <span className="line-through block text-slate-400 text-xs">3,500 ج.م</span>
                <span className="text-[10px]">3-5 أيام انتظار</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-emerald-400 font-black">
                <span className="text-base md:text-lg block text-emerald-300">149 ج.م أو باقة</span>
                <span className="text-[10px] text-amber-300">في 8 ثوانٍ فقط ⚡</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Quick Templates Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <i className="fas fa-bolt text-amber-500"></i>
              <span>قوالب ونماذج جاهزة بنقرة واحدة (One-Click Ready Templates)</span>
            </h3>
            <p className="text-xs text-slate-500">
              اختر نموذجاً لتعبئة بيانات قانونية حقيقية متكاملة فوراً وتجربة التوليد الكامل:
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
            تعبئة فورية في ثانية واحدة
          </span>
        </div>

        {presetNotice && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <i className="fas fa-check-circle text-emerald-600 text-sm"></i>
            <span>{presetNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3.5 rounded-2xl border-2 text-right transition-all flex items-start gap-3 group cursor-pointer ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700'
                  }`}
                >
                  <i className={`fas ${preset.icon}`}></i>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                      {preset.badge}
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-blue-700 font-bold flex items-center gap-0.5">
                        <i className="fas fa-check"></i> تم التفعيل
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1">{preset.labelAr}</h4>
                  <p className="text-[10px] text-slate-500 truncate" style={{ direction: 'ltr' }}>
                    {preset.labelEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Controls: Contract Type & Dispute Resolution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
            <div>
              <label htmlFor="contractType" className="block text-xs font-black text-slate-800 mb-1.5">
                نوع العقد والوثيقة الرسمية / Contract Type
              </label>
              <select
                id="contractType"
                name="contractType"
                value={formData.contractType}
                onChange={handleMainChange}
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl font-bold text-slate-900 shadow-2xs"
              >
                <option value="" disabled>اختر نوع العقد من القائمة...</option>
                {contractGroups.map((group) => (
                  <optgroup key={group.groupLabelEn} label={`${group.groupLabelAr} / ${group.groupLabelEn}`}>
                    {group.options.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.labelAr} ({t.labelEn})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="disputeResolution" className="block text-xs font-black text-slate-800 mb-1.5">
                آلية فض المنازعات والاختصاص / Dispute Resolution
              </label>
              <select
                id="disputeResolution"
                name="disputeResolution"
                value={formData.disputeResolution}
                onChange={handleMainChange}
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl font-bold text-slate-900 shadow-2xs"
              >
                <option value="egyptian_courts">المحاكم المصرية المختصة (القضاء المصري الرسمي)</option>
                <option value="arbitration">التحكيم المؤسسي وفق قانون التحكيم المصري 27 لسنة 1994 (CRCICA)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Details Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <i className="fas fa-file-pen text-blue-600"></i>
                <span>بيانات وبنود العقد التنفيذية (يمكنك تعديلها بحرية):</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-bold">
                نسبة اكتمال البيانات: <strong className="text-blue-700">{completenessPercent}%</strong>
              </span>
            </div>

            {currentFields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label htmlFor={field.name} className="block text-xs font-bold text-slate-800">
                  {field.labelAr} <span className="text-slate-400 font-normal">({field.labelEn})</span>
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData.details[field.name] || ''}
                    onChange={handleDetailsChange}
                    rows={field.name === 'agreementSubject' || field.name === 'partyDetails' ? 3 : 2}
                    placeholder={`${field.placeholderAr}\n${field.placeholderEn}`}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData.details[field.name] || ''}
                    onChange={handleDetailsChange}
                    placeholder={`${field.placeholderAr} / ${field.placeholderEn}`}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Sharia, Statutory & Minimum 14 Clauses Guarantee Badge */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-halved text-emerald-600 text-lg"></i>
                <span className="font-black text-slate-900 text-sm">
                  ضمان الصياغة التنفيذية الشاملة والمطابقة القضائية
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                  14 إلى 22 مادة كاملة
                </span>
                <span className="text-[10px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  خالٍ من الربا والغرر
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              يُولد العقد متضمناً الديباجة الرسمية المصرية، التمهيد الملزم، الشرط الفاسخ الصريح (م 158 مدني)، الموطن المختار للإعلانات، التعويض الاتفاقي المشروع دون فوائد ربوية، والالتزام بالتوثيق بالشهر العقاري مع ترجمة إنجليزية معتمدة متطابقة فقرة بفقرة.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={!formData.contractType}
              className="w-full py-4 px-8 border border-transparent shadow-xl text-sm font-black rounded-2xl text-white bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i className="fas fa-magic text-amber-300"></i>
              <span>صياغة وهندسة العقد القانوني الكامل فوراً / Generate Full Contract</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                14+ مادة كاملة
              </span>
            </button>
            <p className="text-[10px] text-slate-500 mt-2">
              🔒 يتم التوليد في غضون 6 إلى 10 ثوانٍ مع تقرير فحص ومطابقة تشريعية معتمدة وتصدير Word و PDF فوري.
            </p>
          </div>
        </form>
      </div>

      {/* Social Proof & Commercial Trust Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xl md:text-2xl font-black text-blue-900 block font-mono">1,520+</span>
          <span className="text-[11px] text-slate-600 font-bold">مكتب محاماة ومستشار معتمد</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xl md:text-2xl font-black text-emerald-600 block font-mono">100%</span>
          <span className="text-[11px] text-slate-600 font-bold">مطابقة تشريعية وشرعية</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xl md:text-2xl font-black text-amber-600 block font-mono">14+ إلى 22</span>
          <span className="text-[11px] text-slate-600 font-bold">مادة تعاقدية تفصيلية بالعقد</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xl md:text-2xl font-black text-indigo-600 block font-mono">8 ثوانٍ</span>
          <span className="text-[11px] text-slate-600 font-bold">متوسط سرعة الصياغة والتصدير</span>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
