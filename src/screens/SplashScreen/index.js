// @flow

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Image, ImageEditor, ImageStore,
    Linking, AppState
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import firebase from 'react-native-firebase';
import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';
import Constants from '../../global/Constants';
import CounterView from '../components/Counter';
import resolveAssetSource from 'resolveAssetSource';
import SaveItem from '../SaveItem';
import App from '../../stores/App';

import { Notification, NotificationOpen } from 'react-native-firebase';
import Projects from '../../stores/Projects';
import Boards from '../../stores/Boards';
import Chats from '../../stores/Chats';
const stateObs = Constants.Global.state

@inject('App', 'Account', 'Counter', 'SaveItem', 'Projects', 'Boards', 'Chats') @observer
export default class SplashScreen extends Component {
    //static navigatorButtons = NavButtons.WithSideMenu;
    static navigatorStyle = NavBar.Hidden;

    constructor(props: {}) {
        super(props);
        this.state = {
            uri: ''
        }
        const { App, navigator } = this.props;
        App.rootNavigator = navigator;
    }

    componentWillMount = () => {
        // const { App, SaveItem } = this.props;


        // setTimeout(() => {
        //     if (SaveItem.shared == undefined)
        //         App.navigate()
        // }, 1000);

        // const enabled = await firebase.messaging().hasPermission();
        // if (enabled) {
        //     // user has permissions
        // } else {
        //     try {
        //         await firebase.messaging().requestPermission();
        //         // User has authorised
        //     } catch (error) {
        //         // User has rejected permissions
        //     }
        // }
    }


    componentDidMount = async () => {
        const { App, SaveItem, Projects, Boards, Chats } = this.props;
        Chats.subscribeChat()
        try {
            const enabled = await firebase.messaging().hasPermission();
            if (!enabled)
                await firebase.messaging().requestPermission();
            const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
            if (notificationOpen) {
                const action = notificationOpen.action;
                const notification: Notification = notificationOpen.notification;
                const { project_id, board_id } = notification.data
                await App.navigateNotification(project_id, board_id)
            } else {
                setTimeout(() => {
                    if (SaveItem.shared == undefined)
                        App.navigate()
                }, 1000);
            }
        } catch (error) {
            console.log(error)
        }

    }

    render() {
        const { Account, Counter } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.icon_container}>
                    <Image style={styles.icon}
                        source={Constants.Images.Wecora} />
                </View>
                <Text style={styles.icon_text}>Wecora v2.9</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.loginBackgroundColor,
    },
    icon_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: 120,
        width: 120,
    },
    icon_text: {
        alignSelf: 'center',
        color: Constants.Colors.textLight,
        opacity: Constants.Colors.textOpacity,
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 30
    },
});
