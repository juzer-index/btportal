// src/redux/customerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomers } from '../utils/api'; // Make sure you have a getCustomers function in your api module

// Define the async thunk
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
  try {
    const response = await getCustomers();
    return response.data;
  } catch (error) {
    throw error;
  }
});

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    data: [], // The fetched data will be stored here
    loading: 'idle', // 'idle', 'pending', 'succeeded', or 'failed'
    error: null,
  },
  reducers: {
    // Define other reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;
