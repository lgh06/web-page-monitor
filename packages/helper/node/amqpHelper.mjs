import * as amqp from 'amqplib';
import { isFatalError } from 'amqplib/lib/connection.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class amqpHelper {
  connString;
  connPromise;
  conn;
  connReady = false;
  constructor(url){
    this.connString = url;
    this.connPromise = this.getConn(url);
    this.connPromise.then((connection) => {
      console.log('inside amqpHelper constructor then');
      // connection.on('error', this.connErrorHandler.bind(this));
      // connection.on('close', this.connCloseHandler.bind(this));
    });
    return this;
  }

  /**
   * 
   * @param {string} url 
   * @returns {Promise<amqp.Connection>}
   */
  async getConn(url){
    console.log('inside amqpHelper getConn');
    if(this.connReady === true && this.conn){
      return this.conn;
    }
    url = url || this.connString;
    let innerConn;
    try {
      innerConn = await amqp.connect(url);
      this.conn = innerConn;
      this.connReady = true;
    } catch (error) {
      this.connReady = false;
      console.error(error)
      await delay(30000);
      innerConn = await this.getConn();
    }
    // returns Promise<connection>
    return innerConn;
  }
  // connErrorHandler(err){
  //   console.err('inside amqpHelper connErrorHandler', err);
  //   if(err && isFatalError(err)){
  //     this._DoSthWhenConnCloseOrError();      
  //   }else{

  //   }
  // }

  // connCloseHandler(){
  //   console.error('inside amqpHelper connCloseHandler');
  //   this._DoSthWhenConnCloseOrError()
  // }
  // async _DoSthWhenConnCloseOrError(){
  //   this.connReady = false;
  //   await delay(30000);
  //   this.connPromise = this.getConn();
  //   this.connPromise.then(connection => {
  //     this.conn = connection;
  //     this.connReady = true;
  //   }).catch(err => {
  //     this.connReady = false;
  //   });
  // }

  delay(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}

export { amqpHelper, amqpHelper as default }