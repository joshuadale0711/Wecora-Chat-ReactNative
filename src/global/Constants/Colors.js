// @flow
import {
  Platform
} from 'react-native';
const tintColor = '#fff';

export default {
  tintColor,
  loginBackgroundColor: '#E55A4F',
  backgroundColor: '#F5F5F5',
  blackColor: '#222222',
  textLight: '#ffffff',
  inputDefaultColor: '#FFFFFF',
  inputPressedColor: '#EBEBEB',
  inputlabelColor: '#0000008a',
  inputTextColor: '#000000de',
  textBlack: '#000000',
  statusBarColor: '#E55A4F',
  statusBarTextColor: 'light',
  textOpacity: Platform.OS == 'ios' ? 0.7 : 0.52,
  itemPressedColor: '#EBEBEB',
  errorText: '#E55A50',
  fontBig: 16,
  fontSmall: 14,
  fontExraBig: 18,
  iconSizeBig: 80,
}
