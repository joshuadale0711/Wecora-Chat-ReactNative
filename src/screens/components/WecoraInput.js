import React, { Component } from 'react';

import {
    TextInput, Text, View,
    StyleSheet, Platform
} from "react-native";

import Constants from '../../global/Constants';


const defaultColor = Constants.Colors.inputDefaultColor
const pressedColor = Constants.Colors.inputPressedColor
const labelColor = Constants.Colors.inputlabelColor
const inputColor = Constants.Colors.inputTextColor

export default class WecoraInput extends Component {


    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: props.defaultColor ? props.defaultColor : defaultColor,
            labelColor: props.labelColor ? props.labelColor : labelColor,
            inputColor: props.inputColor ? props.inputColor : inputColor
        };
    }

    focus() {
        this.textInput.focus();
    }

    onFocus = () => {
        this.setState({
            backgroundColor: this.props.pressedColor ? this.props.pressedColor : pressedColor
        })
    }

    onBlur = () => {
        this.setState({
            backgroundColor: this.props.defaultColor ? this.props.defaultColor : defaultColor
        })
    }

    render() {
        const { hidden, label, onChangeText, keyboardType,
            value, returnKeyType, onSubmitEditing } = this.props;
        let labelStyle = styles.inputLabelText
        let inputStyle = styles.inputStyle
        let formItemStyle = styles.formInputItem
        if (Platform.OS == 'ios') {
            labelStyle = styles.iosinputLabelText
            inputStyle = styles.iosinputStyle
            formItemStyle = styles.iosformInputItem
        }
        return (
            <View style={[formItemStyle, { backgroundColor: this.state.backgroundColor }]}>
                <Text style={[labelStyle, { color: this.state.labelColor }]}>{label} </Text>
                <TextInput secureTextEntry={hidden}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    underlineColorAndroid='transparent'
                    onChangeText={onChangeText}
                    value={value}
                    blurOnSubmit={false}
                    onBlur={this.onBlur} onFocus={this.onFocus}
                    ref={(input) => this.textInput = input}
                    style={[inputStyle, { color: this.state.inputColor }]} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    inputLabelText: {
        alignSelf: 'flex-start',
        fontSize: 11,
        opacity: Constants.Colors.textOpacity
    },
    formInputItem: {
        flexDirection: 'column',
        height: 50,
        justifyContent: 'center',
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 2,
    },
    inputStyle: {
        fontSize: 13,
        height: 45,
        flex: 1,
        paddingBottom: 0
    },
    iosinputLabelText: {
        alignSelf: 'flex-start',
        fontSize: 14,
        opacity: Constants.Colors.textOpacity
    },
    iosformInputItem: {
        flexDirection: 'column',
        height: 60,
        justifyContent: 'center',
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 2,
    },
    iosinputStyle: {
        fontSize: 16,
        height: 50,
        flex: 1,
        paddingBottom: 0
    }
});
