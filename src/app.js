// @flow

import Provider       from './utils/MobxRnnProvider';
import Stores         from './stores';
import Constants      from './global/Constants';

import { registerScreens } from './screens';
registerScreens(Stores, Provider);
//console.disableYellowBox = true
Constants.Global.startSingleScreenApp()
// setTimeout(() => 
// Constants.Global.startSingleScreenApp() , 10000)



// "appId": "540969",
// "key": "25e0cbe40803b4b4a817",
// "secret": "ffc2975f10da3537d81e",
// "cluster": "us2"
