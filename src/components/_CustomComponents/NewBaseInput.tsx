import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Ref,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {withFont} from './HOC/withFont';

type Props = {
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  type?: 'input' | 'sex' | 'date';
  placeholder?: string;
  editable?: boolean;
  value?: string;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onKeyPress?: () => void;
  blurOnSubmit?: boolean;
  multiline?: boolean;
  maxLength?: number;
  error?: boolean;
  onChangeText?: () => void;
  styleInput: ViewStyle;
  styleContainer: ViewStyle;
  showLabel: boolean;
  label: string;
  secondLabel?: string;
  inputProps: TextInputProps;
  labelStyle: TextStyle;
  inputRef?: Ref<TextInput>;
};

export interface InputRefType {
  focus: () => void;
  getValue: () => string;
  setValue: (v: string) => void;
}

const InputFieldView: ForwardRefRenderFunction<InputRefType, Props> = (
  {
    placeholder,
    value,
    keyboardType,
    returnKeyType,
    onKeyPress,
    blurOnSubmit,
    multiline,
    maxLength,
    onChangeText,
    label,
    inputProps,
    labelStyle,
    styleInput,
    secondLabel,
    showLabel,
    styleContainer,
    type,
  }: Props,
  ref,
) => {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState<string>(value || '');
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef?.current?.focus();
    },
    getValue: () => {
      return text;
    },
    setValue: v => {
      setText(v);
    },
  }));
  function renderLabel() {
    return (
      <StyledText
        style={[
          {
            paddingTop: 13,
            alignSelf: 'flex-start',
            fontWeight: '400',
            color: '#5D626F',
            fontSize: 12,
          },
          labelStyle,
        ]}>
        {label}
        {secondLabel && (
          <StyledText style={{color: '#00000033'}}>{secondLabel}</StyledText>
        )}
      </StyledText>
    );
  }

  return (
    <View
      style={[
        {
          width,
          marginLeft: 19,
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderBottomWidth: 1,
          borderBottomColor: '#F2F2F6',
        },
        styleContainer,
      ]}>
      {showLabel && renderLabel()}
      <TextInput
        ref={inputRef}
        style={[
          {
            width: '100%',
            paddingRight: 12,
            paddingLeft: 0,
            fontSize: 15,
            lineHeight: 18,
            fontWeight: '400',
            height: 40,
            color: 'black',
          },
          styleInput,
        ]}
        multiline={multiline || false}
        placeholderTextColor={'#A0A0A0'}
        placeholder={placeholder}
        value={text}
        onChangeText={it => {
          if (keyboardType === 'number-pad') {
            setText(it.replace(/[^0-9.]/g, ''));
          } else {
            setText(it);
          }

          onChangeText && onChangeText();
        }}
        {...inputProps}
        maxLength={maxLength}
        keyboardType={keyboardType || 'default'}
        returnKeyType={returnKeyType || 'next'}
        blurOnSubmit={blurOnSubmit || false}
        // onSubmitEditing={() => {
        //   if (onKeyPress) {
        //     onKeyPress();
        //   }
        // }}
      />
    </View>
  );
};

export default forwardRef(InputFieldView);
