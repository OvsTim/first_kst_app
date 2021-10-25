import axios from 'axios';

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
export function getImages(url: string) {
  return axios.get<Image[]>(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
