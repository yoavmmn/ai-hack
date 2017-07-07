const _ = require('lodash');

class RuntimeDatabase {
  constructor() {
    this.state = {
      users: {},
    };
  }

  getState() {
    return this.state;
  }

  getUser(id) {
    return this.state.users[id];
  }

  addUser(id) {
    this.state.users[id] = {
      id,
      url: null,
      description: null,
      acceptedDesc: false,

      askedQuestion: null,
    };
  }

  updateUser(id, obj) {
    this.state.users[id] = _.merge(
      this.getUser(id),
      obj
    );
  }

  updateUrl(id, url) {
    this.state.users[id].url = url;
  }

  updateDesc(id, desc) {
    this.state.users[id].description = desc;
  }
}

// Singleton
if (!global.runtimeDatabase) {
  global.runtimeDatabase = new RuntimeDatabase();
}

module.exports = global.runtimeDatabase;
