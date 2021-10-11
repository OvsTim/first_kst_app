import React from 'react';
import {Text} from 'react-native';
import {vScale, hScale} from '../../utils/scaling';

export class StyledText extends React.Component {
  render() {
    const {style = {}, focused = false} = this.props;

    const {fontWeight} = style;

    return (
      <Text
        {...this.props}
        style={[
          {
            fontFamily:
              fontWeight === 'bold' ? 'Roboto-Bold' : 'Roboto-Regular',
            color: '#363636',
            fontSize: vScale(20),
          },
          style,
        ]}
        focused={focused}>
        {this.props.children}
      </Text>
    );
  }
}

export default StyledText;
