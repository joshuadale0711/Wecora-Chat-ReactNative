// @flow

import { observable, action, flow, configure, runInAction, computed, toJS } from 'mobx';
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
    @observable sectionedList = []

    @computed get myProjects() {
        return this.list.filter(proj => !proj.shared)
    }

    @computed get mySectionedProjects() {
        return this.sectionedList.reduce((result, sectionData) => {
            const { data } = sectionData;
            const filteredData = data.filter(
                proj => !proj.shared
            )
            if (filteredData.length !== 0) {
              result.push({
                ...sectionData,
                data: filteredData
              });
            }
            return result
          }, [])
    }

    data = []

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

    fetchSectionedList = flow(function* () {
        this.sectionedList = []
        this.listState = stateObs.LOADING
        try {
            const sectionedList = yield GeneralApi.fetchSectionedProjects()
            this.data = sectionedList
            this.sectionedList = sectionedList.data.professionals.map((item) => {
                return {
                    ...item,
                    data: item.projects
                }
            })
            const list = sectionedList.data.professionals.reduce(
                (acc, curVal) => acc.concat(curVal.projects), []);
            this.list = list.sort((a, b) =>
                a.name.localeCompare(b.name))
            this.listState = stateObs.DONE
        } catch (error) {
            this.listState = stateObs.ERROR
        }
    })


    @action
    setList = async (id) => {
        await this.fetchSectionedList()
        runInAction(() => {
            try {
                this.listState = stateObs.DONE
                //console.log(this.list)
            } catch (error) {
                this.listState = stateObs.ERROR
                //console.log(error.message)
            }
        })
        return this.list.find((project) => project.id == id)
    }

    setCount = flow(function* (id, count = 0) {
        const i = this.list.findIndex((project) => project.id == id)
        if (i > -1) {
            var project = { ...this.list[i] }
            project.unread_count = count
            this.list[i] = project

            this.data.data.professionals.forEach((prof) => {
                prof.projects.forEach((proj, i) => {
                    if (proj.id == id) {
                        prof.projects[i] = project
                    }
                })
            })
            var bb = this.data.data.professionals.map((item) => {
                return {
                    ...item,
                    data: item.projects
                }
            })
            this.sectionedList = bb
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