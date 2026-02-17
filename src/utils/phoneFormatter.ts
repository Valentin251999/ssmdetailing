export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return '';

  const cleaned = phone.replace(/\s+/g, '');

  if (cleaned.startsWith('+40')) {
    return cleaned;
  }

  if (cleaned.startsWith('40') && cleaned.length >= 11) {
    return '+' + cleaned;
  }

  if (cleaned.startsWith('0')) {
    return cleaned;
  }

  if (cleaned.length >= 9 && !cleaned.startsWith('0') && !cleaned.startsWith('+')) {
    return '+40' + cleaned;
  }

  return phone;
}

export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';

  let cleaned = phone.replace(/[\s+]/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = '40' + cleaned.substring(1);
  }

  if (!cleaned.startsWith('40') && cleaned.length >= 9) {
    cleaned = '40' + cleaned;
  }

  return cleaned;
}

export function formatPhoneForTel(phone: string): string {
  if (!phone) return '';

  return phone.replace(/\s+/g, '');
}
