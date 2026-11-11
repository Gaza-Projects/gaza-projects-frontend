# Gaza Projects Frontend

أساس مشروع الواجهة باستخدام Next.js App Router وJavaScript وTailwind CSS وnext-intl.

## المتطلبات والتشغيل

Node.js 22 أو أحدث وnpm. استخدم الإصدار المثبت في lockfile عند التعاون.

```powershell
npm ci
npm run dev
```

افتح http://localhost:3000/ar أو http://localhost:3000/en.
في الجهاز الحالي، إذا لم يكن npm موجودًا في PATH، يوجد مساعد محلي غير متتبع في Git:

```powershell
.\.tools\npm.cmd run dev
```

المساعد يستخدم Node المتوفر محليًا ولا يُرفع إلى المستودع. لأي جهاز آخر ثبّت Node.js مع npm.

## التحقق

```powershell
npm run lint
npm run build
npm test
```

الاختبارات تشغّل نسخة الإنتاج مؤقتًا على منفذ محلي متاح ثم توقفها. يجب بناء المشروع أولًا. تختبر تحويل اللغة من المتصفح والكوكي، وأولوية اللغة الصريحة، واتجاه HTML والترجمة، وحفظ الاختيار وquery parameters، و404 للرابط غير الموجود.

## اللغات

- /ar: العربية وRTL، و/en: الإنجليزية وLTR.
- الرابط الصريح أولًا، ثم اختيار اللغة المحفوظ، ثم لغة المتصفح. الإنجليزية للغات غير المدعومة.
- كوكي اللغة يبقى سنة. زر اللغة يحتفظ بمعاملات الرابط.
- src/messages/ar.json وen.json للنصوص؛ src/i18n لإعداد الترجمة والتنقل.
- صفحة البداية صفحة تحقق مؤقتة. التصميم النهائي والشاشات تنتظر GP-304 والـwireframes المعتمدة.
- الخط النظامي مؤقت؛ لا اعتماد على تحميل خط خارجي أثناء البناء.

## التنظيم

- src/app/[locale]: الصفحات وlayout.
- src/components/ui وlayout: المكونات المشتركة.
- src/features: auth وprofile وprojects وuploads وteams وnotifications وnotes وreports وworkshops وadmin.
- src/lib/api وvalidation وconfig: أماكن التكامل والتحقق والإعدادات عند تنفيذ الميزات.
- src/hooks: hooks مشتركة؛ src/styles/globals.css: Tailwind وtokens مؤقتة.
- public: الأصول الثابتة. المجلدات الفارغة تتضمن .gitkeep لحفظ الهيكل.

لا توجد وظائف أو صفحات منتج وهمية داخل مجلدات الميزات. تم تثبيت React Hook Form وZod وresolvers للاستخدام عند بناء النماذج.

## البيئة والتكامل

انسخ .env.example إلى .env.local عند الحاجة. القيم فيه أمثلة فقط؛ لم يتم الاتصال بباك حقيقي. لا تضع أسرارًا داخل متغيرات NEXT_PUBLIC_*. أسماء المتغيرات وعقود API تُنسق مع الباك عند تنفيذ الميزات.

## حدود هذا التجهيز

الاستضافة مؤجلة لصاحب المشروع. لم يُضف إعداد Vercel أو Cloudflare ولم تتغير خصوصية الريبو. الجلسات والإيميل وقاعدة البيانات ورفع الصور الفعلي غير منفذة هنا. مرجع المتطلبات PRD.md في gaza-projects-docs والخطة في technical/frontend-plan.md. إعداد توفير البيانات جزء من الخطة ويُنفذ مع واجهة الإعدادات لاحقًا.
