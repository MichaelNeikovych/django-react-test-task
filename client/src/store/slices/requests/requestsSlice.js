import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  fetchRequestsApi,
  createRequestApi,
} from '../../../api/requests';

export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchRequestsApi();
      return data.requests;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to load requests'
      );
    }
  }
);

export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const data = await createRequestApi(requestData);
      return data.request;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to create request'
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  creating: false,
  error: null,
  createError: null,
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clearRequestsError: (state) => {
      state.error = null;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createRequest.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
  },
});

export const { clearRequestsError } = requestsSlice.actions;

export default requestsSlice.reducer;