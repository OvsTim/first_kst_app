import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface User {
  token: string;
  user_id: string;
  phone: string;
  surname: string;
  name: string;
  last_name: string;
}

const initialState = {token: ''} as User;

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<User>) {
      const {
        token = '',
        user_id,
        phone,
        surname,
        name,
        last_name,
      } = action.payload;
      state.token = token;
      state.user_id = user_id;
      state.phone = phone;
      state.surname = surname;
      state.name = name;
      state.last_name = last_name;
    },
    setToken(state, action: PayloadAction<Pick<User, 'token'>>) {
      state.token = action.payload.token || '';
    },
    setData(
      state,
      action: PayloadAction<Pick<User, 'surname' | 'name' | 'last_name'>>,
    ) {
      const {surname, name, last_name} = action.payload;
      state.surname = surname;
      state.name = name;
      state.last_name = last_name;
    },
    setPhone(state, action: PayloadAction<Pick<User, 'phone'>>) {
      const {phone} = action.payload;
      state.phone = phone;
    },
    resetAction() {
      return initialState;
    },
  },
});

export const {
  setAuthData,
  setToken,
  setData,
  setPhone,
  resetAction,
} = dataSlice.actions;
export default dataSlice.reducer;
