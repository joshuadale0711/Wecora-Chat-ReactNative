
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

import url from 'url'

import Masonry from 'react-native-masonry-layout'
import FastImage from 'react-native-fast-image'

import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';

import Constants from '../../global/Constants';
const Icon = Constants.Images.Icon
const itemType = Constants.Global.itemType

import ElevatedView from 'react-native-elevated-view'

const stateObs = Constants.Global.state
import cio from 'cheerio-without-node-native';

@inject('SaveItem') @observer
export default class ParserScreen extends Component {
    static navigatorButtons = NavButtons.Login;
    static navigatorStyle = NavBar.Default;

    constructor(props) {
        super(props);

        this.state = {
            parsedItems: [],
            parsedStatus: stateObs.START,
            host: ''
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = (event: { id: string }) => {
        const { SaveItem, navigator } = this.props;

        switch (event.id) {
            case 'cancel':
                SaveItem.clearSelected()
                navigator.resetTo({
                    ...Constants.Screens.PUSHED_SCREEN,
                    title: 'Projects'
                })
                break;
            case 'backPress':
                SaveItem.clearSelected()
                navigator.resetTo({
                    ...Constants.Screens.PUSHED_SCREEN,
                    title: 'Projects'
                })
                break;
            default:
        }
    }

    componentDidMount = () => {
        this.parseWeb()
    }
    parseWeb = () => {
        try {
            const { SaveItem } = this.props
            const urlToParse = JSON.parse(SaveItem.parseURL)
            if (urlToParse) {
                this.setState({ parsedStatus: stateObs.LOADING })
                let host = url.parse(urlToParse.currentUrl)
                if (host.href) {
                    if (host.href.includes('#X3Rp-ddo-8Pk6iAT'))
                        host.href = host.href.replace('#X3Rp-ddo-8Pk6iAT', '')
                    else if (host.href.includes('%23X3Rp-ddo-8Pk6iAT'))
                        host.href = host.href.replace('%23X3Rp-ddo-8Pk6iAT', '')
                }
                const parser = cio.load(urlToParse.html)
                let items = []
                parser('img').map((i, e) => {
                    let img = parser(e).attr('src')
                    if (!img.host) {
                        img = url.resolve(host, img)
                    } else {
                        img = url.format(img)
                    }
                    const name = parser(e).attr('alt')
                    items.push({
                        url: img,
                        name,
                        source: host.href,
                        key: i + ""
                    })

                })
                items = items.filter((item, index, self) =>
                    index === self.findIndex((t) => (
                        t.url === item.url
                    ))
                )

                if (items.length == 0) {
                    this.setState({ parsedStatus: stateObs.ERROR, parsedItems: [] })
                } else {

                    this.refs.masonry.clear()
                    setTimeout(() => {
                        this.setState({ parsedStatus: stateObs.DONE, parsedItems: [...items] })
                        this.refs.masonry.addItems([...items])
                    }, 900)
                    //console.log(items)
                }

            } else {
                this.setState({ parsedStatus: stateObs.ERROR, parsedItems: [] })
            }

        } catch (e) {
            this.setState({ parsedStatus: stateObs.ERROR, parsedItems: [] })
        }
    }


    renderWecoraTop = () => {
        const { Items, navigator } = this.props
        const { searchMode } = this.state
        let icon = ''
        let text = ''
        let action = undefined
        let showAction = undefined
        if (this.state.parsedStatus == stateObs.LOADING) {
            icon = 'spin6'
            text = 'Loading Items'
        } else {

            if (this.state.parsedItems.length == 0) {
                icon = 'wecora_info'
                text = 'No images found on this link'
            }
        }

        return (
            <View style={styles.icon_container}>
                <WecoraTop icon={icon} text={text} />
            </View>
        )
    }

    _keyExtractor = (item, index) => item.id + "";
    _renderItem = (item) => (

        < View style={styles.itemContainer} >
            <WecoraItem
                onPress={() => {
                    this.props.SaveItem.setSelected(item.url, true, item.name, item.source)
                    this.props.navigator.resetTo({
                        ...Constants.Screens.PUSHED_SCREEN
                    })
                }}
                image={item.url}
                text={item.name}
                style={styles.item} />
        </View >
    );
    render() {
        const { SaveItem, navigator } = this.props;
        const showMasonary = (this.state.parsedItems.length > 0
            && this.state.parsedStatus == stateObs.DONE || this.state.parsedStatus == stateObs.START)
        return (
            <View style={styles.container}>
                <View style={{ margin: 10 }}>
                    <WecoraButton
                        style={{ flex: 1 }}
                        text={`RELOAD`}
                        iconName={'spin6'}
                        isLarge
                        dark
                        onPress={this.parseWeb} />
                </View>
                {showMasonary && <Masonry
                    ref="masonry"
                    style={styles.list}
                    renderItem={this._renderItem}
                />}
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
    itemsContainer: {
        margin: 8
    },
    itemContainer: {
        flex: 1,
        margin: 4
    },
    item: {
        flex: 1,
        backgroundColor: 'lightblue',
    },
    list: {
        marginHorizontal: 12,
        flex: 1,
    }
})


