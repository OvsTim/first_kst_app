import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  Image,
  ViewStyle,
  TextInputProps,
  Pressable,
} from 'react-native';
import {vScale, hScale, window} from '../../utils/scaling';

type Props = {
  value: string;
  throttle?: number;
  onThrottledChange: (term: string) => void;
  onTextChanges: (term: string) => void;
  styleInput: ViewStyle;
  styleContainer: ViewStyle;
  editable: boolean;
  showClearIcon?: boolean;
  showSearchIcon?: boolean;
  placeholder: string;
  inputProps: TextInputProps;
};

function throttle(func: Function, ms: number): Function {
  let savedArgs: any, timeout: any;

  function wrapper(this: any): any {
    clearTimeout(timeout);

    savedArgs = arguments;

    timeout = setTimeout(() => {
      if (savedArgs) {
        func.apply(this, arguments);
        savedArgs = null;
      }
    }, ms);
  }

  return wrapper;
}

export default function ThrottledSearchInput(props: Props) {
  const [value, setValue] = useState<string>(props.value);
  const throttled = useRef(
    throttle((term: string) => {
      props.onThrottledChange(term);
    }, props.throttle || 300),
  );
  useEffect(() => throttled.current(value), [value]);

  function handleInput(input: string) {
    props.onTextChanges(input);
    setValue(input);
  }

  function renderSearchIcon() {
    if (!props.showSearchIcon && !props.showClearIcon) {
      return;
    }

    return (
      <Pressable
        onPress={() => {
          setValue('');
        }}
        style={{
          position: 'absolute',
          paddingHorizontal: hScale(12),
          right: 0,
          top: vScale(0),
          bottom: 0,
          justifyContent: 'center',
        }}>
        {props.showSearchIcon && value === '' ? (
          <Image
            style={{
              width: hScale(24),
              height: hScale(24),
              tintColor: 'gray',
            }}
            source={require('../../assets/search.png')}
            resizeMode={'contain'}
          />
        ) : (
          <Image
            style={{
              width: hScale(15),
              height: hScale(15),
              alignSelf: 'center',
              tintColor: 'gray',
            }}
            source={require('../../assets/clear.png')}
            resizeMode={'contain'}
          />
        )}
      </Pressable>
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
          backgroundColor: '#E5E5E5',
          borderRadius: vScale(5),
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
          },
          props.styleInput,
        ]}
        onChangeText={terms => {
          handleInput(terms);
        }}
        {...props.inputProps}
        value={value}
        underlineColorAndroid={'rgba(0,0,0,0)'}
      />
      {renderSearchIcon()}
    </View>
  );
}

ThrottledSearchInput.defaultProps = {
  value: '',
  throttle: 300,
  onThrottledChange: () => {},
  onTextChanges: () => {},
  styleInput: {}, //стиль для поля ввода текста
  styleContainer: {}, // стиль для контейнера, в котором находится поле ввода
  editable: true,
  showClearIcon: true, // отображение иконки типа "крестик", очищающей поле ввода
  showSearchIcon: true, // отображение иконки типа "лупа" как индикатора поля поиска
  placeholder: 'Искать',
  inputProps: {},
};
