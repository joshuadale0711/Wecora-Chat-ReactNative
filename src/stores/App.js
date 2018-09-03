// @flow

import { Platform, Linking } from 'react-native';
import { observable, action } from 'mobx';
import Account from './Account'
import SaveItem from './SaveItem'
import Projects from './Projects'
import Boards from './Boards'

import Constants from '../global/Constants';


class Store {
  @observable rootNavigator = null; // so we can nagigate from DRAWER

  @observable isAndroid = Platform.OS === 'android';
  @observable isIOS = Platform.OS === 'ios';

  @observable notification = undefined

  navigate = () => {
    setTimeout(() => {
      var screen = Account.authorized ?
        { ...Constants.Screens.PUSHED_SCREEN, animated: false } :
        { ...Constants.Screens.SIGNIN_SCREEN, animated: false }
      if (SaveItem.shared) {
        screen = Account.authorized ?
          { ...Constants.Screens.PUSHED_SCREEN, animated: false } :
          { ...Constants.Screens.SIGNIN_SCREEN, animated: false }
        if (SaveItem.parseURL) {
          screen = Account.authorized ?
            { ...Constants.Screens.PARSER_SCREEN, animated: false, } :
            { ...Constants.Screens.SIGNIN_SCREEN, animated: false }
        }
      }
      this.rootNavigator && this.rootNavigator.resetTo(screen)
    }, 800)

  }

  navigateToScreen = (item, screen) => {
    //console.log(item)
    setTimeout(() => {
      this.rootNavigator.push({
        ...screen,
        title: item.name,
        passProps: { item }
      });
    }, 2000)
  }

  navigateNotification = async (pId, bId) => {
    const project = await Projects.setList(pId)
    const board = await Boards.setList(project, bId)

      this.rootNavigator.resetTo({
        ...Constants.Screens.CHATS_SCREEN,
        title: board.name,
        passProps: { item: board },
        animated: false,
      });


    return
  }

}

export default new Store();
