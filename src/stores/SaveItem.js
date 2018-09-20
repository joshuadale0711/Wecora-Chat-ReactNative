// @flow
import { AppState, Linking, Platform } from 'react-native';
import { observable, action, flow } from 'mobx';
import GeneralApi from '../services'
import Constants from '../global/Constants';
import Account from './Account'
import Items from './Items'
import Chats from './Chats'
import ImgToBase64 from 'react-native-image-base64';
var RNFS = require('react-native-fs');
const stateObs = Constants.Global.state
import Toast from 'react-native-simple-toast';
import userDefaults from 'react-native-user-defaults'
import App from './App';


class Store {

    @observable createState = stateObs.START;
    @observable listState = stateObs.START;
    @observable errors = undefined;
    @observable grandParent = undefined;
    @observable parent = undefined;
    @observable list = []
    @observable selectedItem = undefined
    @observable shared = undefined
    @observable name = undefined
    @observable selectedError = undefined
    @observable selectedURL = undefined
    @observable parseURL = undefined
    @observable selectedItems = undefined


    @observable description = undefined
    @observable unit_cost = undefined
    @observable selling_price = undefined
    @observable unit_cost_currency = undefined
    @observable selling_price_currency = undefined
    @observable quantity = undefined
    @observable id = undefined
    @observable ideaId = undefined

    @observable professional = undefined

