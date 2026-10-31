# CLAUDE.md — حافظه‌ی دائمی پروژه

> این فایل در ابتدای هر جلسه‌ی Claude Code خوانده می‌شود. قبل از هر کار، بخش «وضعیت پروژه» را بخوان و مرحله‌ی فعلی را اعلام کن.

## وضعیت پروژه

- **نام پروژه:** کرونوس، دانشنامه‌ی ساعت (`calibre-01-atelier`)
- **هدف نهایی:** وب روی Vercel با دامنه‌ی پیش‌فرض (`https://calibre-01-atelier.vercel.app`) و API روی سرور هادی پشت Caddy (پورت 7771 فقط روی `127.0.0.1`)
- **مرحله‌ی فعلی:** ۵. استقرار (نیمه‌کاره). وب آنلاین است: آخرین commit شاخه‌ی اصلی (`75db5ca`) روی Vercel در حالت production و READY است و صفحه‌ی اول ۲۰۰ می‌دهد. API هنوز روی سرور بالا نیامده؛ اجرای `scripts/server/deploy-apis.sh` در `ruflo-hq` با هادی است.
- **مرحله‌ی بعدی:** ۶. نگهداری، بعد از بالا آمدن API و Redeploy پروژه‌ی Vercel.
- **آخرین به‌روزرسانی:** 2026-10-31
- **تصمیم‌های باز:**
  - کرونوس هنوز ارائه‌دهنده‌ی ملی‌پیامک ندارد؛ تا آن ساخته و روشن نشود کسی نمی‌تواند وارد شود و نظر بدهد.
  - باز شدن سایت روی Vercel از داخل ایران بدون VPN هنوز تست نشده است.
  - زمان اجرای اسکریپت سرور با هادی.
