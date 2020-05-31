/* Magic Mirror
 * Module: iFrame-Ping
 *
 * By AgP42
 * 
 * This is a modified version from MMM-ping by Christopher Fenner https://github.com/CFenner
 * MIT Licensed.
 */
 
var NodeHelper = require('node_helper');
var request = require('request');
const url = require("url");

module.exports = NodeHelper.create({
  start: function () {
    console.log(this.name + ' helper started ...');
    this.lastConnection = new Date(); //on considere un ping ok au start-up...
    
  this.expressApp.get('/youtube', (req, res) => {

  var query = url.parse(req.url, true).query;
  var embed_url = query.embed_url;
  var load = query.load || false;

  if (load ===  "true" ){
    this.sendSocketNotification("LOAD_VIDEO", embed_url);
    res.send({"status": "success", "video": embed_url});
  }else{
    this.sendSocketNotification("STOP_VIDEO", "");
    res.send({"status": "success", "video": "stopped"});
  }


  // if (message == null && type == null){
  //     res.send({"status": "failed", "error": "No message and type given."});
  // }
  // else if (message == null){
  //     res.send({"status": "failed", "error": "No message given."});
  // }
  // else if (type == null) {
  //     res.send({"status": "failed", "error": "No type given."});
  // }
  // else {
  //     var log = {"type": type, "message": message, "silent": silent, "timestamp": new Date()};
  //     res.send({"status": "success", "payload": log});
  //     this.sendSocketNotification("NEW_MESSAGE", log);
  //     // this.storeLog(log);
  // }
    });
    
  },
  
  socketNotificationReceived: function(notification, payload) {
    console.log(notification);
    if (notification === 'PING_REQUEST') {
      var that = this;
      request({
          url: payload,
          method: 'GET'
        }, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            that.lastConnection = new Date(); //success, we record the new date
          }
          //whatever the answer, we send the answer back to main file with status and lastConnection timestamp
          that.sendSocketNotification('PING_RESPONSE', {
              status: !error && response.statusCode == 200?"OK":"ERROR",
              lastConnection: that.lastConnection
          });
        }
      );
    }   
  }
});
