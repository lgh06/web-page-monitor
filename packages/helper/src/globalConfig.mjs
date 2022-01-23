// config value across all projects.  
// if not defined here, use sub-package defined values
// TODO
let globalConfig = {
  mqConnString: 'amqp://localhost',
  // below values both used in worker / scheduler
  // as rabbitmq's producer;
  // and used in pptr
  // as rabbitmq's consumer.
  exchange: 'testPptrTaskDelayExchange001',
  queue: 'testPptrTaskQueue001',
  queueBinding: 'testPptrBindingName',
}


export { globalConfig }