import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setBrands } from './slices/brand';
import { setCategories } from './slices/category';
import { setUserCards } from './slices/card';
import { setLoading, setError } from './slices/ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const fetchData = createAsyncThunk(
  'app/fetchData',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const [brandsRes, userCardsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/Brands`),
        axios.get(`${API_URL}/UserCards`),
        axios.get(`${API_URL}/Categories`),
      ]);
      dispatch(setBrands(brandsRes.data));
      dispatch(setUserCards(userCardsRes.data));
      dispatch(setCategories(categoriesRes.data));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      return rejectWithValue(error.message);
    }
  },
);
