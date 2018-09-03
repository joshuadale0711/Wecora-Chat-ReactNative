// @flow

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert, Keyboard, Platform,
    TouchableWithoutFeedback
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';
import Constants from '../../global/Constants';
const Icon = Constants.Images.Icon
import WecoraInput from '../components/WecoraInput';
import WecoraButton from '../components/WecoraButton';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const stateObs = Constants.Global.state

type State = {
    username: string,
    password: string,
}

const modalProps = {
    icon: 'wecora_message',
    inputLabel: 'Email Address',
    buttonText: 'SEND RESET LINK',
    buttonIcon: 'wecora_send',
    storeToObserve: 'Account',
    title: 'Forgot Password',
    startMessage: 'We will send a reset link',
    loadMessage: 'Sending password reset link...',
    errorMessage: 'Something Went Wrong',
    successMessage: 'Resent link has been sent successfully to',
    actionSuccess: { text: undefined },
    actionFailed: { text: 'Try Again' },
    email: true
}



@inject('App', 'Account', 'Chats') @observer
export default class SignInScreen extends Component {
    //static navigatorButtons = NavButtons.WithSideMenu;
    static navigatorStyle = NavBar.Hidden;

    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            // username: 'joshuadale0711+pro1@gmail.com',
            // password: 'wecora2018',
            // username: 'jlippiner@wecora.com',
            // password: 'testtest',
            // username: 'saas.exp8@gmail.com',
            // password: 'wecora2018',
            username: '',
            password: ''
        }

    }

    

    getForm = () => {
        const { Account, navigator } = this.props;
        const { username, password } = this.state;
        return (
            <View style={styles.form}>

                <WecoraInput label="Email" hidden={false}
                    defaultColor='#FFFFFF32'
                    pressedColor='#FFFFFF64'
                    labelColor='#FFFFFF'
                    inputColor='#FFFFFF'
                    returnKeyType='next'
                    keyboardType={'email-address'}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    onChangeText={(username) => this.setState({ username })}
                    value={this.state.username} />


                <WecoraInput label="Password" hidden={true}
                    defaultColor='#FFFFFF32'
                    pressedColor='#FFFFFF64'
                    labelColor='#FFFFFF'
                    inputColor='#FFFFFF'
                    returnKeyType='done'
                    onSubmitEditing={async () => {
                        try {
                            var b = await Account.login(username, password)
                            this.props.navigator.resetTo({ ...Constants.Screens.PUSHED_SCREEN })
                        } catch (err) {
                            this.showAlert(err)
                        }
                
                    }}
                    ref={(input) => this.passwordInput = input}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password} />


                <WecoraButton
                    text={`LOGIN`}
                    iconName={'key'}
                    isLarge
                    onPress={async () => {
                        try {
                            const {Chats, navigator} = this.props
                            var b = await Account.login(username, password)
                            Chats.subscribeChat()
                            navigator.resetTo({ ...Constants.Screens.PUSHED_SCREEN })
                        } catch (err) {
                            this.showAlert(err)
                        }
                
                    }}
                />
                <View style={{ paddingTop: 28 }}>
                    <WecoraButton
                        text={`I FORGOT MY PASSWORD`}
                        transparent
                        onPress={() =>
                            Constants.Global.openAddModal(this.props.navigator, true, modalProps.title, modalProps)}
                    />
                </View>

            </View>
        )
    }

    showAlert = (error) => {
        Alert.alert(
            'Login Error',
            'Email or password was incorrect',
            [
                { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false }
        )
    }

    render() {
        const { Account, navigator } = this.props;

        return (
            <TouchableWithoutFeedback style={styles.container} onPress={() => {
              
                Keyboard.dismiss()}}>
            <View style={styles.container} >
                <View style={styles.icon_container}>

                    <Image style={styles.icon}
                        source={require('../../../resources/images/wecora_icon_trans.png')} />
                    <Text style={styles.icon_text}>Wecora Chat</Text>
                </View>

                {Account.state == stateObs.LOADING &&
                    <View style={styles.loading}>
                        <ActivityIndicator size={'large'} color={'#fff'} />
                    </View>}
                {Account.state != stateObs.LOADING && this.getForm()}

            {Platform.OS == 'ios' && <KeyboardSpacer />}
            </View>
            </TouchableWithoutFeedback>
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
        paddingBottom: 20
    },
    icon: {
        height: 120,
        width: 120,
    },
    icon_text: {
        fontSize: 16,
        marginTop: 12,
        fontWeight: 'bold',
        color: Constants.Colors.textLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 16,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

