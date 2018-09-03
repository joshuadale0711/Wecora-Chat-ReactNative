// @flow

import { observable, action, flow, configure, runInAction, computed } from 'mobx';
import GeneralApi from '../services'

import App from './App'
import Constants from '../global/Constants';
const stateObs = Constants.Global.state

configure({ enforceActions: true });

class Store {
    @observable createState = stateObs.START;
    @observable listState = stateObs.START;
    @observable errors = undefined;
    @observable list = []

    @computed get myProjects() {
        return this.list.filter(proj => !proj.shared)
    }

    fetchList = flow(function* () {
        this.list = []
        this.listState = stateObs.LOADING
        try {
            const list = yield GeneralApi.fetchProjects()
            this.listState = stateObs.DONE
            this.list = list.data.projects.sort((a, b) =>
                a.name.localeCompare(b.name))
            //console.log(this.list)
        } catch (error) {
            this.listState = stateObs.ERROR
            //console.log(error.message)
        }
    })

    @action
    setList = async (id) => {
        const list = await GeneralApi.fetchProjects()
        runInAction(() => {
            try {
                this.list = []
                this.listState = stateObs.DONE
                this.list = list.data.projects.sort((a, b) =>
                    a.name.localeCompare(b.name))
                //console.log(this.list)
            } catch (error) {
                this.listState = stateObs.ERROR
                //console.log(error.message)
            }
        })
        return this.list.find((project) =>  project.id == id)
    }

    setCount = flow(function* (id, count = 0)  {
        const i = this.list.findIndex((project) => project.id == id)
        if(i > -1){
            var project = {...this.list[i]}
            project.unread_count = count
            this.list[i] = project
        }
    })

    create = flow(function* (name) {
        this.createState = stateObs.LOADING
        try {
            const resp = yield GeneralApi.createProject(name)
            this.createState = stateObs.DONE

            //console.log(resp.data)
            App.navigateToScreen(resp.data, Constants.Screens.BOARDS_SCREEN)
            this.list = [resp.data, ...this.list].sort((a, b) =>
                a.name.localeCompare(b.name))
        } catch (error) {
            this.createState = stateObs.ERROR
            //console.log(error.message)
        }
    })

    @action reset() {
        this.createState = stateObs.START
    }

}

export default new Store();