import {
  addBrand,
  deleteBrand,
  addOrUpdateCard,
  deleteCard,
  updateBrandOrder,
} from './slices/brand';
import { fetchData } from './thunks';

const saveData = async (brandsData) => {
  try {
    const updatePromises = brandsData.map((brand) =>
      fetch(`http://localhost:3001/Brands/${brand.id}`, {
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
  } catch (error) {
    console.error('Persistence Error:', error);
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
      }
    })();
  }

  return result;
};
