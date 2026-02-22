import { configureStore } from '@reduxjs/toolkit';
import brandReducer from './slices/brand';
import cardReducer from './slices/card';
import categoryReducer from './slices/category';
import uiReducer from './slices/ui';
import { brandSyncMiddleware } from './brandSyncMiddleware.js';

export const store = configureStore({
  reducer: {
    brands: brandReducer,
    cards: cardReducer,
    categories: categoryReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(brandSyncMiddleware),
});
