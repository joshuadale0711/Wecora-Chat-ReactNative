import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ha
} from 'react-native';
import { ActionSheetCustom } from 'react-native-actionsheet'

const options = [
    'Cancel',
    'Apple',
    <Text style={{ color: 'yellow' }}>Banana</Text>,
    'Watermelon',
    <Text style={{ color: 'red' }}>Durian</Text>
]

export default class ActionSheet extends Component {
    showActionSheet = () => {
        this.ActionSheet.show()
    }

    render() {
        const { options, onPress } = this.props
        return (

            <ActionSheetCustom
                ref={o => this.ActionSheet = o}
                tintColor={"#E55A4F"}
                options={['CANCEL',...options]}
                styles={styles}
                cancelButtonIndex={0}
                onPress={onPress}
            />

        )
    }
}

const styles = {
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0.4,
        backgroundColor: '#000'
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    body: {
        flex: 1,
        alignSelf: 'flex-end',
        backgroundColor: 'transparent',
        marginBottom: 32
    },
    titleBox: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    titleText: {
        color: '#757575',
        fontSize: 14
    },
    messageBox: {
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    messageText: {
        color: '#9a9a9a',
        fontSize: 12
    },
    buttonBox: {
        height: 50,
        marginBottom: StyleSheet.hairlineWidth,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginRight: 16,
        marginLeft: 16
    },
    buttonText: {
        fontSize: 14, 
    },
    cancelButtonBox: {
        height: 56,
        marginTop: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginRight: 16,
        marginLeft: 16
    }
}