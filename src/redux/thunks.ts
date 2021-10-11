import {createAsyncThunk} from '@reduxjs/toolkit';
import * as API from '../API';
import {handleBaseError} from '../utils/handler';

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
