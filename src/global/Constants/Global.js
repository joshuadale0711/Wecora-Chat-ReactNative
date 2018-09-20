// @flow

import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Constants from '../Constants';
import TabBar from '../TabBar';

const startTabBasedApp = () => {
  Navigation.startTabBasedApp({
    tabs: [
      {
        ...Constants.Screens.FIRST_TAB
      },
      {
        ...Constants.Screens.SECOND_TAB
      }
    ],
    ...Platform.select({
      ios: {
        tabsStyle: TabBar.Main,
      },
      android: {
        appStyle: TabBar.Main,
      },
    }),
    drawer: {
      left: {
        screen: Constants.Screens.DRAWER.screen
      },
      disableOpenGesture: false
    },
  });
}

const startSingleScreenApp = () => {
  Navigation.startSingleScreenApp({
    screen: {
       ...Constants.Screens.SPLASH_SCREEN,
    },
    appStyle: {
      orientation: 'portrait',
    },
    animated: false,
  });
}



const openLoginModalIn = (navigator: { showModal: Function }, withCancelButton: boolean = true, ) => {
  navigator.showModal({
    ...Constants.Screens.LOGIN_SCREEN,
    passProps: { withCancelButton },
    overrideBackPress: true, // [Android] if you want to prevent closing a modal by pressing back button in Android
  });
}

const openAddModal = (navigator: { showModal: Function }, withCancelButton: boolean = true, title: String = '', props ) => {
  navigator.showModal({
    ...Constants.Screens.ADD_SCREEN,
    title: title,
    passProps: { ...props, withCancelButton },
    overrideBackPress: true, // [Android] if you want to prevent closing a modal by pressing back button in Android
  });
}

const openSearchModal = (navigator: { showModal: Function }, withCancelButton: boolean = true, title: String = '', props ) => {
  navigator.showModal({
    ...Constants.Screens.SEARCH_SCREEN,
    title: title,
    passProps: { ...props, withCancelButton },
    overrideBackPress: true,
  });
}

const openSaveModal = (navigator: { showModal: Function }, withCancelButton: boolean = true, title: String = '', props ) => {
  navigator.showModal({
    ...Constants.Screens.SAVE_ITEM,
    title: title,
    passProps: { ...props, withCancelButton },
    overrideBackPress: true,
  });
}

const openMultiSaveModal = (navigator: { showModal: Function }, withCancelButton: boolean = true, title: String = '', props ) => {
  navigator.showModal({
    ...Constants.Screens.SAVE_ITEMS,
    title: title,
    passProps: { ...props, withCancelButton },
    overrideBackPress: true,
  });
}

const openImageModal = (navigator: { showModal: Function }, withCancelButton: boolean = true, title: String = '', props ) => {
  navigator.showModal({
    ...Constants.Screens.IMAGE_VIEWER,
    title: title,
    passProps: { ...props, withCancelButton },
    overrideBackPress: true,
  });
}

