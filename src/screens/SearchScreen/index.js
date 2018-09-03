// @flow

import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    KeyboardAvoidingView,
    Platform, TextInput, Keyboard
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';
import Constants from '../../global/Constants';
const stateObs = Constants.Global.state

import WecoraInput from '../components/WecoraInput';
import WecoraButton from '../components/WecoraButton';
import WecoraTop from '../components/WecoraTop';
import WecoraMasonary from '../components/WecoraMasonary';
import WecoraItem from '../components/WecoraItem';

import ElevatedView from 'react-native-elevated-view'
import { keys } from 'mobx';

//import Icon from 'react-native-vector-icons/FontAwesome';
const Icon = Constants.Images.Icon
const itemType = Constants.Global.itemType


type Props = {
    withCancelButton: boolean,
}

type State = {
    username: string,
    password: string,
}

@inject('App', 'Account', 'Projects', 'Boards', 'Chats', 'Items') @observer
export default class SearchScreen extends Component {
    static navigatorButtons = NavButtons.Login;
    static navigatorStyle = { ...NavBar.Default, topBarElevationShadowEnabled: false };

    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            text: '',
            searchMode: false,
            kb: false
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    componentDidMount() {
        this.handleVisibilityOfNavButtons();
        this.props.Items.fetchList(itemType.USER, itemType.USER)
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    }



    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }



    _keyboardDidHide = () => {
            this.setState({
                ...this.state,
                kb : false
            })
         }
    _keyboardDidShow = () => {
        this.setState({
            ...this.state,
            kb : true
        })
    }
    
    componentWillUpdate = (nextProps) => {

        // if (nextProps[nextProps.storeToObserve].createState == stateObs.DONE
        //     && !nextProps.actionSuccess.text) {
        //     setTimeout(() => {
        //         nextProps[nextProps.storeToObserve].reset()
        //         this.dismiss()
        //     }, 2000);
        // }
    }

    onNavigatorEvent = (event: { id: string }) => {
        const { withCancelButton, storeToObserve } = this.props;

        switch (event.id) {
            case 'cancel':
                // this.props[storeToObserve].reset()
                this.dismiss();
                break;
            case 'backPress':
                // this.props[storeToObserve].reset(
                if (withCancelButton) this.dismiss();
                break;
            default:
        }
    }

    handleVisibilityOfNavButtons = () => {
        const { navigator, withCancelButton, withAccountsButton } = this.props;

        if (!withCancelButton) {
            navigator.setButtons({ leftButtons: [] })
        }
    }

    dismiss = () => {
        const { navigator } = this.props;

        navigator.dismissModal();
    }



    searchQuery = (text) => {
        this.props.Items.fetchList(text, itemType.QUERY)
    }

    onFocus = () => {
        this.setState({
            searchMode: true
        })
    }

    onChangeText = (text) => {
        this.setState({
            text,
            searchMode: true
        })
    }

    renderSearchInput = () => {
        return (
            <View style={styles.searchContainer}>
                <ElevatedView elevation={2} style={styles.inputContainer} >
                    <Icon name={'wecora_search'} style={styles.inputIcon} />
                    <TextInput placeholder="Search for Items"
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => this.onChangeText(text)}
                        value={this.state.text}
                        textAlign={'center'}
                        onFocus={this.onFocus} style={styles.input} />
                    {this.state.text.length > 0 &&
                        <WecoraButton
                            style={styles.inputIcon}
                            iconName={'wecora_clear'}
                            transparent
                            onPress={() => this.setState({
                                ...this.state,
                                text: ''
                            })}
                        />
                    }
                    {this.state.text.length == 0 &&
                        <View style={{ flex: 1 }} />
                    }
                </ElevatedView>
            </View>
        )
    }

    renderSearchView = () => {
        return (
            <WecoraButton
                style={styles.button}
                text={'SEARCH'}
                iconName={'wecora_search'}
                dark
                isLarge
                onPress={() => {
                    Keyboard.dismiss()
                    this.searchQuery(this.state.text)
                }}
            />
        )
    }

    renderWecoraTop = () => {
        const { Items } = this.props
        const { searchMode } = this.state
        let icon = ''
        let text = ''
        if (Items.listState == stateObs.LOADING) {
            icon = 'spin6'
            text = 'Loading Results'
        } else {
            if (Items.list.length == 0 && searchMode) {
                icon = 'wecora_search'
                text = 'No Results'
            }
            if (Items.list.length == 0 && !searchMode) {
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
                            title: 'Filter by Project',
                            passProps: { selectedItemType: itemType.PROJECT, select: true }
                        });
                    }}
                    text={'Filter by Project'}
                    style={styles.item} />

                <WecoraItem
                    icon={'right-open'}
                    badge={0}
                    onPress={() => {
                        this.props.navigator.push({
                            ...Constants.Screens.FILTER_SCREEN,
                            title: 'Filter by Label',
                            passProps: { selectedItemType: itemType.LABEL, select: true }
                        });
                    }}
                    text={'Filter by Label'}
                    style={styles.item} />

                <Text style={styles.item}> All Items </Text>
            </View>
        )
    }

    render() {
        const { Items, navigator } = this.props;
        const { searchMode, kb } = this.state
        const showMasonary = Items.list.length > 0
            && Items.listState == stateObs.DONE
        const wecTop = !showMasonary && !kb
        return (
            <View style={styles.container}>
                {this.renderSearchInput()}
                {!searchMode && this.renderItems()}
                {showMasonary && <WecoraMasonary onItemPress={(item) => this.dismiss()} />}
                {wecTop && this.renderWecoraTop()}
                {searchMode && this.renderSearchView()}
                {Platform.OS == 'ios' && <KeyboardSpacer />}
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
        marginHorizontal: 8,
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
        marginTop: 4
    },
    itemsContainer: {
        marginHorizontal: 8
    }
})

