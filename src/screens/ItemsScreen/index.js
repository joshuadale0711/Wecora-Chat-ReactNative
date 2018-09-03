// @flow

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    SectionList, Linking,
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
export default class ItemsScreen extends Component {
    static navigatorStyle = NavBar.Default;



    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = (event: { id: string }) => {
        if (event.id == 'willAppear') {
            const { Items, Chats } = this.props
            Items.fetchList(Chats.parent, itemType.BOARD)
        }
    }
    componentWillMount = () => {
       
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
                text = 'There are no items on this board'
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
                            passProps: { selectedItemType: itemType.LABEL, select: false }
                        });
                    }}
                    text={'Filter by Label'}
                    style={styles.item} />
            </View>
        )
    }


    sectionList = () => {
        const { Items, navigator } = this.props
        renderItem = ({ item, index, section }) => {
            return (<WecoraItem
                onPress={() => {
                    Items.setSelected(item)
                    navigator.push({
                        ...Constants.Screens.ITEM_DETAIL,
                        title: item.name
                    });
                }}
                leftImage={item.media.large}
                text={item.name}
                style={styles.item} />)
        }
        return (
            <SectionList
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
                sections={Items.itemList}
                keyExtractor={(item, index) => item + index}
            />)
    }


    render() {
        const { Items, navigator, Chats } = this.props;
        const showMasonary = Items.list.length > 0
            && Items.listState == stateObs.DONE
        return (
            <View style={styles.container}>
                {showMasonary && this.sectionList()}
                {!showMasonary && this.renderWecoraTop()}
                <View style={styles.button}>
                        <WecoraButton
                            text={'VIEW BOARD ON THE WEB'}
                            dark
                            isLarge
                            onPress={() => Linking.openURL(Chats.parent.url)}
                        />
                    </View>
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
        width: '100%',
        bottom: 0,
        left: 0,
    },
    item: {
        marginTop: 0
    },
    itemsContainer: {
        margin: 8
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        opacity: Constants.Colors.textOpacity,
        padding: 10
    },
    section: {
        backgroundColor: "#ebebeb"
    }
})


