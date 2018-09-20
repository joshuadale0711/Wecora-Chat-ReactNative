// @flow

import { Navigation } from 'react-native-navigation';

import Constants from '../global/Constants';

import FirstTab from './FirstTab';
import SecondTab from './SecondTab';
import Drawer from './Drawer';
import PushedScreen from './PushedScreen';
import LoginScreen from './LoginScreen';
import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import AddScreen from './AddScreen';
import BoardsScreen from './BoardsScreen';
import ChatScreen from './ChatScreen';
import ItemsScreen from './ItemsScreen';
import SearchScreen from './SearchScreen';
import ItemDetail from './ItemDetail';
import FilterScreen from './FilterScreen';
import FilterItemsScreen from './FilterItemsScreen';
import SaveScreen from './SaveScreen';
import SaveItem from './SaveItem';
import SaveItems from './SaveItems';
import SaveBoard from './SaveBoard';
import ImageViewer from './ImageViewer';
import ParserScreen from './ParserScreen';


export function registerScreens(store: {}, Provider: {}) {

  Navigation.registerComponent(Constants.Screens.SIGNIN_SCREEN.screen, () => SignInScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.SPLASH_SCREEN.screen, () => SplashScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.FIRST_TAB.screen, () => FirstTab, store, Provider);
  Navigation.registerComponent(Constants.Screens.SECOND_TAB.screen, () => SecondTab, store, Provider);

  Navigation.registerComponent(Constants.Screens.DRAWER.screen, () => Drawer, store, Provider);
  Navigation.registerComponent(Constants.Screens.PUSHED_SCREEN.screen, () => PushedScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.LOGIN_SCREEN.screen, () => LoginScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.ADD_SCREEN.screen, () => AddScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.BOARDS_SCREEN.screen, () => BoardsScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.CHATS_SCREEN.screen, () => ChatScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.ITEMS_SCREEN.screen, () => ItemsScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.SEARCH_SCREEN.screen, () => SearchScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.ITEM_DETAIL.screen, () => ItemDetail, store, Provider);
  Navigation.registerComponent(Constants.Screens.FILTER_SCREEN.screen, () => FilterScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.FILTER_ITEMS_SCREEN.screen, () => FilterItemsScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.SAVE_SCREEN.screen, () => SaveScreen, store, Provider);
  Navigation.registerComponent(Constants.Screens.SAVE_BOARD.screen, () => SaveBoard, store, Provider);
  Navigation.registerComponent(Constants.Screens.SAVE_ITEM.screen, () => SaveItem, store, Provider);
  Navigation.registerComponent(Constants.Screens.SAVE_ITEMS.screen, () => SaveItems, store, Provider);
  Navigation.registerComponent(Constants.Screens.IMAGE_VIEWER.screen, () => ImageViewer, store, Provider);
  Navigation.registerComponent(Constants.Screens.PARSER_SCREEN.screen, () => ParserScreen, store, Provider);

}
