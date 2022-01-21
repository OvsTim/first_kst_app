import {combineReducers} from 'redux';
import dataSlice from './UserDataSlice';
import productsDataSlice from './ProductsDataSlice';
import basketDataSlice from './BasketDataReducer';
import {persistReducer, createMigrate} from 'redux-persist';
import {configureStore} from '@reduxjs/toolkit';
import {createSelectorHook, useDispatch} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import migrations from './migrations';
const dataPersistConfig = {
  key: 'data',
  storage: AsyncStorage,
};
const productsPersistConfig = {
  key: 'products',
  version: 1,
  storage: AsyncStorage,
  migrate: createMigrate(migrations, {
    debug: false,
  }),
};

const basketPersistConfig = {
  key: 'basket',
  storage: AsyncStorage,
};
const AppReducer = combineReducers({
  data: persistReducer(dataPersistConfig, dataSlice),
  products: persistReducer(productsPersistConfig, productsDataSlice),
  basket: persistReducer(basketPersistConfig, basketDataSlice),
});

const store = configureStore({
  reducer: AppReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof AppReducer>;
export type AppDispatch = typeof store.dispatch;
export const useSelector = createSelectorHook<RootState>();
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
