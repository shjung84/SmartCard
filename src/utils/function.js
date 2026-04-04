/**
 * 숫자를 통화 형식의 문자열로 변환합니다. (예: 10000 -> "10,000")
 * 소수점을 포함하며, 입력 중에도 실시간으로 포맷팅이 가능하도록 처리합니다.
 * @param {number | string} value - 포맷할 숫자 또는 문자열
 * @returns {string} 포맷된 통화 문자열
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '';

  // 1. 숫자와 '.' 이외의 문자를 제거합니다.
  let numericValue = String(value).replace(/[^0-9.]/g, '');

  // 2. 소수점이 여러 개 있는 경우, 첫 번째 소수점만 남깁니다.
  const parts = numericValue.split('.');
  if (parts.length > 2) {
    numericValue = parts[0] + '.' + parts.slice(1).join('');
  }

  // 3. 정수부와 소수부를 분리합니다.
  const finalParts = numericValue.split('.');

  // 4. 정수부에 3자리마다 콤마를 추가합니다.
  finalParts[0] = finalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 5. 정수부와 소수부를 다시 합칩니다.
  //    `numericValue`가 '.'일 때 `split`하면 ['','']이 되어 `join` 시 '..'가 되는 문제를 방지합니다.
  return numericValue === '.' ? '.' : finalParts.join('.');
};

/**
 * 통화 형식의 문자열에서 숫자(정수)를 추출합니다. (예: "10,000.50" -> 10000)
 * @param {string} value - 파싱할 통화 형식 문자열
 * @returns {number} 파싱된 정수 값
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  // 콤마 등 통화 형식 문자를 제거하고 정수 부분만 숫자로 변환합니다.
  const numericString = String(value).replace(/[^0-9.]/g, '');
  const integerPart = numericString.split('.')[0];
  return Number(integerPart) || 0;
};

/**
 * 개별 혜택의 월 평균 가치를 계산합니다.
 * 연 단위 혜택은 12로 나누어 월 평균으로 환산합니다.
 * @param {object} benefit - 혜택 객체. { value: number, limitMonth: number, limitYear: number }
 * @returns {number} 월 평균 혜택 금액
 */
export const calculateMonthlyBenefit = (benefit) => {
  const value = Number(benefit.value) || 0;
  // 0 또는 유효하지 않은 숫자는 '제한 없음'(Infinity)으로 간주합니다.
  const limitMonth =
    Number(benefit.limitMonth) > 0 ? Number(benefit.limitMonth) : Infinity;
  const limitYear =
    Number(benefit.limitYear) > 0 ? Number(benefit.limitYear) : Infinity;

  // 연간 총 사용 가능 횟수는 월 제한과 연 제한 중 더 작은 값입니다.
  const totalYearlyUses = Math.min(limitMonth * 12, limitYear);

  // 제한이 전혀 없는 경우(Infinity), 월 1회 사용으로 가정합니다.
  if (totalYearlyUses === Infinity) {
    return value * 1;
  }

  // 연간 총 혜택을 12로 나누어 월 평균 혜택을 계산합니다.
  return (value * totalYearlyUses) / 12;
};

/**
 * 혜택의 제한 조건을 "월 N회", "연 N회" 형태의 문자열로 포맷합니다.
 * @param {object} benefit - 혜택 객체. { limitMonth: number, limitYear: number }
 * @returns {string} 포맷된 제한 조건 문자열
 */
export const formatBenefitLimit = (benefit) => {
  if (!benefit) return '제한 없음';
  const { limitDay, limitMonth, limitYear } = benefit;

  const dayText = Number(limitDay) > 0 ? `일 ${limitDay}회` : '';
  const monthText = Number(limitMonth) > 0 ? `월 ${limitMonth}회` : '';
  const yearText = Number(limitYear) > 0 ? `연 ${limitYear}회` : '';

  const parts = [dayText, monthText, yearText].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : '제한 없음';
};

/**
 * 마일리지 카드의 월 평균 혜택 가치를 계산합니다.
 * @param {number} baseUsage - 기본 적립 대상 금액
 * @param {number} specialUsage - 특별 적립 대상 금액
 * @param {object} mileageInfo - 마일리지 정보 객체
 * @returns {number} 월 평균 마일리지 혜택 금액 (KRW)
 */
export const calculateMileageBenefitValue = (
  baseUsage,
  specialUsage,
  mileageInfo,
) => {
  if (!mileageInfo) return 0;

  // 1마일의 가치를 15~18원으로 가정, 계산을 위해 보수적으로 15원 적용.
  const MILE_VALUE_KRW = 15;

  const { base, special, specialLimit } = mileageInfo;
  const bUsage = Number(baseUsage) || 0;
  const sUsage = Number(specialUsage) || 0;

  // 기본 적립률 (원 당 마일)
  const baseRate = (base.miles || 0) / (base.cost || 1000);
  // 특별 적립률 (원 당 마일)
  const specialRate = (special.miles || 0) / (special.cost || 1000);

  // 추가(보너스) 적립률
  // 특별 적립은 기본 적립을 포함하는 경우가 많으므로, 추가 적립분만 계산
  const bonusRate = Math.max(0, specialRate - baseRate);

  // 1. 기본 적립 마일리지 계산 및 혜택 가치 환산
  const baseMiles = bUsage * baseRate;
  const baseBenefitValue = baseMiles * MILE_VALUE_KRW;

  // 2. 추가 적립 마일리지 계산 (특별 적립 대상 금액 기준)
  const bonusMiles = sUsage * bonusRate;

  // 3. 추가 적립 마일리지를 한도(specialLimit)에 맞춰 제한
  const cappedBonusMiles = Math.min(bonusMiles, specialLimit || Infinity);

  // 4. 한도가 적용된 추가 적립 마일리지의 혜택 가치 계산
  const cappedBonusBenefitValue = cappedBonusMiles * MILE_VALUE_KRW;

  // 최종 혜택 = 기본 혜택 + (한도가 적용된) 추가 혜택
  return baseBenefitValue + cappedBonusBenefitValue;
};
