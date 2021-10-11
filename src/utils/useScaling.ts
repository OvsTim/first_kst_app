import {useWindowDimensions} from 'react-native';

export const useScaling = () => {
  const {width, height} = useWindowDimensions();
  const designHeight: number = 896;
  const designWidth: number = 414;
  const h = (points: number) => {
    return points * (width / designWidth);
  };

  const v = (points: number) => {
    return points * (height / designHeight);
  };

  return {h, v};
};
