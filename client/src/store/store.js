import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/auth/authSlice';
import requestsReducer from './slices/requests/requestsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
  },
});