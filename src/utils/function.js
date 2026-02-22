// 통화 관련 유틸리티 함수
export const func = {
  /**
   * 숫자를 통화 형식의 문자열로 변환합니다. (예: 10000 -> "10,000")
   * 소수점을 포함하며, 입력 중에도 실시간으로 포맷팅이 가능하도록 처리합니다.
   * @param {number | string} value - 포맷할 숫자 또는 문자열
   * @returns {string} 포맷된 통화 문자열
   */
  formatCurrency(value) {
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
  },

  /**
   * 통화 형식의 문자열에서 숫자(정수)를 추출합니다. (예: "10,000.50" -> 10000)
   * @param {string} value - 파싱할 통화 형식 문자열
   * @returns {number} 파싱된 정수 값
   */
  parseCurrency(value) {
    if (!value) return 0;
    // 콤마 등 통화 형식 문자를 제거하고 정수 부분만 숫자로 변환합니다.
    const numericString = String(value).replace(/[^0-9.]/g, '');
    const integerPart = numericString.split('.')[0];
    return Number(integerPart) || 0;
  },
};
