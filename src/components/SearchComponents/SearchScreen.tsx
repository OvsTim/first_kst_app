import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import ThrottledSearchInput from '../_CustomComponents/ThrottledSearchInput';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {Product} from '../../redux/ProductsDataSlice';
import {RootState} from '../../redux';
import Fuse from 'fuse.js';
import {ProductItem} from '../MainTabComponents/ProductItem';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Search'>;
};
const StyledText = withFont(Text);

export default function SearchScreen({navigation}: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const {width} = useWindowDimensions();
  const productsMap: Record<string, Product> = useSelector(
    (state: RootState) => state.products.products,
  );
  const products: Array<Product> = useSelector((state: RootState) =>
    state.products.productIds.map(it => productsMap[it]),
  );

  const [searchResult, setSearchResult] = useState<Array<Product>>([]);
  useEffect(() => {
    let result = [];
    if (searchTerm.trim() !== '') {
      let options = {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: ['name'],
      };
      let fuse = new Fuse(products, options);
      result = fuse.search(searchTerm);
      setSearchResult(result.map(it => it.item));
    } else {
      setSearchResult([]);
    }
  }, [searchTerm]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 25,
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <View style={{width, flexDirection: 'row'}}>
        <ThrottledSearchInput
          styleContainer={{width: width - 100, marginLeft: 20}}
          onThrottledChange={(term: string) => {
            setSearchTerm(term);
          }}
        />
        <Pressable
          onPress={() => navigation.goBack()}
          android_ripple={{color: 'lightgrey', radius: 200}}
          style={{
            width: 80,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <StyledText
            style={{color: '#28B3C6', fontSize: 17, fontWeight: '400'}}>
            Отмена
          </StyledText>
        </Pressable>
      </View>
      <FlatList
        keyboardShouldPersistTaps={'always'}
        data={searchResult}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <ProductItem product={item} />}
      />
    </View>
  );
}
