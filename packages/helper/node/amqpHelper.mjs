import * as amqp from 'amqplib';
import { isFatalError } from 'amqplib/lib/connection.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class amqpHelper {
  connString;
  connPromise;
  conn;
  connReady = false;
  errorHandler = true;
  constructor(url, errorHandler = true){
    this.connString = url;
    this.connPromise = this.getConn(url);
    this.errorHandler = errorHandler;
    this.connPromise.then((connection) => {
      console.log('inside amqpHelper constructor then');
      if(this.errorHandler){
        connection.on('error', this.connErrorHandler.bind(this));
        connection.on('close', this.connCloseHandler.bind(this));
      }
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
      if(this.errorHandler){
        innerConn.on('error', this.connErrorHandler.bind(this));
        innerConn.on('close', this.connCloseHandler.bind(this));
      }
    } catch (error) {
      this.connReady = false;
      console.error('inside amqpHelper getConn error', error)
      await delay(30000);
      innerConn = await this.getConn();
    }
    // returns Promise<connection>
    return innerConn;
  }
  connErrorHandler(err){
    console.err('inside amqpHelper connErrorHandler', err);
    if(err && isFatalError(err)){
      this._DoSthWhenConnCloseOrError();      
    }else{

    }
  }

  connCloseHandler(){
    console.error('inside amqpHelper connCloseHandler');
    this._DoSthWhenConnCloseOrError()
  }
  async _DoSthWhenConnCloseOrError(){
    this.connReady = false;
    this.conn = null;
    await delay(30000);
    this.connPromise = this.getConn();
    this.connPromise.then(connection => {
      this.conn = connection;
      this.connReady = true;
    }).catch(err => {
      this.conn = null;
      this.connReady = false;
    });
  }

  delay(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}

export { amqpHelper, amqpHelper as default }