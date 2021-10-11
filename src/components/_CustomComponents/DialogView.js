import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {vScale, hScale, statusBarHeight, window} from '../../utils/scaling';
import Modal from 'react-native-modal';

export class DialogView extends Component {
  render() {
    const {
      isVisible,
      swipeDirection,
      propagateSwipe,
      animationIn,
      animationInTiming,
      animationOut,
      animationOutTiming,
      avoidKeyboard,
    } = this.props;

    return (
      <Modal
        backdropTransitionOutTiming={0}
        isVisible={isVisible}
        deviceWidth={window().width}
        deviceHeight={window().height}
        swipeDirection={swipeDirection}
        style={{
          margin: 0,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        propagateSwipe={propagateSwipe}
        onModalHide={() => {
          this.props.onModalHide();
        }}
        onModalShow={() => {
          this.props.onModalHide();
        }}
        onBackdropPress={() => {
          this.props.onBackdropPress();
        }}
        onSwipeComplete={() => {
          this.props.onSwipeComplete();
        }}
        statusBarTranslucent
        animationIn={animationIn}
        animationInTiming={animationInTiming}
        animationOut={animationOut}
        animationOutTiming={animationOutTiming}
        avoidKeyboard={avoidKeyboard}>
        {this.props.children}
      </Modal>
    );
  }
}

DialogView.defaultProps = {
  isVisible: false,
  onBackdropPress: () => {
    console.log('onBackdropPress');
  }, //press outside handler
  onSwipeComplete: () => {
    console.log('onSwipeComplete');
  }, //swipe handler
  onModalHide: () => {
    console.log('onModalHide');
  },
  onModalShow: () => {
    console.log('onModalShow');
  },
  swipeDirection: ['up', 'down'], //the direction where the modal can be swiped
  propagateSwipe: false, //Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
  scrollHorizontal: false, //if horizontal scrollView needed
  animationIn: 'slideInUp', //full naming on https://github.com/oblador/react-native-animatable
  animationInTiming: 400,
  animationOut: 'slideOutDown', //full naming on https://github.com/oblador/react-native-animatable
  animationOutTiming: 400,
  avoidKeyboard: false,
};

export default DialogView;