const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);
    
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}

 removeDuplicates = (myArr, prop) =>  {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

const state = {
  DONE: 'done',
  ERROR: 'error',
  LOADING: 'loading',
  START: 'start',
  LOADINGPAGE: 'loadingPage'
}

const itemType = {
  PROJECT: 'project',
  LABEL: 'label',
  QUERY: 'query',
  BOARD: 'board',
  USER: 'user'
}

const CurrencyList = [
  { name: 'USD' },
  { name: 'EUR' },
  { name: 'GBP' },
  { name: 'AUD' },
  { name: 'CAD' },
  { name: 'JPY' },
  { name: 'BYR' },
  { name: 'AED' },
  { name: 'AFN' },
  { name: 'ALL' },
  { name: 'AMD' },
  { name: 'ANG' },
  { name: 'AOA' },
  { name: 'ARS' },
  { name: 'AWG' },
  { name: 'AZN' },
  { name: 'BAM' },
  { name: 'BBD' },
  { name: 'BDT' },
  { name: 'BGN' },
  { name: 'BHD' },
  { name: 'BIF' },
  { name: 'BMD' },
  { name: 'BND' },
  { name: 'BOB' },
  { name: 'BRL' },
  { name: 'BSD' },
  { name: 'BTN' },
  { name: 'BWP' },
  { name: 'BYN' },
  { name: 'BZD' },
  { name: 'CDF' },
  { name: 'CHF' },
  { name: 'CLF' },
  { name: 'CLP' },
  { name: 'CNY' },
  { name: 'COP' },
  { name: 'CRC' },
  { name: 'CUC' },
  { name: 'CUP' },
  { name: 'CVE' },
  { name: 'CZK' },
  { name: 'DJF' },
  { name: 'DKK' },
  { name: 'DOP' },
  { name: 'DZD' },
  { name: 'EGP' },
  { name: 'ERN' },
  { name: 'ETB' },
  { name: 'FJD' },
  { name: 'FKP' },
  { name: 'GEL' },
  { name: 'GHS' },
  { name: 'GIP' },
  { name: 'GMD' },
  { name: 'GNF' },
  { name: 'GTQ' },
  { name: 'GYD' },
  { name: 'HKD' },
  { name: 'HNL' },
  { name: 'HRK' },
  { name: 'HTG' },
  { name: 'HUF' },
  { name: 'IDR' },
  { name: 'ILS' },
  { name: 'INR' },
  { name: 'IQD' },
  { name: 'IRR' },
  { name: 'ISK' },
  { name: 'JMD' },
  { name: 'JOD' },
  { name: 'KES' },
  { name: 'KGS' },
  { name: 'KHR' },
  { name: 'KMF' },
  { name: 'KPW' },
  { name: 'KRW' },
  { name: 'KWD' },
  { name: 'KYD' },
  { name: 'KZT' },
  { name: 'LAK' },
  { name: 'LBP' },
  { name: 'LKR' },
  { name: 'LRD' },
  { name: 'LSL' },
  { name: 'LTL' },
  { name: 'LVL' },
  { name: 'LYD' },
  { name: 'MAD' },
  { name: 'MDL' },
  { name: 'MGA' },
  { name: 'MKD' },
  { name: 'MMK' },
  { name: 'MNT' },
  { name: 'MOP' },
  { name: 'MRO' },
  { name: 'MUR' },
  { name: 'MVR' },
  { name: 'MWK' },
  { name: 'MXN' },
  { name: 'MYR' },
  { name: 'MZN' },
  { name: 'NAD' },
  { name: 'NGN' },
  { name: 'NIO' },
  { name: 'NOK' },
  { name: 'NPR' },
  { name: 'NZD' },
  { name: 'OMR' },
  { name: 'PAB' },
  { name: 'PEN' },
  { name: 'PGK' },
  { name: 'PHP' },
  { name: 'PKR' },
  { name: 'PLN' },
  { name: 'PYG' },
  { name: 'QAR' },
  { name: 'RON' },
  { name: 'RSD' },
  { name: 'RUB' },
  { name: 'RWF' },
  { name: 'SAR' },
  { name: 'SBD' },
  { name: 'SCR' },
  { name: 'SDG' },
  { name: 'SEK' },
  { name: 'SGD' },
  { name: 'SHP' },
  { name: 'SKK' },
  { name: 'SLL' },
  { name: 'SOS' },
  { name: 'SRD' },
  { name: 'SSP' },
  { name: 'STD' },
  { name: 'SVC' },
  { name: 'SYP' },
  { name: 'SZL' },
  { name: 'THB' },
  { name: 'TJS' },
  { name: 'TMT' },
  { name: 'TND' },
  { name: 'TOP' },
  { name: 'TRY' },
  { name: 'TTD' },
  { name: 'TWD' },
  { name: 'TZS' },
  { name: 'UAH' },
  { name: 'UGX' },
  { name: 'UYU' },
  { name: 'UZS' },
  { name: 'VEF' },
  { name: 'VND' },
  { name: 'VUV' },
  { name: 'WST' },
  { name: 'XAF' },
  { name: 'XAG' },
  { name: 'XAU' },
  { name: 'XCD' },
  { name: 'XDR' },
  { name: 'XOF' },
  { name: 'XPF' },
  { name: 'YER' },
  { name: 'ZAR' },
  { name: 'ZMK' },
  { name: 'ZMW' },
  { name: 'BTC' },
  { name: 'JEP' },
  { name: 'GGP' },
  { name: 'IMP' },
  { name: 'EEK' },
  { name: 'GHC' },
  { name: 'MTL' },
  { name: 'TMM' },
  { name: 'YEN' },
  { name: 'ZWD' },
  { name: 'ZWL' },
  { name: 'ZWN' },
  { name: 'ZWR' },
]

const ISSHARED = false
const ISAPPOPEN = false

export default {
  startSingleScreenApp,
  startTabBasedApp,
  openAddModal,
  openLoginModalIn,
  openSearchModal,
  openSaveModal,
  openMultiSaveModal,
  openImageModal,
  state,
  itemType,
  removeDuplicates,
  CurrencyList,
  ISSHARED,
  ISAPPOPEN
}
