import commonStore from '../stores/common.store';
import twemoji from 'twemoji';
import defaultPicture from '../resources/images/placeholder_person.png';
import defaultHashtagPicture from '../resources/images/placeholder_hashtag.png';

class ProfileService {
  EXTRA_LINK_LIMIT = 20;
  
  setExtraLinkLimit(number) {
    this.EXTRA_LINK_LIMIT = number;
  }
  
  getProfileType(tag) {
    if (tag.charAt(0) === '#') {
      return 'hashtag';
    } else if (tag.charAt(0) === '@') {
      return 'person';
    } else {
      return null;
    }
  }
  
  getDefaultPictureByType(type) {
    if (type === 'hashtag') return defaultHashtagPicture;
    else if (type === 'person') return defaultPicture;
    else return null;
  }
  
  transformLinks(item) {
    if (!item) return;
    item.links = item.links || [];
    item.links.forEach(function (link, index, array) {
      this.makeLinkDisplay(link);
      this.makeLinkIcon(link);
      this.makeLinkUrl(link);
      if (index > this.EXTRA_LINK_LIMIT - 1) link.class = 'extraLink';
    }.bind(this));
  }
  
  makeLinkIcon(link) {
    switch (link.type) {
      case 'email':
        link.icon = 'envelope-o';
        break;
      case 'address':
      case 'location':
        link.icon = 'map-marker';
        break;
      case 'hyperlink':
        link.icon = 'link';
        break;
      case 'workplace':
        link.icon = 'user';
        break;
      case 'workchat':
        link.icon = 'comment';
        break;
      case 'landline':
        link.icon = 'phone-square';
        break;
      default:
        link.icon = link.type;
        break;
    }
  }
  
  makeLinkDisplay(link) {
    link.display = link.display || link.value;
  }
  
  makeLinkUrl(link) {
    link.url = link.url || link.uri;
    if (!link.url || (link.type === 'workplace') || (link.type === 'workchat')) {
      switch (link.type) {
        case 'email':
          link.url = 'mailto:' + link.value;
          break;
        case 'phone': case 'landline':
          link.url = 'tel:' + link.value;
          break;
        case 'home':
          link.url = 'tel:' + link.value;
          break;
        case 'address':
          link.url = 'http://maps.google.com/?q=' + encodeURIComponent(link.value);
          break;
        case 'workplace':
          link.url = this.setWorkplaceLink(link.url);
          break;
        case 'workchat':
          link.url = this.setWorkchatLink(link.url);
          break;
        default:
          link.url = link.value;
          break;
      }
    }
  }
  
  setWorkplaceLink(linkUrl) {
    if (!linkUrl) {
      return;
    }
    if (this.mobileAndTabletcheck()) {
      let linkUrlArray = linkUrl.split('.');
      linkUrlArray[0] = "https://workplace";
      return linkUrlArray.join('.');
    } else {
      return linkUrl;
    }
  }
  
  setWorkchatLink(linkUrl) {
    if (!linkUrl) {
      return;
    }
    let newLinkUrl = this.setWorkplaceLink(linkUrl);
    if (linkUrl === newLinkUrl) return linkUrl;
    
    let linkUrlArray = newLinkUrl.split('/');
    linkUrlArray[linkUrlArray.length - 2] = 'thread';
    linkUrlArray[linkUrlArray.length - 3] = 'messages';
    return linkUrlArray.join('/');
  }
  
  mobileAndTabletcheck() {
    var check = false;
    // eslint-disable-next-line
    (function (a) {
      // eslint-disable-next-line
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }
  
  getPicturePathResized(picture, type, size) {
    let url = this.getPicturePath(picture, type);
    url = this.resizePicture(url, size);
    return url;
  }
  
  getPicturePath(picture, type) {
    if (picture && picture.emoji) return this.getEmojiUrl(picture.emoji);
    else if (picture && picture.url) return picture.url;
    else if (picture && picture.uri) return picture.uri;
    else return null;
  }
  
  resizePicture(pictureUrl, size) {
    if (!pictureUrl || !size) return pictureUrl;
    let urlSplited = pictureUrl.split('/resize/');
    if (urlSplited.length === 2) {
      urlSplited[1] = '/' + size + '/';
      return urlSplited.join('/resize');
    } else {
      return pictureUrl;
    }
  }
  
  getRandomEmoji() {
    let arrayOfEmoji = ['📓', '📔', '📒', '📕', '📗', '📘', '📙'];
    let randomIndex = Math.floor(Math.random() * Math.floor(arrayOfEmoji.length - 1));
    return this.getEmojiUrl(arrayOfEmoji[randomIndex]);
  }
  
  getEmojiUrl(emoji) {
    try{
      let str = twemoji.parse(emoji);
      str = str.split(/ /g);
      str = str[4].split(/"/g);
      return str[1];
    }catch(e) {
      console.log(e);
      return null;
    }

  }
  
  makeHightlighted = function (item) {
    if (!item) return;
    let filters = commonStore.getSearchFilters() || commonStore.searchFilters;
    if (filters && filters.length > 0 && item.hashtags && item.hashtags.length > 0) {
      item.hashtags.forEach((hashtag, index) => {
        if (hashtag.tag && filters.find(filterValue => filterValue.tag.toLowerCase() === hashtag.tag.toLowerCase())) item.hashtags[index].class = 'highlighted';
      });
    }
  };

  getWingDisplayedName = function (wing, locale) {
    return (wing.name_translated ? (wing.name_translated[locale] || wing.name_translated['en-UK']) || wing.name || wing.tag : wing.name || wing.tag || wing.value);
  }
  
  orderHashtags = function (item) {
    if (!item || !item.hashtags) return;
    var highlighted = [];
    var notHighlighted = [];
    item.hashtags.forEach(function (hashtag) {
      if (hashtag.class === 'highlighted') highlighted.push(hashtag);
      else notHighlighted.push(hashtag);
    });
    item.hashtags = highlighted.concat(notHighlighted);
  };
  
  htmlDecode = function (input) {
    if(!input) return '';
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
}

export default new ProfileService();
