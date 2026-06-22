import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    items: [],
    featured: []
};
const propertySlice = createSlice({
    name: "properties",
    initialState,
    reducers: {
        setProperties(state, action) {
            state.items = action.payload;
            state.featured = action.payload.slice(0, 6);
        }
    }
});
export const { setProperties } = propertySlice.actions;
export default propertySlice.reducer;
