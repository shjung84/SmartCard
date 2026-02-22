import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async ({ label, value }, { rejectWithValue }) => {
    try {
      const newCategory = { label, value };
      const response = await axios.post(`${API_URL}/Categories`, newCategory);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/Categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
  },
  reducers: {
    setCategories: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setCategories } = categorySlice.actions;

export const selectCategories = (state) => state.categories.items;

export default categorySlice.reducer;
