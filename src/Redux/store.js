// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import customerReducer from './customerSlice';

const store = configureStore({
  reducer: {
    projects: projectReducer,
    customers: customerReducer,
    // Add other slices/reducers here if needed
  },
});

export default store;
