'use strict';

const hooks = require('./hooks');
import AWS from 'aws-sdk';
import Store from 's3-blob-store';
import BlobService from 'feathers-blob';

module.exports = function(){
  
  const app = this;
  
  const s3 = new AWS.S3({
  accessKeyId: app.get('aws').accessKeyId,
  secretAccessKey: app.get('aws').secretAccessKey,
  });

  const blobStore = Store({
    client: s3,
    bucket: 'my-palate-image-store'
  });

  const blobService = BlobService({
    Model: blobStore
  });
  
  // Initialize our services with any options it requires
  app.use('/images', blobService);

  // Get our initialize services to that we can bind hooks
  const imageService = app.service('/images');

  // Set up our before hooks
  imageService.before(hooks.before);

  // Set up our after hooks
  imageService.after(hooks.after);
};

module.exports.Service = BlobService;
