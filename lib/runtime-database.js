const _ = require('lodash');
const mongoose = require('mongoose');

const { DB_CONNECTION } = require('../config');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

mongoose.connect(DB_CONNECTION);

const Investors = mongoose.model('Investors', new Schema({
  full_name: String,
  company: String,
  stage: String,
  money: String,
  image_url: String,
  sectors: Array,
  crunchbase: String,
}, { collection: 'investores' }));

class RuntimeDatabase {
  constructor() {
    this.state = {
      users: {},
      investors: []
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

  getInvestors() {
    return Investors.find({}).then((docs) => {
      console.log(`Got docs: ${docs}`);
      this.state.investors = docs;
    }).catch((err) => {
      console.log(`CANT GET INVESTORS: ${err}`);
    });
  }

  getInvestorsBySectors(sectors) {
    console.log(`Sectors: ${sectors}`);
    return Investors.find({}).then((docs) => {
      console.log(`Got docs: ${docs}`);
      this.state.investors = docs;
      this.state.investors = _.filter(this.state.investors, (investor) => {
        var array3 = investor.sectors.filter(function(obj) { return sectors.indexOf(obj) != -1; });
        console.log(`Array: ${array3}`);
        if (array3.length > 0) {
          return true;
        } else {
          return false;
        }
      });
      console.log(`There are ${this.state.investors.length} inve`)
    }).catch((err) => {
      console.log(`CANT GET INVESTORS: ${err}`);
    });
  }
}

// Singleton
if (!global.runtimeDatabase) {
  global.runtimeDatabase = new RuntimeDatabase();
}

module.exports = global.runtimeDatabase;
