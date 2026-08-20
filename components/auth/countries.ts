export interface Country {
  code: string;
  name: string;
  flag: string;
  timezone: string;
  timezoneLabel: string;
}

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', timezone: 'Asia/Kolkata', timezoneLabel: 'India — IST (UTC+5:30)' },
  { code: 'US', name: 'United States', flag: '🇺🇸', timezone: 'America/New_York', timezoneLabel: 'US Eastern (UTC-5)' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', timezone: 'Europe/London', timezoneLabel: 'UK — GMT/BST (UTC+0)' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', timezone: 'America/Toronto', timezoneLabel: 'Canada — Eastern (UTC-5)' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', timezone: 'Australia/Sydney', timezoneLabel: 'Australia — AEST (UTC+10)' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', timezone: 'Asia/Singapore', timezoneLabel: 'Singapore — SGT (UTC+8)' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', timezone: 'Asia/Dubai', timezoneLabel: 'UAE — GST (UTC+4)' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', timezone: 'Europe/Berlin', timezoneLabel: 'Germany — CET (UTC+1)' },
  { code: 'FR', name: 'France', flag: '🇫🇷', timezone: 'Europe/Paris', timezoneLabel: 'France — CET (UTC+1)' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', timezone: 'Asia/Tokyo', timezoneLabel: 'Japan — JST (UTC+9)' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', timezone: 'Europe/Amsterdam', timezoneLabel: 'Netherlands — CET (UTC+1)' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', timezone: 'Europe/Zurich', timezoneLabel: 'Switzerland — CET (UTC+1)' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', timezone: 'Europe/Stockholm', timezoneLabel: 'Sweden — CET (UTC+1)' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', timezone: 'America/Sao_Paulo', timezoneLabel: 'Brazil — BRT (UTC-3)' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', timezone: 'America/Mexico_City', timezoneLabel: 'Mexico — CST (UTC-6)' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', timezone: 'Europe/Madrid', timezoneLabel: 'Spain — CET (UTC+1)' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', timezone: 'Europe/Rome', timezoneLabel: 'Italy — CET (UTC+1)' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', timezone: 'Asia/Seoul', timezoneLabel: 'Korea — KST (UTC+9)' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', timezone: 'Asia/Jakarta', timezoneLabel: 'Indonesia — WIB (UTC+7)' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', timezone: 'Africa/Johannesburg', timezoneLabel: 'South Africa — SAST (UTC+2)' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', timezone: 'Pacific/Auckland', timezoneLabel: 'New Zealand — NZST (UTC+12)' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', timezone: 'Europe/Dublin', timezoneLabel: 'Ireland — IST/GMT (UTC+0)' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', timezone: 'Europe/Oslo', timezoneLabel: 'Norway — CET (UTC+1)' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', timezone: 'Europe/Helsinki', timezoneLabel: 'Finland — EET (UTC+2)' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', timezone: 'Europe/Copenhagen', timezoneLabel: 'Denmark — CET (UTC+1)' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', timezone: 'Europe/Warsaw', timezoneLabel: 'Poland — CET (UTC+1)' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', timezone: 'Europe/Lisbon', timezoneLabel: 'Portugal — WET (UTC+0)' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', timezone: 'Europe/Vienna', timezoneLabel: 'Austria — CET (UTC+1)' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', timezone: 'Europe/Brussels', timezoneLabel: 'Belgium — CET (UTC+1)' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', timezone: 'Asia/Jerusalem', timezoneLabel: 'Israel — IST (UTC+2)' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', timezone: 'Asia/Kuala_Lumpur', timezoneLabel: 'Malaysia — MYT (UTC+8)' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', timezone: 'Asia/Bangkok', timezoneLabel: 'Thailand — ICT (UTC+7)' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', timezone: 'Asia/Ho_Chi_Minh', timezoneLabel: 'Vietnam — ICT (UTC+7)' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', timezone: 'Asia/Manila', timezoneLabel: 'Philippines — PHT (UTC+8)' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', timezone: 'America/Argentina/Buenos_Aires', timezoneLabel: 'Argentina — ART (UTC-3)' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', timezone: 'America/Santiago', timezoneLabel: 'Chile — CLT (UTC-3)' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', timezone: 'America/Bogota', timezoneLabel: 'Colombia — COT (UTC-5)' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', timezone: 'Africa/Cairo', timezoneLabel: 'Egypt — EET (UTC+2)' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', timezone: 'Africa/Lagos', timezoneLabel: 'Nigeria — WAT (UTC+1)' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', timezone: 'Africa/Nairobi', timezoneLabel: 'Kenya — EAT (UTC+3)' },
];

export function getSensibleDetectedTimezone(): { timezone: string; label: string } {
  try {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) {
        // Match country list timezone or construct formatted label
        const match = COUNTRIES.find((c) => c.timezone === detected);
        if (match) {
          return { timezone: match.timezone, label: match.timezoneLabel };
        }
        return {
          timezone: detected,
          label: `${detected.replace('_', ' ')} (Detected)`,
        };
      }
    }
  } catch (e) {
    // Fallback safely
  }
  return {
    timezone: 'Asia/Kolkata',
    label: 'India — IST (UTC+5:30)',
  };
}

