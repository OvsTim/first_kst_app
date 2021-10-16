import React, {useState} from 'react';
import {
  View,
  TextInput,
  ViewStyle,
  TextInputProps,
  TextProps,
  Text,
  useWindowDimensions,
} from 'react-native';
import {withFont} from './HOC/withFont';
import {withFontInput} from './HOC/withFontInput';

type Props = {
  value: string;
  onTextChanges: (term: string) => void;
  styleInput: ViewStyle;
  styleContainer: ViewStyle;
  editable: boolean;
  placeholder: string;
  showLabel: boolean;
  label: string;
  inputProps: TextInputProps;
  labelStyle: TextProps;
};

export default function BaseInput(props: Props) {
  const [value, setValue] = useState<string>(props.value);
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  const StyledInput = withFontInput(TextInput);
  function handleInput(input: string) {
    props.onTextChanges(input);
    setValue(input);
  }

  function renderLabel() {
    return (
      <StyledText
        style={[
          {
            paddingTop: 13,
            alignSelf: 'flex-start',
            fontWeight: '400',
            color: '#5D626F',
          },
          props.labelStyle,
        ]}>
        {props.label}
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
        props.styleContainer,
      ]}>
      {props.showLabel && renderLabel()}

      <StyledInput
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
          props.styleInput,
        ]}
        onChangeText={terms => {
          handleInput(terms);
        }}
        {...props.inputProps}
        value={value}
        editable={props.editable}
        placeholder={props.placeholder}
        underlineColorAndroid={'rgba(0,0,0,0)'}
      />
    </View>
  );
}

BaseInput.defaultProps = {
  value: '',
  onTextChanges: () => {},
  styleInput: {}, //стиль для поля ввода текста
  styleContainer: {}, // стиль для контейнера, в котором находится поле ввода
  editable: true,
  placeholder: 'Текст',
  showLabel: true,
  label: 'Текст',
  inputProps: {},
  labelStyle: {},
};
