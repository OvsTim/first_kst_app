import {OrderStatus} from '../redux/ProductsDataSlice';

export function getStatusOrderString(status: OrderStatus) {
  switch (status) {
    case 'IS_NEW':
      return 'Оформлен';
    case 'PROCESSING':
      return 'Принят';
    case 'COOKING':
      return 'Готовим';
    case 'DELIVER':
      return 'Везем';
    case 'SUCCESS':
      return 'Получен';
    case 'CANCELLED':
      return 'Отменен';
    case 'READY':
      return 'Готов к выдаче';
  }
}

export function getIndexByStatus(status: OrderStatus) {
  switch (status) {
    case 'IS_NEW':
      return 0;
    case 'PROCESSING':
      return 1;
    case 'COOKING':
      return 2;
    case 'DELIVER':
      return 3;
    case 'SUCCESS':
      return 3;
    case 'CANCELLED':
      return 0;
    case 'READY':
      return 3;
  }
}
