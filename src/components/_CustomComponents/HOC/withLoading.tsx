import React from 'react';
import {View, ViewProps} from 'react-native';
import * as Progress from 'react-native-progress';

interface WithLoadingProps {
  loading?: boolean;
}

interface Props extends WithLoadingProps, ViewProps {}

export function withLoading<T extends Props>(
  WrappedComponent: React.ComponentType<any>,
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  function ComponentWithPressable(props: T) {
    return (
      <View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        {props.loading ? (
          <Progress.CircleSnail color={['#DEDEDE', 'white']} />
        ) : (
          <WrappedComponent {...(props as ViewProps)} />
        )}
      </View>
    );
  }

  ComponentWithPressable.displayName = `withLoading(${displayName})`;

  return ComponentWithPressable;
}
