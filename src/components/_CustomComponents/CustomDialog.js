import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {StyledText as Text} from './StyledText';
import {vScale, hScale, statusBarHeight, window} from '../../utils/scaling';
import * as Progress from 'react-native-progress';
import DialogView from './DialogView';

class CustomDialog extends Component {
  renderTitle = (headerText) => {
    return (
      <View
        style={{
          height: vScale(35),
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.25)',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopRightRadius: vScale(12),
          borderTopLeftRadius: vScale(12),
        }}>
        <Text style={{fontSize: vScale(16)}}>{headerText}</Text>
      </View>
    );
  };

  renderContent = (text) => {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: vScale(15),
        }}>
        <Text style={{textAlign: 'center'}}>{text}</Text>
      </View>
    );
  };

  renderButtonsArea = () => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: vScale(10),
        }}>
        <TouchableOpacity
          style={{
            width: '50%',
            alignItems: 'center',
          }}
          onPress={() => {
            this.props.onOkPress();
          }}>
          <Text
            style={{
              fontSize: vScale(14),
              color: 'blue',
            }}>
            {'OK'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '50%',
            alignItems: 'center',
          }}
          onPress={() => {
            this.props.onCancelPress();
          }}>
          <Text
            style={{
              fontSize: vScale(14),
              color: 'blue',
            }}>
            {'Cancel'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {isVisible, headerText, contentText, cancellable} = this.props;

    return (
      <DialogView
        isVisible={isVisible}
        onBackdropPress={() => {
          if (cancellable) {
            this.props.onRequestClose();
          }
        }}
        onSwipeComplete={() => {
          this.props.onRequestClose();
        }}>
        <View
          style={{
            width: hScale(300),
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: vScale(12),
            overflow: 'hidden',
          }}>
          {this.renderTitle(headerText)}

          {this.renderContent(contentText)}

          {this.renderButtonsArea()}
        </View>
      </DialogView>
    );
  }
}

CustomDialog.defaultProps = {
  isVisible: false,
  headerText: 'Заголовок',
  contentText: 'Основной текст диалогового окна',
  cancellable: true,
  onOkPress: () => {
    console.log('onOkPress');
  },
  onCancelPress: () => {
    console.log('onCancelPress');
  },
  onRequestClose: () => {
    console.log('onRequestClose');
  },
};

export default CustomDialog;
