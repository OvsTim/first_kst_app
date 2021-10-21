import React, {useState} from 'react';
import {
  View,
  TextInput,
  ViewStyle,
  TextInputProps,
  useWindowDimensions,
} from 'react-native';

type Props = {
  value: string;
  onTextChanges: (term: string) => void;
  styleInput: ViewStyle;
  styleContainer: ViewStyle;
  editable: boolean;
  placeholder: string;
  inputProps: TextInputProps;
};

export default function AuthBaseInput(props: Props) {
  const {width} = useWindowDimensions();
  function handleInput(input: string) {
    props.onTextChanges(input);
  }

  return (
    <View
      style={[
        {
          width,
          marginLeft: 19,
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: '#D3D5DD',
        },
        props.styleContainer,
      ]}>
      <TextInput
        style={[
          {
            width: '100%',
            paddingRight: 12,
            paddingLeft: 12,
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
        value={props.value}
        editable={props.editable}
        placeholder={props.placeholder}
        underlineColorAndroid={'rgba(0,0,0,0)'}
      />
    </View>
  );
}

AuthBaseInput.defaultProps = {
  value: '',
  onTextChanges: () => {},
  styleInput: {}, //стиль для поля ввода текста
  styleContainer: {}, // стиль для контейнера, в котором находится поле ввода
  editable: true,
  placeholder: '',
  inputProps: {},
};
