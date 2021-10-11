import 'react-i18next';
import {resources} from '../../src/utils/i18n';

declare module 'react-i18next' {
  type DefaultResources = typeof resources['ru'];
  interface Resources extends DefaultResources {}
}
