// Bangladeshi phone validator & operator detector
export interface BdOperatorInfo {
  isValid: boolean;
  operatorName: string;
  badgeColor: string;
  error?: string;
}

export function validateBdPhone(phone: string): BdOperatorInfo {
  const cleaned = phone.replace(/[\s-]/g, '');

  if (!cleaned) {
    return { isValid: false, operatorName: '', badgeColor: '' };
  }

  // Check prefix
  const prefix3 = cleaned.slice(0, 3);
  let operator = '';
  let color = 'bg-slate-100 text-slate-700';

  if (prefix3 === '017' || prefix3 === '013') {
    operator = 'Grameenphone';
    color = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (prefix3 === '019' || prefix3 === '014') {
    operator = 'Banglalink';
    color = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (prefix3 === '018') {
    operator = 'Robi';
    color = 'bg-red-50 text-red-700 border-red-200';
  } else if (prefix3 === '016') {
    operator = 'Airtel';
    color = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (prefix3 === '015') {
    operator = 'Teletalk';
    color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  const isValidFormat = /^01[3-9]\d{8}$/.test(cleaned);

  if (cleaned.length === 11 && isValidFormat) {
    return {
      isValid: true,
      operatorName: operator || 'Valid BD Mobile',
      badgeColor: color,
    };
  }

  if (cleaned.length > 11) {
    return {
      isValid: false,
      operatorName: operator,
      badgeColor: color,
      error: 'Exceeds 11 digits (BD format: 01XXXXXXXXX)',
    };
  }

  return {
    isValid: false,
    operatorName: operator,
    badgeColor: color,
    error: cleaned.length < 11 ? `Enter ${11 - cleaned.length} more digits` : 'Invalid BD operator prefix',
  };
}

// BDT Currency Formatter
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}

// Generate random BD Transaction ID
export function generateTrxId(gateway: 'bKash' | 'Nagad'): string {
  const rand = Math.floor(10000000 + Math.random() * 90000000);
  return `${gateway.toUpperCase()}-${rand}`;
}
