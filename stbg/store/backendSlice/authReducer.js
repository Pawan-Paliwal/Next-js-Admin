
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    permissions: [],
    isLoggedIn: false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData(state, action) {
            state.user = action.payload.user || null;
            state.permissions = action.payload.permissions || [];
            state.isLoggedIn = true;
        },
        clearAuthData(state) {
            state.user = null;
            state.permissions = [];
            state.isLoggedIn = false;
            state.loading = false;
            state.error = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    },
});

export const { setAuthData, clearAuthData, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;