- **تصمیم‌های ثبت‌شده:**
  - سایت مرجع ساعت است، نه فروشگاه (ADR 0005). API فقط برای حساب کاربری و نظرها نگه داشته شده.
  - وب روی Vercel، API روی سرور مشترک با شجره‌نامه (تصمیم هادی، ۷ آبان)؛ نقشه در `plans/apis-server.md` ریپوی `ruflo-hq`.
  - API با ۱ worker و بدون Redis اجرا می‌شود تا محدودیت OTP دقیق باشد (PR #13).
  - هر نظر کاربر پیش از نمایش تأیید مدیر لازم دارد (`/admin/reviews`، PR #8 و #10).
  - CSP فعلاً report-only با nonce برای هر درخواست (PR #11).
  - تا ملی‌پیامک، API با `SMS_PROVIDER=disabled` بالا می‌آید (PR #9).

### مراحل پروژه (به ترتیب)

0. **آماده‌سازی:** ریپو، گیت، محیط توسعه و دسترسی‌ها
1. **برنامه‌ریزی:** نیازمندی‌ها، معماری، ویژگی‌های نهایی
2. **راه‌اندازی محیط:** وابستگی‌ها، متغیرهای محیطی، اجرای لوکال
3. **ساخت:** پیاده‌سازی ویژگی‌ها به ترتیب اولویت
4. **کیفیت:** تست، لینت، بررسی امنیت، دیباگ
5. **استقرار:** انتخاب محل، CI/CD، دامنه، SSL، مانیتورینگ
6. **نگهداری:** باگ‌ها، به‌روزرسانی وابستگی‌ها، پشتیبان‌گیری

## نحوه‌ی کار

- در شروع هر جلسه: مرحله‌ی فعلی را بگو، بگو چه چیزی در جلسه‌ی قبل تمام شد، و **۱ تا ۳ سؤال مشخص** درباره‌ی گام بعدی بپرس تا پروژه به استقرار کامل برسد.
- قبل از رفتن به مرحله‌ی بعد، مطمئن شو که شروط مرحله‌ی فعلی برآورده شده‌اند (مثلاً برای رفتن به «استقرار» باید تست‌ها سبز باشند و محیط لوکال کار کند).
- بعد از هر تغییر در مرحله، یا وقتی تصمیم مهمی گرفته شد، همین بخش «وضعیت پروژه» را به‌روز کن. فقط آنچه واقعاً انجام شده یا تأیید شده را بنویس.
- بدون تأیید صریح کاربر، کد را روی شاخه‌ی اصلی push نکن، چیزی را منتشر یا حذف نکن، و هزینه‌ای ایجاد نکن (سرور، دامنه، سرویس ابری).
- اگر چیزی در وضعیت ثبت‌شده با واقعیت پروژه نمی‌خواند، قبل از ادامه همان را گزارش بده.
- مرحله‌ی همه‌ی پروژه‌ها در `projects.yaml` ریپوی `hadijawaheri/ruflo-hq` هم ثبت است و گزارش هفتگی آن را با این بخش مقایسه می‌کند. اگر مرحله را اینجا عوض کردی، در گزارش کار بگو.

## قواعد فنی

- زبان پاسخ‌ها: فارسی؛ نام‌های فنی، دستورها و کد به انگلیسی.
- کد جدید را همراه با تست یا دست‌کم دستور اجرای دستی بنویس.
- کامیت‌ها کوچک و با پیام واضح باشند.
- اسرار (کلید API، پسورد، توکن) را هرگز داخل کد یا این فایل نگذار؛ از `.env` و متغیرهای محیطی استفاده کن.
- قواعد کدنویسی همین ریپو در بخش «Agent Rules» پایین این فایل آمده است؛ برای کد و ساختار پروژه همان‌ها ملاک است.

## چک‌لیست استقرار (مرحله‌ی ۵)

- [x] ساخت موفق پروژه (`build`): در CI روی شاخه‌ی اصلی سبز است
- [x] تست‌ها سبز هستند (unit، API e2e و web e2e در CI)
- [ ] متغیرهای محیطی تولید تعریف شده‌اند: `INTERNAL_API_URL` روی Vercel گذاشته شده؛ متغیرهای API روی سرور با اجرای اسکریپت ساخته می‌شوند
- [ ] گیت‌هاب ریپو و شاخه‌ی اصلی محافظت شده است (بررسی نشده)
- [x] CI/CD فعال است (GitHub Actions، و Vercel از شاخه‌ی اصلی خودکار دیپلوی می‌کند)
- [x] محل استقرار انتخاب و تأیید شده است (وب Vercel، API سرور هادی)
- [ ] دامنه و SSL تنظیم شده‌اند: وب روی `vercel.app` آماده است؛ API هنوز نه
- [ ] پشتیبان‌گیری و مانیتورینگ/لاگ فعال است
- [ ] کاربر استقرار نهایی را تأیید کرده است

## Kronos — Agent Rules

Source of truth: PROJECT_BLUEPRINT_SHADCN.md (the project blueprint). This file is the short, always-loaded subset.

### Commands

- `pnpm dev` | `pnpm typecheck` | `pnpm lint` | `pnpm test` | `pnpm build` | `pnpm seed`
- MongoDB runs as a replica set, like production: `docker compose -f infra/docker-compose.yml up -d`
- Production indexes come from `apps/api/migrations` (`pnpm --filter @kronos/api migrate`); add a migration with every schema index
- API e2e tests start an in-memory Mongo replica set. Offline, point them at a local binary:
  `MONGOMS_SYSTEM_BINARY=$(which mongod) MONGOMS_SYSTEM_BINARY_VERSION_CHECK=false pnpm test`
- Web e2e: `pnpm --filter @kronos/web build`, run `node .next/standalone/apps/web/server.js` (no API or DB needed), then `pnpm --filter @kronos/web test:e2e`
- Use pnpm only. The lockfile is committed. TypeScript and ESLint are pinned in the pnpm catalog on purpose.

### Architecture

- apps/api (NestJS :7781, ESM, relative imports with `.js`), apps/web (Next :7782), packages/contracts (Zod, shared).
- Request/response shapes live ONLY in packages/contracts. Never redefine them in an app.
- API envelope: `{ data }` | `{ data, meta }` | `ApiErrorBody`. Never return raw documents; use mappers.
- The browser only talks to `/api/*` on the web origin (Next rewrite). Tokens are httpOnly cookies.
- The site is a watch reference (no shop, see ADR 0005). The API is kept for accounts and community features.
- 3D lives in `apps/web/src/features/movement/three`, loaded client-only. Real movements come from CAD via
  `apps/web/scripts/step-to-glb.mjs`; never ship a hand-drawn model as a real calibre.

### Code

- TS strict, no `any`, `catch (e: unknown)`. kebab-case files, named exports, no `I` prefix.
- Mongoose `@Prop` always gets an explicit `type`; values used in decorators are value imports, but CJS-only names
  that ESM cannot import by name (like mongoose `Connection`) must be `import type`.
- Comments explain WHY only. Imports are sorted by ESLint.
- `page.tsx` = routing only. `"use client"` only on leaves. Each feature exposes one `index.ts`; server fetchers live in `api.ts` / `server.ts`.

### UI (shadcn, RTL)

- Semantic tokens only. No raw colors, no `dark:` overrides, no `space-x/y`. Physical materials in the SVG artwork are the one exception.
- Logical classes only (ms/me/ps/pe/start/end); ESLint rejects physical ones. Directional icons: `rtl:rotate-180`.
- No letter-spacing on Persian text: it breaks the joins.
- Forms: FieldGroup + Field + Controller (RHF + Zod). LTR fields: `dir="ltr"` + `text-start`.
- The shadcn registry was unreachable when the project was built; components were pulled from the shadcn GitHub repo and converted with `pnpm dlx shadcn@latest migrate rtl`.

### Done means

typecheck + lint + tests actually run and green, loading/empty/error states handled, ADR for new decisions.
