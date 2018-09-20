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
import WecoraButton from '../components/WecoraButton';
import WecoraList from '../components/WecoraList';
import WecoraItem from '../components/WecoraItem';
import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';

import Constants from '../../global/Constants';
const stateObs = Constants.Global.state

import FastImage from 'react-native-fast-image'
import ElevatedView from 'react-native-elevated-view'
import Boards from '../../stores/Boards';

const modalProps = {
    title: 'Create New Board',
    icon: 'wecora_project',
    inputLabel: 'Board name',
    buttonText: 'Create New Board',
    buttonIcon: 'plus',
    storeToObserve: 'Boards',
    startMessage: undefined,
    loadMessage: 'Creating Board',
    errorMessage: 'Something Went Wrong',
    successMessage: 'Board Created Sucessfully',
    actionSuccess: { text: undefined },
    actionFailed: { text: 'Try Again' }
}

const topParams = {
    icon: 'wecora_board',
    text: 'It looks like there aren\'t any boards in this project.',
    textDes: undefined,
    action: 'CREATE NEW BOARD',
}

@inject('SaveItem') @observer
export default class SaveItems extends Component {
    static navigatorButtons = NavButtons.Login;
    static navigatorStyle = NavBar.Default;

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
    componentDidMount() {
        this.handleVisibilityOfNavButtons();
    }

    handleVisibilityOfNavButtons = () => {
        const { navigator, withCancelButton, withAccountsButton } = this.props;

        if (!withCancelButton) {
            navigator.setButtons({ leftButtons: [] })
        }
    }

    onNavigatorEvent = (event: { id: string }) => {
        const { withCancelButton, storeToObserve } = this.props;

        switch (event.id) {
            case 'cancel':
                this.dismiss();
                break;
            case 'backPress':
                if (withCancelButton) this.dismiss();
                break;
            default:
        }
    }

    dismiss = () => {
        const { navigator, SaveItem } = this.props;
        SaveItem.reset()
        navigator.dismissModal();
    }

    componentWillUpdate = (nextProps) => {

        if (nextProps.SaveItem.createState == stateObs.DONE) {
            setTimeout(() => {
                nextProps.SaveItem.reset()
                nextProps.navigator.dismissModal()
            }, 1200);

            // if (Platform.OS == 'ios' && this.state.source) {
            //     setTimeout(() => {
            //         let urla = this.state.source
            //         urla = urla + '#X3Rp-ddo-8Pk6iAT'
            //         Linking.openURL(urla)
            //     }, 2000)
            // }
        }
    }


    getState = () => {

        switch (this.props.SaveItem.createState) {
            case stateObs.START:
                return {
                    icon: undefined,
                    text: '',
                    action: undefined
                }
            case stateObs.LOADING:
                return {
                    icon: 'spin6',
                    text: 'Saving...',
                    action: undefined
                }
            case stateObs.DONE:
                return {
                    icon: 'wecora_good',
                    text: 'Saved',
                    action: undefined
                }
            case stateObs.ERROR:
                return {
                    icon: 'wecora_error',
                    text: 'Something Went Wrong',
                    action: {
                        text: 'Try Again',
                        onPress: () => this.props.SaveItem.reset()
                    }
                }
            default:
                return {
                    icon: '',
                    text: '',
                    action: ''
                }

        }

    }

    renderItem = ({ item }) => {
        return (
            <ElevatedView elevation={2} style={styles.imgContainer}>
                <FastImage
                    style={styles.image}
                    source={{
                        uri: item
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </ElevatedView>
        )
    }

    render() {
        const { SaveItem, navigator } = this.props;
        const { listState, list, selectedItems } = SaveItem;
        const screenState = this.getState()
        const progress = screenState.icon
        return (
            <View style={styles.container}>
                {
                    progress ?
                        <View style={styles.icon_container}>
                            <WecoraTop icon={screenState.icon} text={screenState.text} action={screenState.action} />
                        </View> :
                        <View style={styles.list}>
                            <FlatList
                                data={selectedItems}
                                renderItem={this.renderItem}
                                keyExtractor={(item) => item}
                            />
                        </View>
                }

                {
                    !progress &&
                    <View style={styles.button}>
                        <WecoraButton
                            text={'SAVE IMAGES TO BOARD'}
                            iconName={'wecora_save'}
                            dark
                            isLarge
                            onPress={() => this.props.SaveItem.createMultiple()}
                        />
                    </View>
                }


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    top: {
        flex: 2
    },
    list: {
        flex: 1,
        width: '100%',
        marginVertical: 10
    },
    fab: {
        alignSelf: 'flex-end',
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
    imgContainer: {
        height: 160,
        width: '95%',
        margin: 10,

    },
    image: {
        height: 160,
    },
    button: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    }
});
