// @flow

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../config.json';


export default {
  TAB_1          : require('../../../img/one.png'),
  TAB_1_selected : require('../../../img/one_selected.png'),
  SIDE_MENU      : require('.../../../img/navicon_menu.png'),
  EllIPSE : require('../../../resources/images/ellipse.png'),
  Wecora : require('../../../resources/images/wecora_icon_trans.png'),
  Icon:  createIconSetFromFontello(fontelloConfig)
}
