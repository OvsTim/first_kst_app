import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Question {
  text: string;
  type: 'single' | 'multiply' | 'slider' | 'input';
  variant?: string[];
}

export interface Pools {
  id: number;
  title: string;
  date: string;
  questions: Question[];
  last_answered?: number;
  answers?: object[];
}

interface poolsState {
  pools: Pools[];
}

const initialState = {
  pools: [
    {
      id: 1,
      title: 'Тестовый опрос',
      date: '2021-03-25T09:27:44.034Z',
      last_answered: 1,
      questions: [
        {
          text: 'Как вы оцениваете своё\n' + 'самочувствие?',
          type: 'single',
          variant: ['Плохо', 'Средне', 'Хорошо', 'Восхитительно'],
        },
        {
          text: 'Как вы оцениваете своё\n' + 'самочувствие?',
          type: 'multiply',
          variant: ['Плохо', 'Средне', 'Хорошо', 'Восхитительно'],
        },
        {
          text: 'Как вы оцениваете своё\n' + 'самочувствие?',
          type: 'slider',
        },
        {
          text: 'Как вы оцениваете своё\n' + 'самочувствие?',
          type: 'input',
        },
      ],
    },
    {
      id: 2,
      title: 'Тестовый опрос',
      date: '2021-03-24T09:27:44.034Z',
      questions: [
        {
          text: 'Как вы оцениваете своё\n' + 'самочувствие?',
          type: 'single',
          variant: ['Плохо', 'Средне', 'Хорошо', 'Восхитительно'],
        },
        {
          text: 'Как вы оцениваете своё\n' + 'самочувствие?',
          type: 'multiply',
          variant: ['Плохо', 'Средне', 'Хорошо', 'Восхитительно'],
        },
        {
          text: 'Как вы оцениваете своё\n' + 'самочувствие?',
          type: 'slider',
        },
        {
          text: 'Как вы оцениваете своё\n' + 'самочувствие?',
          type: 'input',
        },
      ],
    },
  ],
} as poolsState;

const poolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    setPools(state, action: PayloadAction<poolsState>) {
      const {pools} = action.payload;
      state.pools = pools;
    },
    resetAction() {
      return initialState;
    },
  },
});

export const {setPools, resetAction} = poolsSlice.actions;
export default poolsSlice.reducer;
