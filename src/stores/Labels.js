// @flow

import { observable, action, flow } from 'mobx';
import GeneralApi from '../services'
import Constants from '../global/Constants';
const stateObs = Constants.Global.state


class Store {
    @observable createState = stateObs.START;
    @observable listState = stateObs.START;
    @observable errors = undefined;
    @observable list = []


    fetchList = flow(function* () {
        this.list = []
        this.listState = stateObs.LOADING
        try {
            const list = yield GeneralApi.fetchLabels()
            this.listState = stateObs.DONE
            this.list = list.data.labels
            //console.log(this.list)
        } catch (error) {
            this.listState = stateObs.ERROR
            //console.log(error.message)
        }
    })

    @action reset() {
        this.createState = stateObs.START
      }

}

export default new Store();