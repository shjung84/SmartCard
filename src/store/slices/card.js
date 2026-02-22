import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const toggleUserCardSelection = createAsyncThunk(
  'cards/toggleUserCardSelection',
  async (cardId, { getState, rejectWithValue }) => {
    const { items: userCards } = getState().cards;
    const existingUserCard = userCards.find((uc) => uc.cardId === cardId);

    try {
      if (existingUserCard) {
        await axios.delete(`${API_URL}/UserCards/${existingUserCard.id}`);
        return { cardId, isSelected: false, id: existingUserCard.id };
      } else {
        const newUserCard = { cardId, alias: '새 카드' };
        const response = await axios.post(`${API_URL}/UserCards`, newUserCard);
        return { cardId, isSelected: true, card: response.data };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const cardSlice = createSlice({
  name: 'cards',
  initialState: {
    items: [], // This will hold userCards
  },
  reducers: {
    setUserCards: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleUserCardSelection.fulfilled, (state, action) => {
      if (action.payload.isSelected) {
        state.items.push(action.payload.card);
      } else {
        state.items = state.items.filter((c) => c.id !== action.payload.id);
      }
    });
  },
});

export const { setUserCards } = cardSlice.actions;

export const selectUserCards = (state) => state.cards.items;
export const selectSelectedUserCardIds = createSelector(
  [selectUserCards],
  (userCards) => userCards.map((uc) => uc.cardId),
);

export default cardSlice.reducer;
