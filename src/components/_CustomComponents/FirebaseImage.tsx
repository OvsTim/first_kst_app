import {Image, ImageStyle} from 'react-native';
import storage from '@react-native-firebase/storage';
import {useEffect, useState} from 'react';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder, {
  createShimmerPlaceholder,
} from 'react-native-shimmer-placeholder';
import {useAppDispatch, useSelector} from '../../redux';
import {ImageMap, setImageUrl} from '../../redux/UserDataSlice';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
type Props = {
  innerUrl: string;
  imageStyle: ImageStyle;
};

export default function FirebaseImage(props: Props) {
  const dispatch = useAppDispatch();
  const imagesMap: ImageMap = useSelector(state => state.data.images);
  const [url, setUrl] = useState<string>(
    imagesMap[props.innerUrl] ? imagesMap[props.innerUrl] : '',
  );
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const imageRef = React.createRef<ShimmerPlaceholder>();
  useEffect(() => {
    if (url === '') {
      const reference = storage().refFromURL(props.innerUrl);
      reference
        .getDownloadURL()
        .then(res => {
          setUrl(res);
          dispatch(setImageUrl({ref: props.innerUrl, url: res}));
        })
        .catch(er => console.log('er', er));
    }
  }, [url]);

  return (
    <ShimmerPlaceHolder
      ref={imageRef}
      style={[{height: 200, width: 200}, props.imageStyle]}
      visible={isFetched}>
      <Image
        loadingIndicatorSource={require('../../assets/img_ph.png')}
        source={url !== '' ? {uri: url} : require('../../assets/img_ph.png')}
        style={[{height: 200, width: 200}, props.imageStyle]}
        onLoadEnd={() => setIsFetched(true)}
      />
    </ShimmerPlaceHolder>
  );
}
