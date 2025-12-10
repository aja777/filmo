# راهنمای ساخت اپلیکیشن اندروید (WebView)

این پوشه حاوی کدهای لازم برای ساخت اپلیکیشن اندروید سایت `kiamovie.ir` با استفاده از اندروید استودیو است.

## مراحل نصب:

1. **Android Studio** را باز کنید.
2. روی **New Project** کلیک کنید.
3. گزینه **Empty Views Activity** را انتخاب کنید و **Next** را بزنید.
4. تنظیمات زیر را وارد کنید:
   - **Name:** KiaMovie
   - **Package name:** com.kiamovie.app
   - **Language:** Kotlin
   - **Minimum SDK:** API 24 (Android 7.0) یا بالاتر
5. روی **Finish** کلیک کنید و صبر کنید تا پروژه ساخته شود.

## جایگذاری کدها:

بعد از ساخته شدن پروژه، فایل‌های داخل این پوشه را در مسیرهای مربوطه در پروژه خود کپی کنید:

1. محتویات `AndroidManifest.xml` را در مسیر `app/src/main/AndroidManifest.xml` جایگزین کنید.
2. محتویات `activity_main.xml` را در مسیر `app/src/main/res/layout/activity_main.xml` جایگزین کنید.
3. محتویات `MainActivity.kt` را در مسیر `app/src/main/java/com/kiamovie/app/MainActivity.kt` جایگزین کنید.
4. رنگ‌های تم را در `res/values/themes.xml` بررسی کنید تا `NoActionBar` باشد (یا از کدهای MainActivity برای مخفی کردن آن استفاده شده است).

## ویژگی‌ها:
- بارگذاری سایت kiamovie.ir
- قابلیت بازگشت به صفحه قبل با دکمه Back گوشی
- پشتیبانی از آپلود فایل و دوربین (در صورت نیاز سایت)
- اسپلش اسکرین ساده (زمینه مشکی هنگام لود)
