const ua = navigator.userAgent;

export const IS_IOS = /iPad|iPhone|iPod/.test(ua);

// In-app browsers de redes sociales bloquean window.open, ignoran el atributo
// download en <a> y a veces impiden que wa.me abra WhatsApp nativamente.
export const IS_IN_APP_BROWSER =
  /Instagram|FBAN|FBAV|BytedanceWebview|TikTok|Twitter|LinkedInApp|Snapchat|MicroMessenger/i.test(ua);

export function getIabName(): string {
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV/i.test(ua)) return "Facebook";
  if (/BytedanceWebview|TikTok/i.test(ua)) return "TikTok";
  if (/Twitter/i.test(ua)) return "X (Twitter)";
  if (/LinkedInApp/i.test(ua)) return "LinkedIn";
  if (/Snapchat/i.test(ua)) return "Snapchat";
  return "una app";
}
