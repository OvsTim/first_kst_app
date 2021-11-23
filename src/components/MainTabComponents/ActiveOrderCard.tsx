import DropShadow from 'react-native-drop-shadow';
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import {withFont} from '../_CustomComponents/HOC/withFont';
import * as Progress from 'react-native-progress';
import {Order} from '../../redux/ProductsDataSlice';
import {getStatusOrderString} from '../../utils/ordersUtils';
import {useNavigation} from '@react-navigation/native';

type Props = {
  order: Order;
  totalProgressLength: number;
  index: number;
};

export default function ActiveOrderCard(props: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  const navigation = useNavigation();
  const array = [...Array(props.totalProgressLength).keys()];
  return (
    <DropShadow
      style={{
        marginVertical: 10,
        shadowColor: '#000',
        alignSelf: 'center',

        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}>
      <View
        style={{
          width: width - 34,
          height: 127,
          backgroundColor: 'white',
          borderRadius: 15,
          overflow: 'hidden',
        }}>
        <Pressable
          style={{width: width - 34, height: 127, borderRadius: 15}}
          onPress={() => navigation.navigate('OrderInfo', {order: props.order})}
          android_ripple={{color: 'lightgrey', radius: 200}}>
          <StyledText
            style={{
              marginTop: 24,
              color: '#5E6370',
              fontWeight: '500',
              fontSize: 12,
              marginHorizontal: 28,
            }}>
            {'Заказ № ' + props.order.public_id}
          </StyledText>
          <StyledText
            style={{
              fontWeight: '700',
              fontSize: 20,
              marginTop: 12,
              marginHorizontal: 28,
            }}>
            {getStatusOrderString(props.order.currentStatus)}
          </StyledText>

          <FlatList
            style={{
              marginHorizontal: 26,
              marginTop: 25,
            }}
            data={array}
            horizontal={true}
            scrollEnabled={false}
            bounces={false}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <Progress.Bar
                borderColor={'transparent'}
                style={{height: 6, marginRight: 3, backgroundColor: '#E2E2E8'}}
                progress={index < props.index ? 1 : 0}
                indeterminate={index === props.index}
                borderRadius={3}
                width={(width - 88 - 10) / props.totalProgressLength}
                color={'#28B3C6'}
              />
            )}
          />
        </Pressable>
      </View>
    </DropShadow>
  );
}
