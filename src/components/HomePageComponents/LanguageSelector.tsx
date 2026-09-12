"use client";

// The site renders in Arabic only (locale is fixed in src/i18n/request.ts so
// pages can be statically cached). The switcher is kept as a no-op so the
// Header / MobileDrawer imports stay valid.
const LanguageSelector = () => null;

export default LanguageSelector;
