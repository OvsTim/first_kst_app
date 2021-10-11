import axios from 'axios';

export interface Image {
  id: number;
  author: string;
  url: string;
}

export function getImages(url: string) {
  return axios.get<Image[]>(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
