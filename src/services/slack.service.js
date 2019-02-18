let slack = require('slack-notify')('https://hooks.slack.com/services/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');
const FILENAME = 'slack_helper.js';

/**
 * @description Send errors data to many channels in order to monitor them.
 */
class SlackService {

    static notifyError(err, line, developerName = null, filename = FILENAME){
        let slackObject = {channel : '#errors'+(developerName?'-'+developerName:''), text : filename + ':line:'+line+ ' - ' + err};
        slack.send(slackObject);
        try{        
          let slackObject2 = {channel : '#errors'+(developerName?'-'+developerName:''), text : JSON.stringify(err)};
          slack.send(slackObject2);
        }catch(err){
          let slackObject3 = {channel : '#errors'+(developerName?'-'+developerName:''), text : "Can't parse the err object with json stringify."};
          slack.send(slackObject3);
        }
    }
    static notify(channel, message){
        slack.send({
            channel: channel,
            text: message
        });
    }
}

export default SlackService;