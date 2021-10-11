import React from 'react';
import {
  Pressable,
  Platform,
  ViewProps,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';
import {withLoading} from './withLoading';

interface WithPressableProps {
  onPress: () => void;
  loading?: boolean;
  children?: React.ReactNode;
  containerStyle: StyleProp<ViewStyle> | ViewStyle;
  androidRippleRadius?: number;
}

interface Props extends WithPressableProps, ViewProps {}

export function withPressable<T extends Props>(
  WrappedComponent: React.ComponentType<any>,
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const LoadingView = withLoading(WrappedComponent);

  function ComponentWithPressable(props: T) {
    return (
      <View style={[props.containerStyle, {overflow: 'hidden'}]}>
        <Pressable
          android_ripple={{
            color: 'grey',
            radius: props.androidRippleRadius ?? 200,
          }}
          style={({pressed}) => [
            props.containerStyle,
            {
              alignItems: 'center',
              justifyContent: 'center',
            },
            Platform.OS === 'ios' && pressed && {backgroundColor: 'grey'},
          ]}
          onPress={() => {
            props.onPress();
          }}>
          <LoadingView {...(props as ViewProps)} loading={props.loading} />
        </Pressable>
      </View>
    );
  }

  ComponentWithPressable.displayName = `withPressable(${displayName})`;

  return ComponentWithPressable;
}
