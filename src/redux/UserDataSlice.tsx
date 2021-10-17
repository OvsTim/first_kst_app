import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  token: string;
  user_id: string;
  phone: string;
  surname: string;
  name: string;
  last_name: string;
  images: ImageMap;
}

export type ImageMap = Record<string, string>;

const initialState = {token: '', images: {}} as UserState;

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<UserState>) {
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
    setImageUrl(state, action: PayloadAction<{ref: string; url: string}>) {
      state.images[action.payload.ref] = action.payload.url;
    },
    // setToken(state, action: PayloadAction<Pick<UserState, 'token'>>) {
    //   state.token = action.payload.token || '';
    // },
    // setData(
    //   state,
    //   action: PayloadAction<Pick<UserState, 'surname' | 'name' | 'last_name'>>,
    // ) {
    //   const {surname, name, last_name} = action.payload;
    //   state.surname = surname;
    //   state.name = name;
    //   state.last_name = last_name;
    // },
    // setPhone(state, action: PayloadAction<Pick<UserState, 'phone'>>) {
    //   const {phone} = action.payload;
    //   state.phone = phone;
    // },
    resetAction() {
      return initialState;
    },
  },
});

export const {setAuthData, resetAction, setImageUrl} = dataSlice.actions;
export default dataSlice.reducer;
