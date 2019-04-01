let slack = require('slack-notify')('https://hooks.slack.com/services/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');
const FILENAME = 'slack_helper.js';

/**
 * @description Send errors data to many channels in order to monitor them.
 */
class SlackService {

    static notifyError(err, line, developerName = null, filename = FILENAME){
        let slackObject = {channel : '#errors'+(developerName?'-'+developerName:''), text : filename + ':line:'+line+ ' - ' + err + 
                                                                                            '                                      ' +
                                                                                            '{Navigator data : ('+
                                                                                              window.navigator.appCodeName+'|'+
                                                                                              window.navigator.appVersion+'|'+
                                                                                              window.navigator.cookieEnabled+')}'};
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