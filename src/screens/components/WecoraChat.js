// @flow

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    Platform, Image,
    TouchableHighlight, TouchableOpacity
} from 'react-native';

import FastImage from 'react-native-fast-image'

import Constants from '../../global/Constants';
import WecoraButton from './WecoraButton'
import WecoraInitials from './WecoraInitials'
const Icon = Constants.Images.Icon

import { inject, observer } from 'mobx-react/native';

import ElevatedView from 'react-native-elevated-view'

@inject('App', 'Account') @observer
export default class WecoraChat extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
        }
    }

    renderImageView = () => {
        const { comment, Account, onMenuPress, onImagePress } = this.props
        const isMine = Account.current.account_id == comment.commentor_account_id
        if (comment.attachments &&
            comment.attachments[0] &&
            comment.attachments[0].image &&
            comment.attachments[0].image.large) {
            return (
                <TouchableOpacity style={{ width: '100%' }}
                    onPress={() => onImagePress(comment.attachments[0].image.large)}>
                    <View style={styles.image}>
                    {
                        comment.loading ? <Image style={[styles.image, { alignSelf: 'center' }]}
                        resizeMode={'cover'}
                        source={{ uri: comment.attachments[0].image.large}} /> 
                        :  <FastImage
                        style={styles.image}
                        source={{
                            uri: comment.attachments[0].image.large,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    }
                        
                    </View>

                </TouchableOpacity >

            )
        }
        else return null
    }

    menuBtn = (co) => {
        const { comment, Account, onMenuPress } = this.props
        if (comment.attachments &&
            Account.current.account_id == comment.board.owner.account_id &&
            comment.attachments[0] &&
            comment.attachments[0].image &&
            comment.attachments[0].image.large) {
            return (

                <View style={{ padding: 8, flex: 1, }}>
                    <TouchableHighlight
                        style={styles.menuBtn}
                        underlayColor={'rgba(0,0,0,0.5)'}
                        onPress={() => onMenuPress(comment.attachments[0].image)}
                    >
                        <Icon name={'dot-3'} size={18} color={co} />
                    </TouchableHighlight>
                </View>

            )
        }
    }

    savedToBoard = () => {
        try {
            const { comment } = this.props
            if(comment.attachments[0].image.idea_id)
              return <Text style={styles.chatInfoName}>Saved to board</Text>
            return undefined
        } catch(e) {
            return undefined
        }
        
    }

    render() {

        const { comment, Account, onMenuPress } = this.props
        const isMine = Account.current.account_id == comment.commentor_account_id
        return (
            <View>
                {!isMine ?
                    <View style={styles.talkBubble}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <WecoraInitials
                                initials={comment.comment_by ? comment.comment_by.charAt(0) : 'A'} />

                            <View style={{ flexDirection: 'column', width: '85%' }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>

                                    <ElevatedView elevation={0} style={styles.talkBubbleTriangle} />
                                    <ElevatedView elevation={0} style={styles.talkBubbleSquare}>
                                        {this.renderImageView()}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.talk}>{comment.comment} </Text>
                                            {this.menuBtn('#000')}
                                        </View>
                                    </ElevatedView>

                                </View>
                                <View style={styles.chatInfo}>
                                    <Text style={styles.chatInfoName}>{comment.comment_by} </Text>
                                    <Text style={styles.chatInfoName}>{comment.created_at} </Text>
                                    {this.savedToBoard()}
                                </View>
                            </View>
                        </View>
                    </View> :
                    <View style={[styles.talkBubbleRev, { opacity: comment.loading ? 0.2 : 1 }]}>
                        <View style={{ flex: 1, flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                            <ElevatedView elevation={0} style={styles.talkBubbleTriangleRev} />
                            <ElevatedView elevation={0} style={styles.talkBubbleSquareRev}>
                                {this.renderImageView()}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.talkRev}>{comment.comment} </Text>
                                    {comment.loading ? undefined : this.menuBtn('#000')}
                                </View>
                            </ElevatedView>

                        </View>
                        <View style={styles.chatInfoRev}>
                            {/* <Text style={styles.chatInfoName}>{comment.comment_by} </Text> */}
                            {this.savedToBoard()}
                            <Text style={styles.chatInfoNameRev}>{comment.created_at} </Text>
                           
                        </View>
                    </View>
                }
            </View>

        );
    }


}

const styles = StyleSheet.create({
    talkContainer: {

    },
    talkBubbleRev: {
        width: '85%',
        margin: 4,
        alignSelf: 'flex-end',
        backgroundColor: 'transparent',
    },
    talkRev: {
        padding: 16,
        fontSize: 16,
        color: "#50555C",
        flex: 9
    },
    chatInfoRev: {
        marginVertical: 4,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    talkBubbleSquareRev: {
        backgroundColor: '#C8DEF3',
        borderRadius: 2,
        flex: 9,
    },
    talkBubbleTriangleRev: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderBottomWidth: 15,
        borderLeftColor: 'transparent',
        borderBottomColor: '#C8DEF3',
        transform: [
            { rotate: '180deg' }
        ],
        left: 0.75,
        shadowOpacity: 0,
    },
    chatInfoNameRev: {
        fontSize: 10,
        opacity: 0.7,
        paddingHorizontal: 4
    },


    /////// non rev //////////

    talkBubbleSquare: {
        backgroundColor: '#fff',
        borderRadius: 2,
        flex: 9,
        left: 3,
    },
    talkBubbleTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 15,
        borderLeftWidth: 15,
        borderTopColor: 'transparent',
        borderLeftColor: '#fff',
        transform: [
            { rotate: '180deg' }
        ],
        left: 5
    },
    talkBubbleTriangleIos: {
        shadowOpacity: 0.1,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 15,
        borderTopWidth: 15,
        borderRightColor: 'transparent',
        borderTopColor: '#fff',
        transform: [
            { rotate: '90deg' }
        ]
    },
    chatInfoName: {
        fontSize: 10,
        opacity: 0.7,
        paddingHorizontal: 4
    },
    talkBubble: {
        margin: 4,
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
    },

    talk: {
        padding: 16,
        color: "#50555C",
        fontSize: 16,
        flex: 9
    },
    chatInfo: {
        marginVertical: 4,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    circle: {
        marginLeft: 8,
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        top: 0,
        opacity: 0.54
    },
    icon: {
        marginTop: 10,
        fontSize: 80,
        color: Constants.Colors.loginBackgroundColor
    },
    /// Common
    image: {
        height: 160,
        width: '100%'
    },
    menuBtn: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: 30,
    }
});
