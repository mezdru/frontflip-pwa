import commonStore from '../stores/common.store';

class UrlService {

    env;
    httpType;
    url;
    locale;

    checkEnv() {
        this.env = process.env.NODE_ENV;
        if( window.location.href.search('staging') !== '-1') {
            this.env = 'staging';
        }
    }

    checkLocale() {
        this.locale = ( (this.env === 'production' || this.env ==='staging') ? (commonStore.getCookie('locale') || commonStore.locale) : 'en-UK');
    }

    checkHttp() {
        if(this.env === 'production') {
            this.httpType = 'https://';
        }else {
            this.httpType = 'http://';
        }
    }

    createUrl(host, path, organisationTag) {
        this.checkEnv();
        this.checkLocale();
        this.checkHttp();
        
        if(this.env === 'production'){
            if(organisationTag) {
                this.url = this.httpType + organisationTag + '.' + host + '/' + this.locale + path;
            }else{
                this.url = this.httpType + host + '/' + this.locale + path;
            }
        }else{
            if(organisationTag) {
                this.url = this.httpType + host + '/' + this.locale + path + '?subdomains='+organisationTag;
            }else{
                this.url = this.httpType + host + '/' + this.locale + path;
            }
        }
        return this.url;
    }
}



export default new UrlService();