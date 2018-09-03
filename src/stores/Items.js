// @flow

import { observable, action, flow, computed } from 'mobx';
import GeneralApi from '../services'
import Constants from '../global/Constants';
const stateObs = Constants.Global.state
const itemType = Constants.Global.itemType

import {ToastAndroid} from "react-native"


class Store {

    @observable createState = stateObs.START;
    @observable listState = stateObs.START;
    @observable errors = undefined;
    @observable parent = undefined;
    @observable parentType = itemType.USER;
    @observable.shallow list = []
    @observable selectedItem = undefined


    fetchList = flow(function* (parent, parentType) {
        //if (this.parent !== parent) 
        {
            this.parent = parent
            this.list = []
            this.listState = stateObs.LOADING

            var reslist
            try {
                //console.log(parentType)
                switch (parentType) {
                    case itemType.USER:
                        resp = yield GeneralApi.fetchUserItems()
                        reslist = resp.data.items
                        break;
                    case itemType.BOARD:
                        resp = yield GeneralApi.fetchBoardItems(this.parent.id)
                        //console.log(resp)
                        reslist = resp.data.ideas.map(idea => {
                            const media = idea.item && idea.item.media ? idea.item.media : { large: 'https://source.unsplash.com/random' }
                            return ({
                                quantity: idea.quantity,
                                ...idea.item,
                                media: media,
                                board: idea.board.name,
                                project: idea.board.project.name,
                                group: idea.group,
                                ideaId: idea.id
                            })
                        })
                        reslist = reslist.reduce((r, a) => {
                            r[a.group.name] = r[a.group.name] || [];
                            r[a.group.name].push(a);
                            return r;
                        }, Object.create(null));
                        const tempList = []
                        for (const [key, value] of Object.entries(reslist)) {
                            tempList.push({ title: key, data: value })
                        }
                        reslist = tempList
                        //console.log(reslist)
                        break;
                    case itemType.LABEL:
                        resp = yield GeneralApi.fetchLabelItems(this.parent.id)
                        reslist = resp.data.items
                        break;
                    case itemType.PROJECT:
                        resp = yield GeneralApi.fetchProjectItems(this.parent.id)
                        reslist = resp.data.items
                        break;
                    case itemType.QUERY:
                        resp = yield GeneralApi.fetchQueryItems(this.parent)
                        reslist = resp.data.items
                        break;
                    default:
                        break

                }
                this.listState = stateObs.DONE
                this.list = reslist
                //console.log(this.list)
            } catch (error) {
                this.listState = stateObs.ERROR
                //console.log(error.message)
            }
        }
    })

    fetchIdea = flow(function* (id) {
        try {
            const resp = yield GeneralApi.fetchIdea(id)
            const idea = resp.data
            //console.log(idea)
            const media = idea.item && idea.item.media ? idea.item.media : { large: 'https://source.unsplash.com/random' }
            this.setSelected({
                quantity: idea.quantity,
                ...idea.item,
                media: media,
                board: idea.board.name,
                project: idea.board.project.name,
                group: idea.group,
                ideaId: idea.id
            })
        } catch (error) {
            console.log(error.message)
        }
    })


    create = flow(function* (name) {
        this.createState = stateObs.LOADING
        try {
            const resp = yield GeneralApi.createItem(this.parent.id, name)
            this.createState = stateObs.DONE

            //console.log(resp.data)
            this.list.replace([resp.data, ...this.list])
        } catch (error) {
            this.createState = stateObs.ERROR
            //console.log(error.message)
        }
    })

    setEdited = flow(function* (idea) {

        try {
            const media = idea.item && idea.item.media ? idea.item.media : { large: 'https://source.unsplash.com/random' }
            const temp = {
                quantity: idea.quantity,
                ...idea.item,
                media: media,
                board: idea.board.name,
                project: idea.board.project.name,
                group: idea.group,
                ideaId: idea.id
            }
            // var listTemp = this.itemList
            // for (const [i, group] of listTemp.entries()) {
            //     for (const [j, itemea] of group.data.entries()) {
            //         if (idea.id == itemea.ideaId) {
            //             listTemp[i].data[j] = temp
            //             this.list = [...listTemp]
            //             ToastAndroid.show(this.list[i].data[j].name, ToastAndroid.LONG)
            //         }
            //     }
            // }
            this.setSelected(temp)
        } catch(e) {
            ToastAndroid.show(e.message, ToastAndroid.LONG)
        }
        
    })

    @action reset() {
        this.createState = stateObs.START
    }

    @action setSelected(selectedItem) {
        this.selectedItem = selectedItem
    }
    @action clearSelected() {
        this.selectedItem = undefined
    }

    @computed get itemList(){
        return this.list.map((v)=>{
            return { title: v.title, data: v.data.slice() }
        }).slice();// And slice the listData
    }
}

export default new Store();