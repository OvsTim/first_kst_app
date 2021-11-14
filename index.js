/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

global.XMLHttpRequest = global.originalXMLHttpRequest
  ? global.originalXMLHttpRequest
  : global.XMLHttpRequest;
global.FormData = global.originalFormData
  ? global.originalFormData
  : global.FormData;

fetch;

import './src/utils/i18n';

Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
  includeFontPadding: false,
};
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
  includeFontPadding: false,
};

AppRegistry.registerComponent(appName, () => App);
