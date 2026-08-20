# تطبيق مستخدم أسواق المرتضى

تطبيق المستخدم المستقل، متصل بقاعدة Convex السحابية نفسها التي تستخدمها لوحة الإدارة.

- Convex Project: `al-murtada-market`
- Deployment: `hushed-zebra-824` (Production)
- الرابط العام: `https://jwada6589-hash.github.io/user/`

## التشغيل المحلي

انسخ `user-app/.env.example` إلى `user-app/.env.local` ثم شغّل:

```bash
npm install
npm run dev
```

## النشر

يُبنى التطبيق ويُنشر آليًا عبر GitHub Pages عند كل تحديث لفرع `main`.

لا يحتوي المستودع على مفتاح نشر Convex أو أي أسرار محلية.
