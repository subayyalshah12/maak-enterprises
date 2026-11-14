type Division = 'general' | 'real-estate' | 'construction' | 'education' | 'property-submission';

const destinationByDivision: Record<Division, string | undefined> = {
  general: process.env.NEXT_PUBLIC_WHATSAPP_GENERAL,
  'real-estate': process.env.NEXT_PUBLIC_WHATSAPP_REAL_ESTATE,
  construction: process.env.NEXT_PUBLIC_WHATSAPP_CONSTRUCTION,
  education: process.env.NEXT_PUBLIC_WHATSAPP_EDUCATION,
  'property-submission': process.env.NEXT_PUBLIC_WHATSAPP_REAL_ESTATE,
};

export function getDivisionWhatsAppUrl(division: string, message: string): string | null {
  const destination = destinationByDivision[division as Division];
  const digits = destination?.replace(/\D/g, '') ?? '';
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
