let slack = require('slack-notify')('https://hooks.slack.com/services/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');
const FILENAME = 'slack_helper.js';

/**
 * @description Send errors data to many channels in order to monitor them.
 */
class SlackService {

    static notifyError(err, line, developerName = null, filename = FILENAME){
        if(process.env.NODE_ENV !== 'production') return;
        let slackObject = {channel : '#errors'+(developerName?'-'+developerName:''), text : filename + ':line:'+line+ ' - ' + err};
        slack.send(slackObject);
    }
    static notify(channel, message){
        if(process.env.NODE_ENV !== 'production') return;

        slack.send({
            channel: channel,
            text: message
        });
    }
}

export default SlackService;