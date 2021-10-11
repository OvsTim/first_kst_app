import {Dimensions, Platform, StatusBar} from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const {height, width} = Dimensions.get('window');

let real_height = height;
let real_width = width;

Dimensions.addEventListener('change', e => {
  console.log('changed dimensions: ', e.window);
  const {width, height} = e.window;
  if (height !== 0) {
    real_height = height;
  }
  if (width !== 0) {
    real_width = width;
  }
});

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 640;

function checkIphoneX(w) {
  if (Platform.OS === 'ios') {
    return (
      (w === X_WIDTH && height === X_HEIGHT) ||
      (w === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    );
  }
  return false;
}

class scale {
  horizontal(size) {
    if (real_width !== 0) {
      return (real_width / guidelineBaseWidth) * size;
    } else {
      return size;
    }
  }

  vertical(size) {
    if (real_height !== 0) {
      return (real_height / guidelineBaseHeight) * size;
    } else {
      return size;
    }
  }

  window() {
    return {
      width: real_width,
      height: real_height,
    };
  }

  statusBarHeight() {
    return Platform.select({
      ios: checkIphoneX(real_width) ? 44 : 20,
      android: StatusBar.currentHeight,
      default: 0,
    });
  }
}

export const vScale = scale.prototype.vertical;
export const hScale = scale.prototype.horizontal;
export const window = scale.prototype.window;
export const statusBarHeight = scale.prototype.statusBarHeight;
