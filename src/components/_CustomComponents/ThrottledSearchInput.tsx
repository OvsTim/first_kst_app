import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  Image,
  ViewStyle,
  TextInputProps,
  Pressable,
  useWindowDimensions,
} from 'react-native';
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
  const {width} = useWindowDimensions();
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
          paddingHorizontal: 12,
          left: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
        }}>
        {props.showSearchIcon && value === '' ? (
          <Image
            style={{
              width: 15,
              height: 15,
              tintColor: 'gray',
            }}
            source={require('../../assets/magnifyingglass.png')}
            resizeMode={'contain'}
          />
        ) : (
          <Image
            style={{
              width: 15,
              height: 15,
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
          width: width - 32,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#7676801F',
          borderRadius: 10,
        },
        props.styleContainer,
      ]}>
      <TextInput
        style={[
          {
            alignSelf: 'center',
            width: '100%',
            paddingRight: 12,
            paddingLeft: 30,
            fontSize: 17,
            paddingVertical: 0,
            textAlignVertical: 'center',
            includeFontPadding: false,
            fontFamily: 'SFProDisplay-Regular',
          },
          props.styleInput,
        ]}
        placeholder={'Например, роллы'}
        multiline={false}
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
