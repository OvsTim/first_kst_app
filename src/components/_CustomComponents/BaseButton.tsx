import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {StyledText as Text} from './StyledText';
import {vScale, hScale} from '../../utils/scaling';
import {withPressable} from './HOC/withPressable';

const Button = withPressable(View);

export type BaseButtonProps = {
  active?: boolean; //флаг активности - меняется поведение и стиль кнопки
  width?: number;
  height?: number;
  borderRadius?: number; //скругление краёв нажимабельной области
  text: string; //текст внутри кнопки
  textStyle?: StyleProp<TextStyle>; //стиль текста внутри кнопки
  containerStyle?: StyleProp<ViewStyle>; // стиль кнопки основной (нажимабельная область)
  loading?: boolean; //индикатор загрузки
  onPress: () => void;
};

export default function BaseButton({
  active,
  text,
  loading,
  onPress,
  ...styleProps
}: BaseButtonProps) {
  return (
    <Button
      containerStyle={[
        {
          height: styleProps.height,
          width: styleProps.width,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: active ? '#67b437' : '#D8D8D8',
          borderWidth: vScale(1),
          borderColor: 'transparent',
          borderRadius: styleProps.borderRadius,
        },
        styleProps.containerStyle,
      ]}
      loading={loading}
      onPress={() => {
        if (active) {
          onPress();
        }
      }}>
      <Text style={styleProps.textStyle}>{text}</Text>
    </Button>
  );
}

BaseButton.defaultProps = {
  active: true,
  width: hScale(300),
  height: vScale(42),
  borderRadius: hScale(16),
  text: 'Кнопка',
  textStyle: {color: 'white', fontSize: vScale(18)},
  containerStyle: {},
  loading: false,
  onPress: () => {
    console.log('onPress');
  },
};
