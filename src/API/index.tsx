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
  recommendations: Array<any>;
  outOfStock: Array<DocumentReference>;
  coords: {lat: number; lan: number};
}
export function getImages(url: string) {
  return axios.get<Image[]>(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
