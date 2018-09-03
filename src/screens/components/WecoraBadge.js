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
const Icon = Constants.Images.Icon

export default class WecoraBadge extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        const { icon, badge } = this.props

        return (


            <View style={styles.iconContainer}>
            
                <Icon style={[styles.text,styles.icon,
                {
                    opacity: badge > 0 ? Constants.Colors.textOpacity : 0.3
                }]}
                    name={icon} />
                
                <View style={[styles.circle, {opacity: badge > 0 ? 1:0} ]}>
                    <Text style={styles.badgeText}>{badge}</Text>
                </View>
            
            </View>

        );
    }


}

const styles = StyleSheet.create({

    iconContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        top: -5
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 24 / 2,
        backgroundColor: '#E55A50',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        marginTop: 10,
        marginRight: -15,
        fontSize: 22,
    },
    text: {
        color: Constants.Colors.textBlack,
        opacity: Constants.Colors.textOpacity,
        fontSize: 20
    },
    badgeText: {
        color: Constants.Colors.textLight,
        fontSize: 14
    }
});
