import axios from 'axios';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import DocumentReference = FirebaseFirestoreTypes.DocumentReference;

export interface Image {
  id: number;
  author: string;
  url: string;
}
export interface Address {
  id: string;
  street: string;
  house: string;
  flat: string;

  name?: string;
  entrance?: string;
  floor?: string;
  code?: string;
  commentary?: string;
}

export interface Restaraunt {
  id: string;
  address: string;
  phone: string;
  name: string;
  delivery: Record<string, string>;
  workHours: Record<string, string>;
  recommendations: Array<string>;
  outOfStock: Array<string>;
  coords: {lat: number; lan: number};
}

export interface Stock {
  id: string;
  name: string;
  image: string;
  description: string;
  productId: string;
}

export function getImages(url: string) {
  return axios.get<Image[]>(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
