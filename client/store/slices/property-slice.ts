import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Property } from "@/types";

interface PropertyState {
  items: Property[];
  featured: Property[];
}

const initialState: PropertyState = {
  items: [],
  featured: []
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setProperties(state, action: PayloadAction<Property[]>) {
      state.items = action.payload;
      state.featured = action.payload.slice(0, 6);
    }
  }
});

export const { setProperties } = propertySlice.actions;
export default propertySlice.reducer;

