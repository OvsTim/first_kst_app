import React, {useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import YaMap, {Marker} from 'react-native-yamap';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Map'>;
};
export default function MapScreen({}: Props) {
  const mapref = useRef<YaMap>(null);

  useEffect(() => {
    mapref.current?.fitAllMarkers();
  }, []);

  const array = [
    {lat: 50, lon: 50},
    {lat: 50.234, lon: 50.234},
    {lat: 50.345, lon: 50.345},
  ];

  return (
    <YaMap style={{flex: 1}} ref={mapref}>
      {array.map((marker, index) => (
        <Marker
          key={index}
          point={{lat: marker.lat, lon: marker.lon}}
          onPress={() => {
            Alert.alert('123', JSON.stringify(array[index]));
          }}
          source={require('../../assets/marker.png')}
        />
      ))}
    </YaMap>
  );
}
