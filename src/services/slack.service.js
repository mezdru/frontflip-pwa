let slack = require('slack-notify')(process.env.REACT_APP_SLACK_APP);
const FILENAME = 'slack_helper.js';

/**
 * @description Send errors data to many channels in order to monitor them.
 */
class SlackService {

    static notifyError(err, line, developerName = null, filename = FILENAME){
        let slackObject = {channel : '#errors'+(developerName?'-'+developerName:''), text : filename + ':line:'+line+ ' - ' + err};
        slack.send(slackObject);
    }
    static notify(channel, message){
        slack.send({
            channel: channel,
            text: message
        });
    }
}

export default SlackService;