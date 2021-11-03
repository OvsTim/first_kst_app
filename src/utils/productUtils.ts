import {Restaraunt} from '../API';
import {Product} from '../redux/ProductsDataSlice';

export function isOutOfStock(activeShop: Restaraunt, product: Product) {
  if (activeShop.outOfStock.indexOf('Продукты/' + product.id) !== -1) {
    return true;
  } else {
    return false;
  }
}
