import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {StyledText as Text} from './StyledText';
import {vScale, hScale, window} from '../../utils/scaling';
import {withPressable} from './HOC/withPressable';
import {withFont} from './HOC/withFont';

const Button = withPressable(View);
const StyledText = withFont(Text);

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
          backgroundColor: '#28B3C6',
          borderWidth: 1,
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
      <StyledText style={[styleProps.textStyle, {fontWeight: '700'}]}>
        {text}
      </StyledText>
    </Button>
  );
}

BaseButton.defaultProps = {
  active: true,
  width: window().width - 60,
  height: 50,
  borderRadius: 25,
  text: 'Кнопка',
  textStyle: {color: 'white', fontSize: 18},
  containerStyle: {},
  loading: false,
  onPress: () => {
    console.log('onPress');
  },
};
