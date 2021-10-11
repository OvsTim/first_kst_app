import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {vScale, hScale} from '../../utils/scaling';
import {useNavigation} from '@react-navigation/native';

export default function BackButton({}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        height: '100%',
        paddingLeft: hScale(23),
        paddingRight: hScale(23),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
      onPress={() => {
        navigation.goBack();
      }}>
      <Image
        style={{height: vScale(29), width: hScale(29), tintColor: 'white'}}
        source={require('../../assets/back.png')}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
}
