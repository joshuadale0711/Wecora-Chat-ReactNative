// @flow

import axios from 'axios';
import { inject, observer } from 'mobx-react/native';
import stores from '../stores'

class GeneralApi {

  //url = "https://api-staging.wecora.com/v1"
  url = "https://api.wecora.com/v1"

  makeRequestCreator = () => {
    let call;
    return url => {
      if (call) {
        call.cancel("Only one request allowed at a time.");
      }
      call = axios.CancelToken.source();
      return axios.get(url, {
        cancelToken: call.token
      });
    };
  };
  get = this.makeRequestCreator();

  constructor() {
    axios.interceptors.request.use(request => {
      //console.log('Starting Request', request)
      return request
    })

  }
  // constructor(){
  //   axios.interceptors.request.use((config) => {
  //     //console.log(stores.Account.current)
  //     const token = stores.Account.current.access_token
  //     if(token) {
  //       config.headers.access_token = token;
  //     }
  //   }, (err) => {return Promise.reject(err)})
  // }

  token = () => {
    return '?access_token=' + stores.Account.current.access_token
  }

  login = (loginDetails) => {
    return axios.post("https://api.wecora.com" + '/oauth/token', {
      'grant_type': 'password',
      ...loginDetails
    })
  }

  device = (fcmID, platform, starttoken) => {
    return axios.post(this.url + '/devices' + '?access_token=' + starttoken,
      { 'device': { 'token': fcmID, 'device_type': platform } }
    )
  }

  urlTobase64 = (url) => {
    return axios.get(url, {
      responseType: 'arraybuffer'
    })
    //.then(response =>  binaryToBase64(response.data))//Buffer.from(response.data, 'binary').toString('base64'))
  }

  fetchProjects = () => {
    return axios(this.url + '/projects' + this.token());
  }

  fetchLabels = () => {
    return axios(this.url + '/labels' + this.token());
  }

  fetchBoards = (projectID) => {
    return axios(this.url + '/projects/' + projectID +
      '/boards' + this.token());
  }

  fetchChats = (boardID, page = 1) => {
    return this.get(this.url + '/boards/' + boardID + '/comments' +
      this.token() + '&page=' + page);
  }

  fetchMembers = (boardID) => {
    return axios(this.url + '/boards/' + boardID + '/members' +
      this.token());
  }

  fetchBoardItems = (boardID) => {
    return axios(this.url + '/boards/' + boardID + '/ideas' +
      this.token());
  }

  fetchIdea = (ideaId) => {
    return axios(this.url + '/ideas/' + ideaId +
      this.token());
  }

  fetchUserItems = () => {
    return axios(this.url + '/items' +
      this.token());
  }

  fetchQueryItems = (query) => {
    return axios(this.url + '/items' + this.token() + '&query=' + query);

  }

  fetchProjectItems = (projectID) => {
    return axios(this.url + '/projects/' + projectID + '/items' +
      this.token());
  }

  fetchLabelItems = (labelID) => {
    return axios(this.url + '/labels/' + labelID + '/items' +
      this.token());
  }

  createComment = (boardID, comment, attachments) => {
    return axios.post(this.url + '/boards/' + boardID + '/comments' +
      this.token(), {
        "comment": {
          "comment": comment,
          "attachments": attachments
        }
      });
  }

  editIdea = (ideaId, details, data) => {
    return axios.put(this.url + '/ideas/' +
      ideaId + this.token(), {
        "idea": {
          "quantity": details.quantity ? details.quantity : 0,
          "item_attributes": {
            ...details,
            "media_url": data
          }
        }
      });
  }

  createItemBoard = (boardID, details, data) => {
    return axios.post(this.url + '/boards/' + boardID + '/items' +
      this.token(), {
        "item": {
          ...details,
          "media_url": data
        }
      });
  }
  createItemProject = (projectID, details, data) => {
    return axios.post(this.url + '/projects/' + projectID + '/items' +
      this.token(), {
        "item": {
          ...details,
          "media_url": data
        }
      });
  }
  createProject = (name) => {
    return axios.post(this.url + '/projects' + this.token() +
      '&project[name]=' + name);
  }
  createBoard = (parent, name) => {
    return axios.post(this.url + '/projects/' + parent + '/boards' +
      this.token() + '&board[name]=' + name);
  }

  createPassword = (email) => {
    return axios.post(this.url + '/account/password' +
      '?account[email]=' + email);
  }

  inviteClient = (parent, email) => {
    return axios.post(this.url + '/boards/' + parent + '/members' +
      this.token() + '&email=' + email);
  }

}

export default new GeneralApi();