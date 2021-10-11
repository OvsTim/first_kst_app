import React, {ReactElement, useRef, useState} from 'react';
import {FlatList, View, useWindowDimensions, Animated} from 'react-native';
import BaseButton, {BaseButtonProps} from './BaseButton';

interface OnboardingProps<T> {
  data: T[];
  renderItem: (item: Record<'item', T>) => ReactElement;
  nextButtonVisible?: boolean;
  nextButtonProps?: Partial<BaseButtonProps>;
}

interface DotProps<T> {
  data: T[];
  scrollX: Animated.Value;
}

function DotPaginator<T extends object>({data, scrollX}: DotProps<T>) {
  const {width} = useWindowDimensions();
  return (
    <View style={{flexDirection: 'row', marginBottom: 30}}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[
              {
                height: 10,
                borderRadius: 5,
                backgroundColor: 'yellow',
                marginHorizontal: 7,
              },
              {width: dotWidth, opacity: opacity},
            ]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
}

export default function Onboarding<T extends object>({
  data,
  renderItem,
  nextButtonVisible,
  nextButtonProps,
}: OnboardingProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides] = useState([...data]);
  const scrollX = useRef(new Animated.Value(0));
  const flatlistRef = useRef<FlatList>(null);

  const onViewRef = React.useRef(({viewableItems}: any) => {
    setCurrentIndex(viewableItems[0].index || 0);
  });
  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  function scrollNext() {
    if (currentIndex !== slides.length - 1) {
      if (flatlistRef.current) {
        flatlistRef.current.scrollToIndex({index: currentIndex + 1});
      }
    }
  }

  return (
    <View>
      <FlatList
        ref={flatlistRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(_, index) => index.toString()}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX.current}}}],
          {useNativeDriver: false},
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        scrollEventThrottle={32}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          right: 0,
          left: 0,
          alignItems: 'center',
        }}>
        <DotPaginator data={data} scrollX={scrollX.current} />
        {nextButtonVisible && (
          <BaseButton {...nextButtonProps} onPress={scrollNext} />
        )}
      </View>
    </View>
  );
}
