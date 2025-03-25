// src/redux/projectSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects } from "../utils/api";

// Define the async thunk
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    try {
      const response = await getProjects();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// ... rest of the code remains the same
const projectSlice = createSlice({
  name: "projects",
  initialState: {
    data: [], // The fetched data will be stored here
    loading: "idle", // 'idle', 'pending', 'succeeded', or 'failed'
    error: null,
  },
  reducers: {
    // Define other reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;
