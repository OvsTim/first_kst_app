import {productsInitialState} from './ProductsDataSlice';

export default {
  1: (state: any) => ({
    ...state,
    products: productsInitialState,
  }),
};
