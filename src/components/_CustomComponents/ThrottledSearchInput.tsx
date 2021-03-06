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
      <Image
        style={{
          position: 'absolute',
          paddingHorizontal: 12,
          left: 5,
          justifyContent: 'center',
          width: 15,
          height: 15,
          tintColor: 'gray',
        }}
        source={require('../../assets/magnifyingglass.png')}
        resizeMode={'contain'}
      />
      <TextInput
        style={[
          {
            alignSelf: 'center',
            width: '100%',
            paddingRight: 30,
            paddingLeft: 30,
            fontSize: 17,
            paddingVertical: 0,
            textAlignVertical: 'center',
            includeFontPadding: false,
            fontFamily: 'SFProDisplay-Regular',
          },
          props.styleInput,
        ]}
        placeholder={'????????????????, ??????????'}
        multiline={false}
        onChangeText={terms => {
          handleInput(terms);
        }}
        {...props.inputProps}
        value={value}
        underlineColorAndroid={'rgba(0,0,0,0)'}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => {
            setValue('');
          }}
          style={{
            position: 'absolute',
            paddingHorizontal: 12,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 15,
              height: 15,
              tintColor: 'gray',
            }}
            source={require('../../assets/clear_ios.jpg')}
          />
        </Pressable>
      )}
      {/*{renderSearchIcon()}*/}
    </View>
  );
}

ThrottledSearchInput.defaultProps = {
  value: '',
  throttle: 300,
  onThrottledChange: () => {},
  onTextChanges: () => {},
  styleInput: {}, //?????????? ?????? ???????? ?????????? ????????????
  styleContainer: {}, // ?????????? ?????? ????????????????????, ?? ?????????????? ?????????????????? ???????? ??????????
  editable: true,
  showClearIcon: true, // ?????????????????????? ???????????? ???????? "??????????????", ?????????????????? ???????? ??????????
  showSearchIcon: true, // ?????????????????????? ???????????? ???????? "????????" ?????? ???????????????????? ???????? ????????????
  placeholder: '????????????',
  inputProps: {},
};
