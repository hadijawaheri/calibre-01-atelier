# کرونوس، دانشنامهٔ ساعت

مرجع فارسی ساعت‌های مچی، به سبک Fragrantica برای دنیای عطر: صفحهٔ هر مدل با مشخصات دقیق، صفحهٔ هر کالیبر، تاریخچهٔ
برندها و (در فاز بعد) نقد و امتیاز کاربران. قلب سایت **آزمایشگاه موومنت** است: موومنت‌های واقعی به‌صورت سه‌بعدی
(three.js) قطعه‌به‌قطعه باز می‌شوند و هر قطعه توضیح داده می‌شود.

ساختار و قواعد کد از PROJECT_BLUEPRINT_SHADCN.md پیروی می‌کند؛ خلاصه‌اش در [CLAUDE.md](./CLAUDE.md) و تصمیم‌ها در
[docs/adr](./docs/adr) است.

## ساختار

| مسیر                 | چیست                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- |
| `apps/web`           | Next.js 16 روی پورت 7782، shadcn/ui راست‌به‌چپ، motion، three.js با React Three Fiber |
| `apps/api`           | NestJS روی پورت 7781 با MongoDB؛ برای ورود کاربران و بخش جامعه در فازهای بعد          |
| `packages/contracts` | schemaهای Zod مشترک میان API و وب                                                     |
| `infra`              | PM2، Caddy و docker-compose برای MongoDB محلی                                         |

## صفحهٔ اول

صفحهٔ اول یک داستان اسکرولی است (ADR 0006). موومنت واقعی، که از عکس‌هایش با rembg جدا شده
(`apps/web/public/media/movement-cutout`)، در لایه‌ای ثابت بین بخش‌ها سفر می‌کند: کنار متن کوچک می‌شود، روی لبه
می‌ایستد، برمی‌گردد تا سمت صفحه را نشان دهد و به فیلم تحویل داده می‌شود. هر بخش با `data-stage` جای ایستگاه
موومنت را مشخص می‌کند و ژست‌ها در `movement-flight.tsx` تعریف شده‌اند. اسکرول صفحهٔ اول با Lenis نرم و
اینرسی‌دار است.

فیلم واقعی باز و بسته شدن موومنت با اسکرول جلو و عقب می‌رود. فیلم به ۲۴۰ فریم WebP در دو اندازه تبدیل شده
(`apps/web/public/media/movement-film`) و روی canvas کشیده می‌شود. بعد از آن نوار افقی عکس‌ها، نمودار
تایم‌گرافر، نقشهٔ چرخ‌دنده‌ها که به O واژهٔ KRONOS تبدیل می‌شود و مقایسهٔ چهار خانواده می‌آیند. فریم‌ها با این
دستور از فایل ویدیو ساخته می‌شوند:

```bash
ffmpeg -i film.mp4 -vf scale=1280:-2 -c:v libwebp -quality 72 public/media/movement-film/lg/%03d.webp
ffmpeg -i film.mp4 -vf scale=720:-2 -c:v libwebp -quality 72 public/media/movement-film/sm/%03d.webp
```

## آزمایشگاه موومنت

- چهار خانواده: اتوماتیک استاندارد (ETA 2824-2 / Sellita SW200)، فوق‌باریک، کوارتز و توربیون؛ هر کدام با سازوکار،
  مشخصات و ساعت‌هایی که از آن استفاده می‌کنند.
- قطعه‌ها با اسلایدر یا دکمهٔ «نمایش باز و بسته شدن» جدا می‌شوند؛ صحنه مثل فیلم‌های مرجع از استودیوی روشن به تاریک
  می‌رود. زمان را می‌شود کند یا متوقف کرد و مسیر انرژی را دید.
- سینماتیک موومنت واقعی است: ۲۸٬۸۰۰ ضربه در ساعت، نسبت دندانه‌های قطار چرخ‌دنده و دامنهٔ بالانس
  (`apps/web/src/features/movement/kinematics.ts`).

### افزودن مدل CAD واقعی

```bash
cd apps/web
node scripts/step-to-glb.mjs movement.stp public/models/<slug>.glb --deflection 0.004 --simplify 0.5
```

هر قطعهٔ فایل STEP یک گره جدا با نام خودش می‌ماند. بعد در `src/features/movement/calibres.ts` برای آن کالیبر `cad`
تعریف می‌شود: نشانی فایل و قاعده‌هایی که نام قطعه‌های CAD را به قطعه‌های آزمایشگاه، لایهٔ باز شدن، جنس و چرخش
نگاشت می‌کنند (`src/features/movement/three/cad-model.ts`). تا وقتی `cad` نباشد، کالیبرهای دارای مدل از مدل موقت
استفاده می‌کنند و بقیه فقط اطلاعاتشان را نشان می‌دهند.

## راه‌اندازی محلی

ساده‌ترین راه، بدون Docker و بدون دیتابیس جدا (روی ویندوز هم کار می‌کند):

```bash
pnpm install
pnpm dev:all                  # MongoDB داخلی + seed + API + وب ← http://localhost:7782
```

`dev:all` فایل `apps/api/.env` را اگر خالی باشد پر می‌کند، یک MongoDB replica set داخلی روی 27018 بالا می‌آورد
(داده‌ها در پوشه‌ی `.data` می‌مانند) و کد ورود همیشه `123456` است؛ شماره‌ی `09120000000` مدیر است.

راه کامل با دیتابیس خودتان:

```bash
nvm use                       # Node 22
corepack enable
pnpm install
docker compose -f infra/docker-compose.yml up -d    # MongoDB به‌صورت replica set روی 27018
cp apps/api/.env.example apps/api/.env              # دو secret را با openssl rand -base64 48 پر کنید
cp apps/web/.env.example apps/web/.env.local
pnpm seed                     # دسترسی مدیر برای SEED_ADMIN_MOBILE
pnpm dev                      # http://localhost:7782
```

در حالت توسعه کد ورود در لاگ API چاپ می‌شود (یا اگر `OTP_FIXED_CODE` را بدهید، همان کد است). هر دو در
`NODE_ENV=production` ممنوع‌اند و اپ بدون سرویس پیامک واقعی بالا نمی‌آید.

ایندکس‌های دیتابیس در production با `pnpm --filter @kronos/api migrate` ساخته می‌شوند (`scripts/deploy.sh` این را
خودش اجرا می‌کند). کامپوننت‌های shadcn با سبک `new-york` و RTL هستند (`apps/web/components.json`، ADR 0003).

## بررسی

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm --filter @kronos/web test:e2e    # Playwright روی سایت در حال اجرا (http://localhost:7782)
```

## استقرار

`scripts/deploy.sh` روی سرور: نصب، بیلد و reload با PM2؛ Caddy جلوی وب است و TLS را خودکار می‌گیرد. جزئیات در بخش
۱۳ بلوپرینت و `infra/`.

پیش از اولین استقرار باید یک `SmsProvider` و یک `PaymentProvider` واقعی (مثلاً زرین‌پال) پیاده شوند.
