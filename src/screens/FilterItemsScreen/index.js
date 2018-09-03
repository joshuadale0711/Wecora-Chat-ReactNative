// // @flow

// import React, { Component } from 'react';
// import {
//     AppRegistry,
//     StyleSheet,
//     Text,
//     View,
//     Button,
//     FlatList,
//     ActivityIndicator
// } from 'react-native';
// import { inject, observer, } from 'mobx-react/native';
// import CounterView from '../components/Counter';
// import WecoraTop from '../components/WecoraTop';
// import WecoraChat from '../components/WecoraChat';
// import WecoraButton from '../components/WecoraButton';
// import WecoraList from '../components/WecoraList';
// import WecoraItem from '../components/WecoraItem';
// import WecoraMasonary from '../components/WecoraMasonary';
// import NavButtons from '../../global/NavButtons';
// import NavBar from '../../global/NavBar';

// import Constants from '../../global/Constants';
// const stateObs = Constants.Global.state
// const itemType = Constants.Global.itemType


// import ElevatedView from 'react-native-elevated-view'
// import Boards from '../../stores/Boards';



// @inject('Items') @observer
// export default class FilterItemsScreen extends Component {
//     static navigatorStyle = NavBar.Default;

   

//     componentWillMount = () => {
//         const { Items, item, itemType } = this.props
//         Items.fetchList(item, itemType)
        
//     }

//     render() {
//         const { Items, navigator, select } = this.props;
        
//         return (
//             <View style={styles.container}>

//                 <WecoraMasonary onItemPress={(item) => {
//                     if(select)
//                         navigator.dismissModal();
//                     else {
//                         navigator.push({
//                             ...Constants.Screens.ITEM_DETAIL,
//                             title: item.name
//                         });
//                     }
//                 }} />

//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Constants.Colors.backgroundColor,
//     },
//     top: {
//         flex: 2
//     }
// });



// @flow

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { inject, observer, } from 'mobx-react/native';
import CounterView from '../components/Counter';
import WecoraTop from '../components/WecoraTop';
import WecoraChat from '../components/WecoraChat';
import WecoraItem from '../components/WecoraItem';
import WecoraButton from '../components/WecoraButton';
import WecoraMasonary from '../components/WecoraMasonary';
import ActionSheet from '../components/ActionSheet';

import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';

import Constants from '../../global/Constants';
const Icon = Constants.Images.Icon
const stateObs = Constants.Global.state
const itemType = Constants.Global.itemType

import ElevatedView from 'react-native-elevated-view'
import FastImage from 'react-native-fast-image';



@inject('Boards', 'Chats', 'Items') @observer
export default class FilterItemsScreen extends Component {
    static navigatorStyle = NavBar.Default;



    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        }
    }

       componentWillMount = () => {
        const { Items, item, itemType } = this.props
        Items.fetchList(item, itemType)
        
    }
    renderWecoraTop = () => {
        const { Items } = this.props
        const { searchMode } = this.state
        let icon = ''
        let text = ''
        if (Items.listState == stateObs.LOADING) {
            icon = 'spin6'
            text = 'Loading Items'
        } else {

            if (Items.list.length == 0) {
                icon = 'wecora_info'
                text = 'There are no items in this library'
            }
        }

        return (
            <View style={styles.icon_container}>
                <WecoraTop icon={icon} text={text} />
            </View>
        )
    }

    renderItems = () => {
        return (
            <View style={styles.itemsContainer}>

                <WecoraItem
                    icon={'right-open'}
                    badge={0}
                    onPress={() => {
                        this.props.navigator.push({
                            ...Constants.Screens.FILTER_SCREEN,
                            title: 'Filter by Label',
                            passProps: { selectedItemType :itemType.LABEL, select: false}
                        });
                    }}
                    text={'Filter by Label'}
                    style={styles.item} />
            </View>
        )
    }




    render() {
        const { Items, navigator, select } = this.props;
        const showMasonary = Items.list.length > 0
            && Items.listState == stateObs.DONE
        return (
            <View style={styles.container}>
                {//this.renderItems()
                }
                {showMasonary && <WecoraMasonary onItemPress={(item) => {
                    if(select)
                        navigator.dismissModal();
                    else {
                        navigator.push({
                            ...Constants.Screens.ITEM_DETAIL,
                            title: item.name
                        });
                    }
                }} />}
                {!showMasonary && this.renderWecoraTop()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,
    },
    searchContainer: {
        height: 56,
        backgroundColor: Constants.Colors.statusBarColor,
        marginBottom: 8,
    },

    icon_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inputContainer: {
        marginHorizontal: 16,
        marginVertical: 5,
        paddingHorizontal: 14,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    input: {
        flex: 8
    },

    inputIcon: {
        flex: 1,
        fontSize: 16,
        opacity: Constants.Colors.textOpacity
    },
    button: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    item: {
        marginTop: 0
    },
    itemsContainer: {
        margin: 8
    }
})


