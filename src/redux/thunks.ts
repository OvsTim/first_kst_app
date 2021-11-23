import {createAsyncThunk} from '@reduxjs/toolkit';
import * as API from '../API';
import {handleBaseError} from '../utils/handler';
import {OrderDeliveryType} from './ProductsDataSlice';

export const fetchImages = createAsyncThunk(
  'users/fetchByIdStatus',
  async (url: string, {rejectWithValue}) => {
    try {
      //console.time('getImages');
      const response = await API.getImages(url);
      //console.timeEnd('getImages');
      return response.data;
    } catch (er) {
      let errorMessage: string = handleBaseError(er);
      //console.timeEnd('getImages');
      return rejectWithValue(errorMessage);
    }
  },
);

export const newOrderRequest = createAsyncThunk(
  'users/newOrderRequest',
  async (
    arg: {id: number; type: OrderDeliveryType; address: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await API.newOrder(arg.id, arg.type, arg.address);
      return response.data;
    } catch (er) {
      let errorMessage: string = handleBaseError(er);
      return rejectWithValue(errorMessage);
    }
  },
);

export const newOrderCancelRequest = createAsyncThunk(
  'users/newOrderCancelRequest',
  async (id: number, {rejectWithValue}) => {
    try {
      const response = await API.newOrderCancel(id);
      return response.data;
    } catch (er) {
      let errorMessage: string = handleBaseError(er);
      return rejectWithValue(errorMessage);
    }
  },
);
