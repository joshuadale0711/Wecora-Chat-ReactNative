// @flow

import Constants from '../../Constants';

// [more info] - https://wix.github.io/react-native-navigation/#/styling-the-navigator
export default {
  navBarTextColor       : Constants.Colors.blackColor,
  navBarBackgroundColor : Constants.Colors.loginBackgroundColor,
  navBarButtonColor     : Constants.Colors.tintColor,
  screenBackgroundColor : Constants.Colors.loginBackgroundColor,
  navBarTextColor : Constants.Colors.textLight,

   statusBarTextColorScheme : Constants.Colors.statusBarTextColor, // make sure that in Xcode > project > Info.plist, the property View controller-based status bar appearance is set to YES
}
