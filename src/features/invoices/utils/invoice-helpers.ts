export const formatPhoneToE164 = (phone: string) => {
  if (!phone) return '';
  if (phone.startsWith('+')) return phone;
  return `+41${phone}`;
};

export const normalizeCategoryValue = (category: string) => {
  if (!category) return '';
  return category.toLowerCase();
};
