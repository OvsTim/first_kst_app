import React from 'react';
import {Platform, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  children?: React.ReactNode;
}

function getFontName(fontWeight?: string): string {
  if (fontWeight === '700') {
    return Platform.select({
      android: 'SFProDisplay-Bold',
      ios: 'SFProDisplay-Bold',
      default: 'Roboto',
    });
  } else if (fontWeight === '500') {
    return Platform.select({
      android: 'SFProDisplay-Medium',
      ios: 'SFProDisplay-Medium',
      default: 'Roboto',
    });
  } else if (fontWeight === '400') {
    return Platform.select({
      android: 'SFProDisplay-Regular',
      ios: 'SFProDisplay-Regular',
      default: 'Roboto',
    });
  } else {
    return 'Roboto';
  }
}

export function withFontInput<T extends Props>(
  WrappedComponent: React.ComponentType<Props>,
) {
  function ComponentWithFontInput(props: T) {
    return (
      <WrappedComponent
        {...props}
        style={[
          {
            fontFamily:
              props.style && 'fontFamily' in props.style
                ? props.style.fontFamily
                : !(props.style && 'fontWeight' in props.style)
                ? 'Roboto'
                : getFontName(props.style.fontWeight),
          },
          props.style,
        ]}
      />
    );
  }

  return ComponentWithFontInput;
}
