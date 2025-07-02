import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadedComponents {
  slider: boolean;
  news: boolean;
  stats: boolean;
  projects: boolean;
  seasonal: boolean;
  partners: boolean;
  gallery: boolean;
  footer: boolean;
}

interface HomeState {
  isLoaded: boolean;
  loadedComponents: LoadedComponents;
}

const initialState: HomeState = {
  isLoaded: false,
  loadedComponents: {
    slider: false,
    news: false,
    stats: false,
    projects: false,
    seasonal: false,
    partners: false,
    gallery: false,
    footer: false
  }
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<HomeState>) => {
      state.isLoaded = action.payload.isLoaded;
      state.loadedComponents = action.payload.loadedComponents;
    }
  }
});

export const { setState } = homeSlice.actions;
export default homeSlice.reducer; 