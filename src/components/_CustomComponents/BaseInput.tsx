import React, {useState} from 'react';
import {
  View,
  TextInput,
  ViewStyle,
  TextInputProps,
  TextProps,
  Text,
} from 'react-native';
import {vScale, hScale, window} from '../../utils/scaling';

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

  function handleInput(input: string) {
    props.onTextChanges(input);
    setValue(input);
  }

  function renderLabel() {
    return (
      <View
        style={{
          position: 'absolute',
          left: hScale(16),
          top: -vScale(16) / 2,
          backgroundColor: 'lightgray',
          height: vScale(16),
          paddingHorizontal: hScale(15),
          borderRadius: vScale(16) / 2,
        }}>
        <Text
          style={[
            {
              color: 'gray',
            },
            props.labelStyle,
          ]}>
          {props.label}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          width: window().width - hScale(32),
          height: vScale(44),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: vScale(6),
          borderWidth: vScale(2),
          borderColor: 'lightgray',
          backgroundColor: 'transparent',
        },
        props.styleContainer,
      ]}>
      <TextInput
        style={[
          {
            width: '100%',
            paddingRight: hScale(32),
            paddingLeft: hScale(12),
            fontSize: vScale(14),
            backgroundColor: 'transparent',
          },
          props.styleInput,
        ]}
        onChangeText={terms => {
          handleInput(terms);
        }}
        {...props.inputProps}
        value={value}
        placeholder={props.placeholder}
        underlineColorAndroid={'rgba(0,0,0,0)'}
      />
      {props.showLabel && renderLabel()}
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
