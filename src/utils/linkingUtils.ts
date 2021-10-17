import {Linking, Platform} from 'react-native';

const openApp = async (url: string, iosLink: string, androidLink: string) => {
  try {
    return await Linking.openURL(url);
  } catch (err) {
    const urlMarket = Platform.OS === 'ios' ? iosLink : androidLink;
    return await Linking.openURL(urlMarket);
  }
};

const isString = (str: string) =>
  Object.prototype.toString.call(str) === '[object String]';

export const openWhatsApp = async (number: string) => {
  if (!number) {
    return Promise.reject('no number provided');
  }

  if (!isString(number)) {
    return Promise.reject('number should be string');
  }

  return await openApp(
    `whatsapp://send?phone=${number}`,
    'itms-apps://itunes.apple.com/us/app/id310633997?mt=8',
    'market://details?id=com.whatsapp',
  );
};
