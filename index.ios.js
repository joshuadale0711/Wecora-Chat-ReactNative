// @flow

import { AppRegistry, Linking } from 'react-native';
//import App from './src/app';

console.disableYellowBox = true;

//Linking.getInitialURL().then(((url) => {console.log(url + "Youtube")});
setTimeout(() => {
    require('./src/app');
}, 900)
import Share from './share.ios'

AppRegistry.registerComponent('WecoraShare', () => Share)