import {Image, ImageStyle} from 'react-native';
import storage from '@react-native-firebase/storage';
import {useEffect, useState} from 'react';
import React from 'react';

type Props = {
  innerUrl: string;
  imageStyle: ImageStyle;
};

export default function FirebaseImage(props: Props) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    let url = props.innerUrl;
    let parts = url.split('/');
    //берем 2 последние части и собираем путь
    let realURL = '/' + parts[parts.length - 2] + '/' + parts[parts.length - 1];
    const reference = storage().ref(realURL);
    reference.getDownloadURL().then(res => {
      setUrl(res);
    });
  }, []);

  return (
    <Image
      loadingIndicatorSource={require('../../assets/img_ph.png')}
      source={url !== '' ? {uri: url} : require('../../assets/img_ph.png')}
      style={[{height: 200, width: 200}, props.imageStyle]}
    />
  );
}
