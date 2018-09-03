// @flow

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button, 
    ActivityIndicator, 
    Platform
} from 'react-native';

import Constants from '../../global/Constants';
import WecoraButton from './WecoraButton'
const Icon = Constants.Images.Icon

export default class WecoraTop extends Component {



    render() {
        const { icon, text, textDes, action, showAction } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <View style={styles.circle} >
                    {icon != 'spin6' && <Icon name={icon} style={styles.icon} />}
                    {icon == 'spin6' && 
                    <ActivityIndicator   style={Platform.OS == "ios" ? styles.indicator: undefined} 
                    size={Platform.OS=='ios'? 1: 80} color={Constants.Colors.loginBackgroundColor} />}
                    </View>
                </View>
                {text && <Text style={styles.text}>{text}</Text>}
                {textDes && <Text style={styles.text}>{textDes}</Text>}
                {action && showAction && <WecoraButton text={action.text} onPress={action.onPress} transparent dark style={styles.actionButton}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow : 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginHorizontal: 40,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        margin: 20
    },
    circle: {
        width: 152,
        height: 152,
        borderRadius: 152 / 2,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 60,
        color: Constants.Colors.loginBackgroundColor
    },
    text: {
        fontSize: 18,
        color: Constants.Colors.textBlack,
        opacity: Constants.Colors.textOpacity,
        paddingBottom: 10,
        textAlign: 'center'
    },
    actionButton: {
       
    },
    indicator: {
         transform: [
            { scale: 3 }
        ]
    }
});
