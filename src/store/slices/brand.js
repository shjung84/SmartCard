import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// --- 비동기 Thunk 정의 ---
export const addBrand = createAsyncThunk(
  'brands/addBrand',
  async ({ label, code }, { rejectWithValue }) => {
    try {
      const newBrand = {
        label,
        code,
        cards: [],
      };
      const response = await axios.post(`${API_URL}/Brands`, newBrand);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (brandId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/Brands/${brandId}`);
      return brandId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

async function patchBrandNo(id, no) {
  const res = await fetch(`${API_URL}/Brands/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ no }),
  });
  if (!res.ok) throw new Error(`PATCH failed: ${id}`);
  return res.json();
}

export const saveBrandOrder = createAsyncThunk(
  'brands/saveBrandOrder',
  async (orderedIds, { getState, rejectWithValue }) => {
    try {
      const { items: brands } = getState().brands; // Correctly access brands from state
      const brandMap = new Map(brands.map((b) => [String(b.id), b]));

      await Promise.all(
        orderedIds.map((id, idx) => {
          const brand = brandMap.get(String(id));
          if (!brand) return Promise.resolve();
          return patchBrandNo(brand.id, idx + 1);
        }),
      );

      return orderedIds;
    } catch (e) {
      return rejectWithValue(e?.message ?? 'saveBrandOrder failed');
    }
  },
);

export const addOrUpdateCard = createAsyncThunk(
  'brands/addOrUpdateCard',
  async ({ brandCode, cardData }, { getState, rejectWithValue }) => {
    const { items: brands } = getState().brands;
    const targetBrand = brands.find((b) => b.code === brandCode);
    if (!targetBrand) return rejectWithValue('Brand not found');

    const isUpdate = !!cardData.id;
    const updatedCards = isUpdate
      ? targetBrand.cards.map((c) => (c.id === cardData.id ? cardData : c))
      : [...targetBrand.cards, { ...cardData, id: Date.now() }];

    const updatedBrand = { ...targetBrand, cards: updatedCards };

    try {
      const response = await axios.put(
        `${API_URL}/Brands/${targetBrand.id}`,
        updatedBrand,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCard = createAsyncThunk(
  'brands/deleteCard',
  async ({ brandCode, cardId }, { getState, rejectWithValue }) => {
    const { items: brands } = getState().brands;
    const targetBrand = brands.find((b) => b.code === brandCode);
    if (!targetBrand) return rejectWithValue('Brand not found');

    const updatedCards = targetBrand.cards.filter((c) => c.id !== cardId);
    const updatedBrand = { ...targetBrand, cards: updatedCards };

    try {
      await axios.put(`${API_URL}/Brands/${targetBrand.id}`, updatedBrand);
      return { brandId: targetBrand.id, cardId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const swapInArray = (arr, i, j) => {
  if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
};

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    items: [],
  },
  reducers: {
    setBrands: (state, action) => {
      state.items = action.payload;
    },
    updateBrandOrder: (state, action) => {
      const { index, direction } = action.payload;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      swapInArray(state.items, index, targetIndex);
    },
    setBrandOrder: (state, action) => {
      const orderedIds = (action.payload || []).map(String);
      const map = new Map(state.items.map((b) => [String(b.id), b]));
      const next = orderedIds.map((id) => map.get(id)).filter(Boolean);
      const rest = state.items.filter((b) => !orderedIds.includes(String(b.id)));
      state.items = [...next, ...rest];
      state.items.forEach((b, i) => {
        b.no = i + 1;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBrand.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      })
      .addCase(addOrUpdateCard.fulfilled, (state, action) => {
        const updatedBrand = action.payload;
        const index = state.items.findIndex((b) => b.id === updatedBrand.id);
        if (index !== -1) {
          state.items[index] = updatedBrand;
        }
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        const { brandId, cardId } = action.payload;
        const brand = state.items.find((b) => b.id === brandId);
        if (brand) {
          brand.cards = brand.cards.filter((c) => c.id !== cardId);
        }
      });
  },
});

export const { setBrands, updateBrandOrder, setBrandOrder } = brandSlice.actions;

export const selectBrands = (state) => state.brands.items;

export default brandSlice.reducer;
