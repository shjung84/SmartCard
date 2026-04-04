import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import {
  updateBrandOrder,
  setBrandOrder,
  addBrand,
  deleteBrand,
  addOrUpdateCard,
  deleteCard,
  saveBrandOrder,
  selectBrands,
} from '@/store/slices/brand';
import {
  toggleUserCardSelection,
  selectUserCards,
  selectSelectedUserCardIds,
} from '@/store/slices/card';
import {
  addCategory,
  deleteCategory,
  selectCategories,
} from '@/store/slices/category';
import {
  updateSelectedBrandCode,
  updateSelectedCardId,
  updateSelectedAnnualFee,
  updateMonthlyBenefits,
  updateMonthlyUsage,
  updateMileageBaseUsage,
  updateMileageSpecialUsage,
  updateBenefits,
  selectUiState,
  selectIsLoading,
  selectError,
  selectCurrentCards,
  selectCurrentCard,
  selectPickingResult,
} from '@/store/slices/ui';

import { fetchData } from '@/store/thunks';

export const useCardStore = () => {
  const dispatch = useDispatch();

  // =================================================================
  // State
  // =================================================================
  const state = {
    // Brand Slice
    brands: useSelector(selectBrands),
    // Card Slice
    userCards: useSelector(selectUserCards),
    selectedUserCardIds: useSelector(selectSelectedUserCardIds),
    // Category Slice
    categories: useSelector(selectCategories),
    // UI Slice
    ...useSelector(selectUiState),
    isLoading: useSelector(selectIsLoading),
    error: useSelector(selectError),
    // Derived State
    currentCards: useSelector(selectCurrentCards),
    currentCard: useSelector(selectCurrentCard),
    pickingResult: useSelector(selectPickingResult),
  };

  // =================================================================
  // Actions
  // =================================================================
  const actions = {
    // --- App/Global Thunks ---
    fetchData: useCallback(() => dispatch(fetchData()), [dispatch]),

    // --- UI Actions ---
    updateSelectedBrandCode: useCallback(
      (brandCode) => dispatch(updateSelectedBrandCode(brandCode)),
      [dispatch],
    ),
    updateSelectedCardId: useCallback(
      (cardId) => dispatch(updateSelectedCardId(cardId)),
      [dispatch],
    ),
    updateSelectedAnnualFee: useCallback(
      (fee) => dispatch(updateSelectedAnnualFee(fee)),
      [dispatch],
    ),
    updateMonthlyBenefits: useCallback(
      (benefits) => dispatch(updateMonthlyBenefits(benefits)),
      [dispatch],
    ),
    updateMonthlyUsage: useCallback(
      (usage) => dispatch(updateMonthlyUsage(usage)),
      [dispatch],
    ),
    updateMileageBaseUsage: useCallback(
      (usage) => dispatch(updateMileageBaseUsage(usage)),
      [dispatch],
    ),
    updateMileageSpecialUsage: useCallback(
      (usage) => dispatch(updateMileageSpecialUsage(usage)),
      [dispatch],
    ),
    updateBenefits: useCallback(
      (payload) => dispatch(updateBenefits(payload)),
      [dispatch],
    ),

    // --- Brand Actions & Thunks ---
    updateBrandOrder: useCallback(
      (payload) => dispatch(updateBrandOrder(payload)),
      [dispatch],
    ),
    setBrandOrder: useCallback(
      (payload) => dispatch(setBrandOrder(payload)),
      [dispatch],
    ),
    saveBrandOrder: useCallback(
      (payload) => dispatch(saveBrandOrder(payload)),
      [dispatch],
    ),
    addBrand: useCallback((payload) => dispatch(addBrand(payload)), [dispatch]),
    deleteBrand: useCallback(
      (brandId) => dispatch(deleteBrand(brandId)),
      [dispatch],
    ),

    // --- Card Actions & Thunks ---
    addOrUpdateCard: useCallback(
      (payload) => dispatch(addOrUpdateCard(payload)),
      [dispatch],
    ),
    deleteCard: useCallback(
      (payload) => dispatch(deleteCard(payload)),
      [dispatch],
    ),
    toggleUserCardSelection: useCallback(
      (cardId) => dispatch(toggleUserCardSelection(cardId)),
      [dispatch],
    ),

    // --- Category Thunks ---
    addCategory: useCallback(
      (payload) => dispatch(addCategory(payload)),
      [dispatch],
    ),
    deleteCategory: useCallback(
      (categoryId) => dispatch(deleteCategory(categoryId)),
      [dispatch],
    ),
  };

  return { state, actions };
};
