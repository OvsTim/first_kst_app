import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ImageSourcePropType} from 'react-native';

export interface News {
  id: number;
  image_url?: ImageSourcePropType;
  text: string;
  date: string;
}

interface newsState {
  news: News[];
}

const initialState = {
  news: [
    {
      id: 1,
      date: '2021-03-25T09:27:44.034Z',
      image_url: require('../assets/placeholder.png'),
      text:
        'Lorem ipsum dolor sit amet, consectetur\n' +
        'adipiscing elit, sed do eiusmod tempor\n' +
        'incididunt ut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam, quis nostrud\n' +
        'exercitation ullamco laboris nisi ut aliquip ex\n' +
        'ea commodo consequat.',
    },
    {
      id: 2,
      date: '2021-03-24T09:27:44.034Z',
      text:
        'Lorem ipsum dolor sit amet, consectetur\n' +
        'adipiscing elit, sed do eiusmod tempor\n' +
        'incididunt ut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam, quis nostrud\n' +
        'exercitation ullamco laboris nisi ut aliquip ex\n' +
        'ea commodo consequat.',
    },
    {
      id: 3,
      date: '2021-03-23T09:27:44.034Z',
      text:
        'Lorem ipsum dolor sit amet, consectetur\n' +
        'adipiscing elit, sed do eiusmod tempor\n' +
        'incididunt ut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam, quis nostrud\n' +
        'exercitation ullamco laboris nisi ut aliquip ex\n' +
        'ea commodo consequat.',
    },
    {
      id: 4,
      date: '2021-03-22T09:27:44.034Z',
      image_url: require('../assets/placeholder.png'),
      text:
        'Lorem ipsum dolor sit amet, consectetur\n' +
        'adipiscing elit, sed do eiusmod tempor\n' +
        'incididunt ut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam, quis nostrud\n' +
        'exercitation ullamco laboris nisi ut aliquip ex\n' +
        'ea commodo consequat.',
    },
    {
      id: 5,
      date: '2021-03-21T09:27:44.034Z',
      text:
        'Lorem ipsum dolor sit amet, consectetur\n' +
        'adipiscing elit, sed do eiusmod tempor\n' +
        'incididunt ut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam, quis nostrud\n' +
        'exercitation ullamco laboris nisi ut aliquip ex\n' +
        'ea commodo consequat.',
    },
    {
      id: 6,
      date: '2021-03-20T09:27:44.034Z',
      text:
        'Lorem ipsum dolor sit amet, consectetur\n' +
        'adipiscing elit, sed do eiusmod tempor\n' +
        'incididunt ut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam, quis nostrud\n' +
        'exercitation ullamco laboris nisi ut aliquip ex\n' +
        'ea commodo consequat.',
    },
    {
      id: 7,
      date: '2021-03-19T09:27:44.034Z',
      text:
        'Lorem ipsum dolor sit amet, consectetur\n' +
        'adipiscing elit, sed do eiusmod tempor\n' +
        'incididunt ut labore et dolore magna aliqua.\n' +
        'Ut enim ad minim veniam, quis nostrud\n' +
        'exercitation ullamco laboris nisi ut aliquip ex\n' +
        'ea commodo consequat.',
    },
  ],
} as newsState;

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews(state, action: PayloadAction<newsState>) {
      const {news} = action.payload;
      state.news = news;
    },
    resetAction() {
      return initialState;
    },
  },
});

export const {setNews, resetAction} = newsSlice.actions;
export default newsSlice.reducer;
