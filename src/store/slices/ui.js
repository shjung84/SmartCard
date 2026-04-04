import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import { calculateMileageBenefitValue, calculateMonthlyBenefit } from '@/utils/function';

const initialState = {
  selectedBrandCode: '',
  selectedCardId: '',
  selectedAnnualFee: 0,
  monthlyBenefits: 0,
  monthlyUsage: '',
  mileageBaseUsage: '',
  mileageSpecialUsage: '',
  selectedBenefitMap: {},
  isLoading: true,
  error: null,
};

const resetCardSelection = (state) => {
  state.selectedCardId = '';
  state.selectedAnnualFee = 0;
};

const resetAnnualFee = (state) => {
  state.selectedAnnualFee = 0;
};

const resetBenefitSelections = (state) => {
  state.monthlyBenefits = 0;
  state.selectedBenefitMap = {};
  state.mileageBaseUsage = '';
  state.mileageSpecialUsage = '';
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateSelectedBrandCode: (state, action) => {
      state.selectedBrandCode = action.payload;
      resetCardSelection(state);
      resetBenefitSelections(state);
    },
    updateSelectedCardId: (state, action) => {
      state.selectedCardId = action.payload;
      resetAnnualFee(state);
      resetBenefitSelections(state);
    },
    updateSelectedAnnualFee: (state, action) => {
      state.selectedAnnualFee = action.payload;
    },
    updateMonthlyBenefits: (state, action) => {
      state.monthlyBenefits = action.payload;
    },
    updateMonthlyUsage: (state, action) => {
      state.monthlyUsage = action.payload;
      if (!state.mileageBaseUsage || state.mileageBaseUsage === '') {
        state.mileageBaseUsage = action.payload;
      }
    },
    updateMileageBaseUsage: (state, action) => {
      state.mileageBaseUsage = action.payload;
    },
    updateMileageSpecialUsage: (state, action) => {
      state.mileageSpecialUsage = action.payload;
    },
    updateBenefits: (state, action) => {
      const { idx, value } = action.payload;
      if (!state.selectedBenefitMap) state.selectedBenefitMap = {};
      state.selectedBenefitMap[idx] = value;
    },
  },
});

export const {
  setLoading,
  setError,
  updateSelectedBrandCode,
  updateSelectedCardId,
  updateSelectedAnnualFee,
  updateMonthlyBenefits,
  updateMonthlyUsage,
  updateMileageBaseUsage,
  updateMileageSpecialUsage,
  updateBenefits,
} = uiSlice.actions;

export const selectUiState = (state) => state.ui;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectError = (state) => state.ui.error;

export const selectCurrentCards = createSelector(
  [(state) => state.brands.items, (state) => state.ui.selectedBrandCode],
  (brands, selectedBrandCode) =>
    brands.find((b) => b.code === selectedBrandCode)?.cards || [],
);

export const selectCurrentCard = createSelector(
  [(state) => state.ui.selectedCardId, selectCurrentCards],
  (selectedCardId, currentCards) =>
    currentCards.find((c) => String(c.id) === String(selectedCardId)),
);

export const selectPickingResult = createSelector(
  [selectUiState, selectCurrentCard],
  (uiState, currentCard) => {
    const usage = parseInt(uiState.monthlyUsage.replace(/[^0-9]/g, '')) || 0;
    const annualFee = parseInt(uiState.selectedAnnualFee) || 0;
    
    const baseResult = {
      rate: 0,
      isValid: false,
      isSpecialValid: false,
      message: '',
      optimalUsage: 0,
      totalBenefits: 0,
    };

    if (!currentCard) return baseResult;

    const minUsage = currentCard.minUsage || 0;
    const minUsageSpecial = currentCard.minUsageSpecial || 0;
    
    const isPerformanceMet = usage >= minUsage;
    const isSpecialPerformanceMet = usage >= minUsageSpecial;
    
    // 혜택 합산
    let totalBenefits = 0;
    const selectedBenefitMap = uiState.selectedBenefitMap || {};
    const allBenefits = currentCard.benefits || [];

    allBenefits.forEach((benefit, idx) => {
      if (selectedBenefitMap[idx]) {
        if (!benefit.requirePerformance) {
          // 실적 무관 혜택은 무조건 합산
          totalBenefits += calculateMonthlyBenefit(benefit);
        } else if (isSpecialPerformanceMet) {
          // 실적 필요 혜택은 '특별 실적' 충족 시에만 합산
          totalBenefits += calculateMonthlyBenefit(benefit);
        }
      }
    });

    // 마일리지 계산
    if (currentCard?.category?.value === '003' && currentCard.mileageInfo) {
      const baseUsage = parseInt(uiState.mileageBaseUsage.replace(/[^0-9]/g, '')) || 0;
      const specialUsage = parseInt(uiState.mileageSpecialUsage.replace(/[^0-9]/g, '')) || 0;

      const mileageBenefit = calculateMileageBenefitValue(
        baseUsage,
        specialUsage,
        currentCard.mileageInfo,
      );
      totalBenefits += mileageBenefit;
    }

    // 최적 사용 금액 (기존 로직 유지)
    const tierList = currentCard.condition || [];
    let optimalUsage = Math.max(minUsage, minUsageSpecial);
    if (tierList.length > 0) {
      let maxEfficiency = 0;
      tierList.forEach((tier) => {
        const minUsageFromLabel = parseInt(tier.label.replace(/[^0-9]/g, ''), 10) || 0;
        const tierUsage = minUsageFromLabel * 10000;
        const tierLimit = parseInt(String(tier.value).replace(/[^0-9]/g, ''), 10) || 0;
        if (tierUsage > 0) {
          const efficiency = (tierLimit / tierUsage) * 100;
          if (efficiency > maxEfficiency) {
            maxEfficiency = efficiency;
            optimalUsage = tierUsage;
          }
        }
      });
    }

    if (usage <= 0) return { ...baseResult, optimalUsage, totalBenefits };

    const rate = ((totalBenefits - annualFee / 12) / usage) * 100;

    let message = '';
    if (!isPerformanceMet) {
      message = `실적 미달 (최소 ${minUsage.toLocaleString()}원 필요)`;
    } else if (!isSpecialPerformanceMet && allBenefits.some(b => b.requirePerformance)) {
      message = `특별 혜택 실적 미달 (일부 혜택 제외됨)`;
    }

    return {
      rate: parseFloat(rate.toFixed(2)),
      isValid: isPerformanceMet,
      isSpecialValid: isSpecialPerformanceMet,
      message,
      optimalUsage,
      totalBenefits,
    };
  },
);

export default uiSlice.reducer;
