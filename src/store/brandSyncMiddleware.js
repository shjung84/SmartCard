import { message } from 'antd';
import {
  addBrand,
  deleteBrand,
  addOrUpdateCard,
  deleteCard,
  updateBrandOrder,
} from './slices/brand';
import { fetchData } from './thunks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const saveData = async (brandsData) => {
  const updatePromises = brandsData.map((brand) =>
    fetch(`${API_URL}/Brands/${brand.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    }),
  );

  const responses = await Promise.all(updatePromises);

  for (const response of responses) {
    if (!response.ok) {
      throw new Error(
        `Failed to save brand data: ${response.status} ${response.statusText}`,
      );
    }
  }
};

export const brandSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const brandPersistenceActions = [
    updateBrandOrder.type,
    addBrand.fulfilled.type,
    deleteBrand.fulfilled.type,
    addOrUpdateCard.fulfilled.type,
    deleteCard.fulfilled.type,
  ];

  if (brandPersistenceActions.includes(action.type)) {
    (async () => {
      const state = store.getState();

      const updatedBrands = state.brands.items.map((brand, index) => ({
        ...brand,
        no: index + 1,
      }));

      try {
        await saveData(updatedBrands);
        store.dispatch(fetchData());
      } catch (error) {
        console.error('Failed to persist and refresh data:', error);
        message.error('데이터 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    })();
  }

  return result;
};
