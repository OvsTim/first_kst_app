import React, {Component} from 'react';
import {
  Directions,
  FlingGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';

class GestureHandler extends Component {
  constructor(props) {
    super(props);
    this.swipeState = null;
  }

  render() {
    const {onSwipeRight, onSwipeLeft, onTap, children} = this.props;

    return (
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={({nativeEvent}) => {
          //console.log('onGestureEvent ', nativeEvent);
          if (nativeEvent.state === State.ACTIVE) {
            onSwipeRight();
          }
        }}>
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={({nativeEvent}) => {
            //console.log('onGestureEvent ', nativeEvent);
            if (nativeEvent.state === State.ACTIVE) {
              onSwipeLeft();
            }
          }}>
          <TapGestureHandler
            onHandlerStateChange={({nativeEvent}) => {
              if (nativeEvent.state === State.ACTIVE) {
                onTap();
              }
            }}
            maxDelayMs={500}
            numberOfTaps={1}>
            {children}
          </TapGestureHandler>
        </FlingGestureHandler>
      </FlingGestureHandler>
    );
  }
}

GestureHandler.defaultProps = {
  onSwipeRight: () => {
    console.log('onSwipeRight');
  },
  onSwipeLeft: () => {
    console.log('onSwipeLeft');
  },
  onTap: () => {
    console.log('onTap');
  },
};

export default GestureHandler;
