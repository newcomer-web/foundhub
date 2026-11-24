# FoundHub — Toshkentda topilgan va yo'qolgan buyumlar xizmati

FoundHub — Toshkent shahri bo'yicha topilgan va yo'qolgan buyumlarni qidirish, e'lon berish va haqiqiy egalariga xavfsiz qaytarish platformasi.

---

## Asosiy imkoniyatlar

### 1. E'lon berish turlari
- **Topilgan buyumlar**: Buyum topib olgan shaxs buyum holati, toifasi va taxminiy joylashuvini kiritadi.
- **Yo'qolgan buyumlar**: Buyumini yo'qotgan shaxs qidiruv e'lonini joylashtiradi va ixtiyoriy ravishda mukofot (suyunchi) belgilashi mumkin.

### 2. Maxfiylik va xavfsiz saqlash
- **Holding location himoyasi**: Topilgan buyumning aniq saqlash manzili begona foydalanuvchilarga ko'rinmaydi. U faqat e'lon egasiga hamda da'vosi tasdiqlangan shaxsga ko'rsatiladi.
- **Sirli savol orqali tekshirish**: Firibgarlikning oldini olish uchun faqat haqiqiy egasi bilishi mumkin bo'lgan belgilar (ekran rasmi, ichki belgi, stiker) so'raladi.

### 3. Hujjatlar ma'lumotlarini niqoblash (PII Masking)
- Pasport, guvohnoma yoki talabalik kartalari raqamlari avtomatik tarzda yulduzchalar bilan yashiriladi (masalan, `AB **** 45`).

### 4. Moslikni aniqlash algoritmi (Matching algorithm)
Topilgan va yo'qolgan buyumlar o'rtasida moslikni aniqlash uchun quyidagi 100 ballik ko'p omilli hisoblash qo'llaniladi:
- Toifaning mosligi: 30 ball
- Sarlavha va matndagi kalit so'zlar: 35 ball
- Geografik yaqinlik (Haversine formulasi): 25 ball
- Vaqt yaqinligi: 10 ball

Jami maksimal ball: 100 ball.

### 5. Telegram orqali ulashish
- E'lonlarni Telegram guruh va kanallarida qulay formatda ulashish uchun to'g'ridan-to'g'ri havolalar yaratiladi.

---

## Texnologik tarkib

- **Foydalanuvchi interfeysi**: Next.js 14, TypeScript, Tailwind CSS
- **Interaktiv xarita**: Leaflet va OpenStreetMap
- **Ma'lumotlar bazasi va sinxronizatsiya**: Supabase (PostgreSQL, Realtime, Row Level Security)
- **Ikonkalar**: Lucide React

---

## Loyihani o'rnatish va ishga tushirish

### Talablar
- Node.js (18 yoki undan yuqori)
- npm yoki pnpm

### Qadamlar:

```bash
git clone https://github.com/newcomer-web/foundhub.git
cd foundhub
npm install
npm run dev
```

Loyiha brauzerda quyidagi manzilda ochiladi:
`http://localhost:3000`

Ishchi (production) yig'ish:
```bash
npm run build
npm start
```

---

## Litsenziya

Loyiha ochiq kodli bo'lib, erkin foydalanish uchun taqdim etiladi.
