import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

const initialState = {
  selectedBrandCode: '',
  selectedCardId: '',
  selectedAnnualFee: 0,
  monthlyBenefits: 0,
  monthlyUsage: '',
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
    const benefits = parseInt(uiState.monthlyBenefits) || 0;
    const annualFee = parseInt(uiState.selectedAnnualFee) || 0;
    const baseResult = {
      rate: 0,
      netRate: 0,
      isValid: false,
      message: '',
      optimalUsage: 0,
    };

    if (!currentCard) return baseResult;

    const minUsageAmount = currentCard.minUsage || 0;
    const tierList = currentCard.condition || [];
    let maxEfficiency = 0;
    let optimalUsage = 0;

    if (tierList.length > 0) {
      tierList.forEach((tier) => {
        const minUsageFromLabel =
          parseInt(tier.label.replace(/[^0-9]/g, ''), 10) || 0;
        const tierUsage = minUsageFromLabel * 10000;
        const tierLimit =
          parseInt(String(tier.value).replace(/[^0-9]/g, ''), 10) || 0;
        if (tierUsage === 0) return;
        const efficiency = (tierLimit / tierUsage) * 100;
        if (efficiency > maxEfficiency) {
          maxEfficiency = efficiency;
          optimalUsage = tierUsage;
        }
      });
    }

    if (optimalUsage === 0) {
      optimalUsage = minUsageAmount;
    }

    if (usage <= 0) return { ...baseResult, optimalUsage };

    if (usage < minUsageAmount) {
      return {
        ...baseResult,
        optimalUsage,
        message: `실적 미달 (최소 ${minUsageAmount.toLocaleString()}원 필요)`,
      };
    }

    const rate = (benefits / usage) * 100;
    const netRate = ((benefits - annualFee / 12) / usage) * 100;

    return {
      rate: parseFloat(rate.toFixed(2)),
      netRate: parseFloat(netRate.toFixed(2)),
      isValid: true,
      message: '',
      optimalUsage,
    };
  },
);

export default uiSlice.reducer;
