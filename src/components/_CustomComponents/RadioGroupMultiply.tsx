import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {hScale, vScale} from '../../utils/scaling';

export type RadioGroupMultiplyProps = {
  data: any[];
  onItemSelected: (index: number[]) => void;
  renderItem: (item: any, index: number) => void;
  selected: number[];
  style?: ViewStyle;
  itemContainerStyle?: ViewStyle;
};

export type RadioGroupItemMultiplyProps = {
  item: any;
  index: number;
  renderItem: (item: any, index: number) => void;
  onSelect: (index: number, selected: boolean) => void;
  itemContainerStyle?: ViewStyle;
  selected: number[];
};

function RadioGroupMultiplyItem({
  index,
  onSelect,
  renderItem,
  item,
  selected,
  itemContainerStyle,
}: RadioGroupItemMultiplyProps) {
  const [_selected, setSelected] = useState<boolean>(
    selected?.includes(index) ?? false,
  );

  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(index, !_selected);
        setSelected(!_selected);
      }}
      key={Math.random()}
      style={[
        {flexDirection: 'row', alignItems: 'center'},
        itemContainerStyle,
      ]}>
      <View style={styles.button}>
        {_selected && <View style={styles.checked} />}
      </View>
      {renderItem(item, index)}
    </TouchableOpacity>
  );
}

export default function RadioGroupMultiply({
  data,
  renderItem,
  onItemSelected,
  itemContainerStyle,
  style,
  selected,
}: RadioGroupMultiplyProps) {
  const [selected_multiply, setSelectedMultiply] = useState<number[]>(selected);

  useEffect(() => {
    onItemSelected(selected_multiply);
  }, [selected_multiply]);

  function addIndex(number: number) {
    setSelectedMultiply([...selected_multiply, number]);
  }

  function removeIndex(number: number) {
    setSelectedMultiply(
      // @ts-ignore
      selected_multiply.flatMap((index: number) => {
        return index === number ? [] : index;
      }),
    );
  }

  function onSelectMultiply(index: number, flag: boolean) {
    flag ? addIndex(index) : removeIndex(index);
  }
  return (
    <View style={style}>
      {data.map((item, index) => {
        return (
          <RadioGroupMultiplyItem
            key={index}
            item={item}
            index={index}
            itemContainerStyle={itemContainerStyle}
            renderItem={renderItem}
            selected={selected}
            onSelect={onSelectMultiply}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFF',
    marginLeft: hScale(16),
    height: vScale(20),
    width: vScale(20),
    borderColor: '#E0E0E0',
    borderRadius: vScale(10),
    borderWidth: hScale(2),
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#67b437',
    borderRadius: vScale(12 / 2),
    height: vScale(12),
    width: vScale(12),
  },
});

RadioGroupMultiply.defaultProps = {
  selected: [],
};
RadioGroupMultiplyItem.defaultProps = {
  selected: [],
  onSelect: (index: number, selected: boolean) => {
    console.log('onItemSelected', index, selected);
  },
};
