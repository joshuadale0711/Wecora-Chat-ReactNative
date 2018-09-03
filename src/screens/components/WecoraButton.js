import React, { Component } from 'react';

import {Text, View,
    StyleSheet, TouchableHighlight
} from "react-native";

import Constants from '../../global/Constants';
const Icon = Constants.Images.Icon

import ElevatedView from 'react-native-elevated-view'


const textColor = Constants.Colors.inputDefaultColor
const pressedColor = Constants.Colors.inputPressedColor
const labelColor = Constants.Colors.inputlabelColor
const inputColor = Constants.Colors.inputTextColor

const transparentLight = {
    textColor: '#fff', preesedTextColor: '#fff',
    bgColor: 'transparent', pressedBgColor: 'transparent'
}


const transparentDark = {
    textColor: '#E55A4F', preesedTextColor: '#fff',
    bgColor: 'transparent', pressedBgColor: '#CC4A41'
}



const nontransparentLight = {
    textColor: '#000', preesedTextColor: '#000',
    bgColor: '#fff', pressedBgColor: '#ebebeb'
}


const nontransparentDark = {
    textColor: '#fff', preesedTextColor: '#fff',
    bgColor: '#E55A50', pressedBgColor: '#CC4A41'
}


export default class WecoraButton extends Component {
    constructor(props) {
        super(props)
        var btn = {}
        if (this.props.transparent) {
            if (this.props.dark)
                btn = { ...transparentDark }
            else
                btn = { ...transparentLight }
        } else {
            if (this.props.dark)
                btn = { ...nontransparentDark }
            else
                btn = { ...nontransparentLight }
        }

        this.state = {
            textColor: btn.textColor,
            bgColor: btn.bgColor,
            btn: btn
        }

    }


    onShowUnderlay = () => {

        this.setState({
            ...this.state,
            textColor: this.state.btn.preesedTextColor,
            bgColor: this.state.btn.pressedBgColor
        })
    }
    onHideUnderlay = () => {

        this.setState({
            ...this.state,
            textColor: this.state.btn.textColor,
            bgColor: this.state.btn.bgColor
        })
    }

    button = () => {
        const {fab, isLarge, disable, iconName, dark } = this.props
        return (
            <TouchableHighlight
                style={fab ?
                    [isLarge ? styles.fab : styles.fabSmall, 
                        disable ? 
                        {backgroundColor: '#000', opacity: 0.24 }
                        :{backgroundColor: this.state.bgColor }
                    ]
                     : { backgroundColor: this.state.bgColor }}
                onPress={disable ? undefined : this.props.onPress}
                underlayColor={this.state.bgColor}
                onShowUnderlay={this.onShowUnderlay}
                onHideUnderlay={this.onHideUnderlay}>
                <View style={styles.buttonView}>
                    {this.props.iconName && <Icon name={iconName}
                        style={[styles.iconText, { fontSize: isLarge ? 18:16 ,color: dark ? '#fff' : '#000' }]} />}
                    {this.props.text && <Text style={[styles.buttonText, { color: this.state.textColor, fontSize: this.props.isLarge ? 16 : 14 }]}>
                        {this.props.text} </Text>}
                </View>
            </TouchableHighlight>
        )
    }


    render() {

        return (
            <View>
                {this.props.transparent && this.button()}
                {
                    !this.props.transparent &&
                    <ElevatedView elevation={2} style={
                        this.props.fab ? 
                        this.props.isLarge ? styles.fab: styles.fabSmall:
                        undefined}>
                        {this.button()}
                    </ElevatedView>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({

    fab: {
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fabSmall: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: '#00000064',
        fontSize: 14,
        marginHorizontal: 5,
    },
    iconText: {
        textAlign: 'center',
        color: '#000000',
        fontSize: 16,
        marginHorizontal: 5
    },
    buttonView: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
