# آتلیه کرونوس

فروشگاه آنلاین ساعت‌های مکانیکی لوکس، فارسی و راست‌به‌چپ. صفحه‌ی اول با انیمیشنی باز می‌شود که درِ پشت ساعت را باز
می‌کند و موتور را لایه‌به‌لایه نشان می‌دهد؛ این موتور از کالیبر واقعی **Zenith El Primero 400** (۱۹۶۹، ۳۶٬۰۰۰ ضربان در
ساعت، ۳۱ یاقوت) الهام گرفته است. کرونوس برندی ساختگی است و هیچ وابستگی‌ای به Zenith ندارد.

ساختار و قواعد کد از PROJECT_BLUEPRINT_SHADCN.md پیروی می‌کند؛ خلاصه‌اش در [CLAUDE.md](./CLAUDE.md) و تصمیم‌ها در
[docs/adr](./docs/adr) است.

## ساختار

| مسیر                 | چیست                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------- |
| `apps/api`           | NestJS 12 روی پورت 7781، MongoDB با Mongoose، ورود پیامکی (OTP) و توکن در کوکی httpOnly |
| `apps/web`           | Next.js 16 روی پورت 7782، shadcn/ui راست‌به‌چپ، TanStack Query، nuqs، motion            |
| `packages/contracts` | schemaهای Zod مشترک میان API و وب                                                       |
| `infra`              | PM2، Caddy و docker-compose برای MongoDB محلی                                           |

## امکانات

- کاتالوگ با فیلتر کلکسیون، جنس قاب و موتور، جستجو، مرتب‌سازی و صفحه‌بندی، همه در نشانی صفحه
- صفحه‌ی محصول با گالری، انتخاب بند، حکاکی پشت قاب، مشخصات فنی و داده‌ی ساختاریافته‌ی JSON-LD
- سبد خرید ماندگار، تسویه با رزرو موجودی ۳۰ دقیقه‌ای، درگاه پرداخت (در توسعه، درگاه آزمایشی)
- حساب کاربری: سفارش‌ها، پرداخت دوباره یا لغو، ویرایش مشخصات
- پنل مدیریت: سفارش‌ها و تغییر وضعیت، ساخت و ویرایش و حذف محصول
- پوسته‌ی تیره و روشن، موبایل از ۳۲۰ پیکسل، دسترس‌پذیری بررسی‌شده با axe

## راه‌اندازی محلی

```bash
nvm use                       # Node 22
corepack enable
pnpm install
docker compose -f infra/docker-compose.yml up -d    # MongoDB به‌صورت replica set روی 27018
cp apps/api/.env.example apps/api/.env              # دو secret را با openssl rand -base64 48 پر کنید
cp apps/web/.env.example apps/web/.env.local
pnpm seed                     # هشت ساعت نمونه و دسترسی مدیر برای SEED_ADMIN_MOBILE
pnpm dev                      # http://localhost:7782
```

در حالت توسعه کد ورود در لاگ API چاپ می‌شود (یا اگر `OTP_FIXED_CODE` را بدهید، همان کد است) و پرداخت به یک درگاه
آزمایشی می‌رود. هر دو در `NODE_ENV=production` ممنوع‌اند و اپ بدون پیامک و درگاه واقعی بالا نمی‌آید.

## بررسی

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm --filter @kronos/web test:e2e    # روی سایت در حال اجرا با OTP_FIXED_CODE=123456
```

## استقرار

`scripts/deploy.sh` روی سرور: نصب، بیلد و reload با PM2؛ Caddy جلوی وب است و TLS را خودکار می‌گیرد. جزئیات در بخش
۱۳ بلوپرینت و `infra/`.

پیش از اولین استقرار باید یک `SmsProvider` و یک `PaymentProvider` واقعی (مثلاً زرین‌پال) پیاده شوند.
