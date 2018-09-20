// @flow

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import Constants from '../../global/Constants';
import WecoraButton from './WecoraButton'
import WecoraBadge from './WecoraBadge'
import FastImage from 'react-native-fast-image'
import WecoraInitials from './WecoraInitials'
const Icon = Constants.Images.Icon
import ElevatedView from 'react-native-elevated-view'

export default class WecoraListHeader extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
        }
    }

    render() {
        const { title, subTitle, image} = this.props
        return (
            <View style={styles.card}>
            <WecoraInitials
                initials={title ? title.charAt(0) : 'A'}
                avatar={image ? image : undefined} />

                <View style={[styles.infoContainer]}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subTitle}>{subTitle}</Text>
                </View>
            

            </View>
        );
    }


}

const styles = StyleSheet.create({
    card: {
        paddingTop : 10,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        backgroundColor: Constants.Colors.backgroundColor,
    },
    infoContainer:{
        marginLeft : 10,
        flexDirection: 'column', 
        justifyContent: 'flex-start'
    },
    title: {
        marginBottom : 5,
        color: Constants.Colors.textBlack,
        fontSize: 14
    },
    subTitle: {
        color: Constants.Colors.textBlack,
        opacity: Constants.Colors.textOpacity,
        fontSize: 12
    }
});
