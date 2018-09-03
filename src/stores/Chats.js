// @flow

import { observable, action, flow } from 'mobx';
import GeneralApi from '../services'
import Constants from '../global/Constants';
import Account from './Account'
import App from './App'
import Projects from './Projects'
import Boards from './Boards'
const stateObs = Constants.Global.state
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../pusher.json';
import ImgToBase64 from 'react-native-image-base64';
import { Navigation } from 'react-native-navigation';

class Store {

    @observable commentState = stateObs.START;
    @observable createState = stateObs.START;
    @observable listState = stateObs.START;
    @observable errors = undefined;
    @observable parent = undefined;
    @observable list = []
    @observable meta = undefined
    @observable members = []
    @observable chatScreen = false


    fetchList = flow(function* (parent) {
        if (this.parent !== parent) {
            this.parent = parent
            this.list = []
            this.listState = stateObs.LOADING
            try {
                const list = yield GeneralApi.fetchChats(this.parent.id)
                this.listState = stateObs.DONE
                this.list = list.data.comments
                this.meta = list.data.meta
                //console.log(this.list)
            } catch (error) {
                this.listState = stateObs.ERROR
                //console.log(error.message)
            }
        }
    })

    fetchPage = flow(function* () {
        if (this.meta.page != this.meta.page_count && this.meta.page_count != 0) {
            this.listState = stateObs.LOADINGPAGE
            try {
                const list = yield GeneralApi.fetchChats(this.parent.id, (+this.meta.page + 1))
                this.listState = stateObs.DONE
                let temp = [...this.list, ...list.data.comments]
                this.list = Constants.Global.removeDuplicates(temp, 'id')
                this.meta = list.data.meta

                //console.log(this.list)
            } catch (error) {
                this.listState = stateObs.DONE
                //console.log(error.message)
            }
        }

    })

    fetchMembers = flow(function* () {
        try {
            const resp = yield GeneralApi.fetchMembers(this.parent.id)
            this.members = [resp.data.owner, ...resp.data.members]
            //console.log(this.members)
        } catch (error) {
            //console.log(error.message)
        }
    })

    updateChat = flow(function* (parent) {
        try {
            const resp = yield GeneralApi.fetchChats(this.parent.id, 1)
            let temp = [...this.list, ...resp.data.comments]
            this.list = resp.data.comments//Constants.Global.removeDuplicates(temp, 'id')
            this.meta = resp.data.meta
        } catch (error) {
            //console.log(error.message)
        }
    })

    create = flow(function* (email) {
        this.createState = stateObs.LOADING
        try {
            const resp = yield GeneralApi.inviteClient(this.parent.id, email)
            this.createState = stateObs.DONE
            //console.log(resp.data)
        } catch (error) {
            this.createState = stateObs.ERROR
            //console.log(error.message)
        }
    })

    createComment = flow(function* (comment, attachment) {
        var id = new Date().getMilliseconds()
        this.commentState = stateObs.LOADING
        const dummy = {
            id,
            comment,
            commentor_account_id: Account.current.account_id,
            loading: id
        }
        try {
            var data = []

            this.list = [dummy, ...this.list]

            if (attachment && attachment.uri) {
                data = [attachment.uri]
                if (!attachment.uri.includes(';base64,')) {
                    data = yield ImgToBase64.getBase64String(data[0])
                    data = ['data:image/jpeg;base64,' + data]
                }
            }
            //console.log(data)
            dummy.attachments = [{ image: { large: data[0] } }]
            var i = this.list.findIndex(msg => msg.id == dummy.id)

            this.list[i] = dummy

            const resp = yield GeneralApi.createComment(this.parent.id, comment, data)
            this.commentState = stateObs.DONE

            //console.log(resp.data)
            var i = this.list.findIndex(msg => msg.id == dummy.id)

            this.list[i] = resp.data
        } catch (error) {
            this.commentState = stateObs.ERROR
            console.log(error.message)
        }
    })

    @action reset() {
        this.createState = stateObs.START
    }

    @action observeChatScreen(doObserve) {
        this.chatScreen = doObserve
    }

    @action updateChatExt() {
        this.updateChat(this.parent.id)
    }

    @action subscribeChat() {
        var pusher = new Pusher(pusherConfig.key, pusherConfig);
        //console.log(Account.current.account_id)
        var chatChannel = pusher.subscribe('comments_' + Account.current.account_id); // (2)
        chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
           // console.log('subscription suceeded')
            chatChannel.bind('reload', (data) => {
                
                if (Account.current) {
                    if (this.chatScreen) {
                        if (this.parent && data.commentor_id != Account.current.account_id && data.board_id == this.parent.id) {
                            this.updateChat(this.parent.id)
                        }
                    } else {
                        const { project_id, board_id, comment_counts } = data
                        const { project, board } = comment_counts
                        Projects.setCount(project_id, project)
                        Boards.setCount(board_id, board)
                    }
                }

            });

            chatChannel.bind('remove', (data) => {
                if (Account.current) {
                    if (this.chatScreen) {
                        if (this.parent && data.commentor_id != Account.current.account_id && data.board_id == this.parent.id) {
                            this.updateChat(this.parent.id)
                        }
                    }
                }
            });
        });
    }



}

export default new Store();