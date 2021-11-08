import React, {
  forwardRef,
  ForwardRefRenderFunction,
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
  placeholderTextColor?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  styleInput: ViewStyle;
  styleContainer: ViewStyle;
  showLabel: boolean;
  label: string;
  secondLabel?: string;
  labelStyle: TextStyle;
  textContentType?:
    | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode';
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
    blurOnSubmit,
    multiline,
    maxLength,
    onChangeText,
    label,
    labelStyle,
    styleInput,
    secondLabel,
    showLabel,
    styleContainer,
    textContentType,
    onSubmitEditing,
    placeholderTextColor,
    editable,
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
        textContentType={textContentType}
        multiline={multiline || false}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : '#A0A0A0'
        }
        editable={editable}
        placeholder={placeholder}
        value={text}
        onChangeText={it => {
          if (textContentType === 'name') {
            setText(it.replace(/[^A-Za-z-\s!?]/g, ''));
          } else if (keyboardType === 'number-pad') {
            setText(it.replace(/[^0-9.]/g, ''));
          } else {
            setText(it);
          }

          onChangeText && onChangeText(it);
        }}
        maxLength={maxLength}
        keyboardType={keyboardType || 'default'}
        returnKeyType={returnKeyType || 'next'}
        blurOnSubmit={blurOnSubmit || false}
        onSubmitEditing={() => onSubmitEditing && onSubmitEditing()}
      />
    </View>
  );
};

export default forwardRef(InputFieldView);