    constructor() {
        if (Platform.OS == 'ios') {

            Linking.addEventListener('url', this.handleDeepLink)
            this.getSavedData()
        }
        else
            AppState.addEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = (currentAppState) => {
        Linking.getInitialURL().then(url => this.handleDeepLink({ url }));
    };

    handleDeepLink = (event) => {
        //Toast.show(event.url)
        //console.log(event.url)
        if (event.url) {
            if (Platform.OS == 'ios') {
                const checkUrl = event.url.replace('wecora://', '')
                if (checkUrl == '=parseHTML=?JSON=') {
                    return this.getSavedData()
                }
                else if (checkUrl.includes("currentUrl") && checkUrl.includes("currentTitle") && checkUrl.includes("html")) {
                    this.setParseURL(checkUrl)
                    this.setSelected(undefined, true)
                    Toast.show('Adding item.  Please wait…')
                    App.navigate()
                    return
                }
                else {
                    this.setSelected(checkUrl, true)
                }
            }
            else {
                var url = event.url.replace('app://wecoraShare/', '')
                //Toast.show('Adding item.  Please wait… ' + url)
                this.setSelected(url, true)
                
                // var name = url.substring(url.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")
                // if (name.includes('@'))
                //     name = name.split('@')[1]
                // this.setSelected(url, true, name)
            }
            if (this.selectedItem == undefined) this.setSelectedError()
            else {
                Toast.show('Adding item.  Please wait…')
                console.log(this.selectedItem)
                App.navigate()
            }

        }
    };

    getSavedData = () => {
        userDefaults.get("data", "group.com.wecoraShare", (err, data) => {
            if (!err && data) {
                data = data.split("=>>=>")
                if (data.length == 2 && new Date().getTime() - data[0] <= 1 * 30 * 1000) {
                    this.handleDeepLink({ url: data[1] })
                }
                userDefaults.empty()
            }
        })
    }

    fetchList = flow(function* (grandParent) {
        this.grandParent = grandParent
        this.list = []
        this.listState = stateObs.LOADING
        this.professional = undefined
        try {

            var list = yield GeneralApi.fetchBoards(this.grandParent.id)
                list = list.data.boards
                if(list[0] && list[0].professional )
                    this.professional = list[0].professional 
                this.list = list.sort((a, b) =>
                    a.name.localeCompare(b.name))
                this.listState = stateObs.DONE
                
            
            //console.log(this.list)
        } catch (error) {
            this.listState = stateObs.ERROR
            //console.log(error.message)
        }

    })


    createMultiple = flow(function* () {
        this.createState = stateObs.LOADING
        const details = {}
        try {
            //var data = []
            if (this.selectedItems) {
                for (const item of this.selectedItems) {
                    var data = item
                    if (data.includes('file:///') || data.includes('/Shared/AppGroup/')) {
                        data = yield ImgToBase64.getBase64String(data)
                        data = 'data:image/jpeg;base64,' + data
                    }

                    if (this.parent)
                        yield GeneralApi.createItemBoard(this.parent.id, details, data)
                    else if (this.grandParent)
                        yield GeneralApi.createItemProject(this.grandParent.id, details, data)
                }
            }
            this.createState = stateObs.DONE
            this.clearSelected()
            //console.log(resp.data)
        } catch (error) {
            this.createState = stateObs.ERROR
            //console.log(error.message)
        }
    })

    create = flow(function* (details) {
        this.createState = stateObs.LOADING

        try {
            var data = []
            if (this.selectedItem) {
                data = this.selectedItem
                if (data.includes("https://cdn-staging.wecora.com/attachment")) {
                    data = data.replace('large', 'original')
                }
                if (data.includes('file:///') || data.includes('/Shared/AppGroup/')) {
                    data = yield ImgToBase64.getBase64String(data)
                    data = 'data:image/jpeg;base64,' + data
                }
            }
            if (this.parent)
                yield GeneralApi.createItemBoard(this.parent.id, details, data)
            else if (this.grandParent)
                yield GeneralApi.createItemProject(this.grandParent.id, details, data)
            this.createState = stateObs.DONE
            this.clearSelected()
            Chats.updateChatExt()
            //console.log(resp.data)
        } catch (error) {
            this.createState = stateObs.ERROR
            //console.log(error.message)
        }
    })

    edit = flow(function* (details) {
        this.createState = stateObs.LOADING

        try {
            var data = []
            if (this.selectedItem) {
                data = this.selectedItem
                if (data.includes('file:///') || data.includes('/Shared/AppGroup/')) {
                    data = yield ImgToBase64.getBase64String(data)
                    data = 'data:image/jpeg;base64,' + data
                }
            }
            const resp = yield GeneralApi.editIdea(this.ideaId, details, data)
            Items.setEdited(resp.data)
            // else if (this.grandParent)
            //     yield GeneralApi.createItemProject(this.grandParent.id, details, data)
            this.createState = stateObs.DONE
            this.clearSelected()
            //console.log(resp.data)
        } catch (error) {
            this.createState = stateObs.ERROR
            //console.log(error)
        }
    })

    @action reset() {
        this.createState = stateObs.START
        this.parent = undefined
        this.grandParent = undefined
        this.selectedItem = undefined
        this.listState = stateObs.START
        this.list = []
    }

    @action setParent(parent) {
        this.parent = parent
    }

    @action setGrandParent(grandParent) {
        this.grandParent = grandParent
    }

    getParsedData = (selectedItem) => {
        if (selectedItem && selectedItem.includes("file:///")) {
            var list = selectedItem.split("file:///")
            if (Platform.OS == 'android') {
                list.map((ind, i) => {
                    list[i] = "file:///" + ind
                })
            }
            const res = list.slice(1)
            if (res.length < 2) res = undefined
            return {
                selectedItem: list[1],
                selectedItems: res
            }
        } else {
            return {
                selectedItem: selectedItem,
                selectedItems: undefined
            }
        }

    }

    @action setSelected(selectedItemo, shared, name, selectedURL, ideaId,
        id, description, unit_cost, selling_price,
        unit_cost_currency, selling_price_currency, quantity) {

        const { selectedItem, selectedItems } = this.getParsedData(selectedItemo)
        this.selectedItem = selectedItem
        this.selectedItems = selectedItems
        this.shared = shared
        this.name = name
        this.selectedURL = selectedURL
        this.selectedError = undefined


        this.ideaId = ideaId
        this.id = id
        this.description = description
        this.unit_cost = unit_cost
        this.selling_price = selling_price
        this.unit_cost_currency = unit_cost_currency
        this.selling_price_currency = selling_price_currency
        this.quantity = quantity
    }

    @action clearSelected() {
        this.selectedItem = undefined
        this.shared = undefined
        this.name = undefined
        this.selectedError = undefined
        this.parseURL = undefined
        this.selectedURL = undefined
        this.selectedItems = undefined


        this.ideaId = undefined
        this.id = undefined
        this.description = undefined
        this.unit_cost = undefined
        this.selling_price = undefined
        this.unit_cost_currency = undefined
        this.selling_price_currency = undefined
        this.quantity = undefined
    }

    @action setSelectedError() {
        Toast.show('Unable To fetch image, Please try again!')
    }

    @action setParseURL(url) {
        this.parseURL = url
    }

}

export default new Store();