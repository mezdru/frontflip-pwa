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
    if(tag.charAt(0) === '#') {
      return 'hashtag';
    }else if (tag.charAt(0) === '@') {
      return 'person';
    }else {
      return null;
    }
  }

  getDefaultPictureByType(type) {
    if(type === 'hashtag') return defaultHashtagPicture;
    else if(type === 'person') return defaultPicture;
    else return null;
  }

  transformLinks(item) {
    if(!item) return;
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
    if (!link.url) {
      switch (link.type) {
        case 'email':
          link.url = 'mailto:' + link.value;
          break;
        case 'phone':
          link.url = 'tel:' + link.value;
          break;
        case 'home':
          link.url = 'tel:' + link.value;
          break;
        case 'address':
          link.url = 'http://maps.google.com/?q=' + encodeURIComponent(link.value);
          break;
        default:
          link.url = link.value;
          break;
      }
    }
  }

  getPicturePath(picture) {
    if (picture && picture.path) return null;
    else if (picture && picture.emoji) return this.getEmojiUrl(picture.emoji);
    else if (picture && picture.url) return picture.url;
    else if (picture && picture.uri) return picture.uri;
    else return null;
  }

  getEmojiUrl(emoji) {
    let str = twemoji.parse(emoji);
    str = str.split(/ /g);
    str = str[4].split(/"/g);
    return str[1];
  }

  makeHightlighted = function (item) {
    if(!item) return;
    let filters = commonStore.getSearchFilters() || commonStore.searchFilters;
    if (filters && filters.length > 0 && item.hashtags && item.hashtags.length > 0) {
      item.hashtags.forEach((hashtag, index) => {
        if (hashtag.tag && filters.find(filterValue => filterValue.value.toLowerCase() === hashtag.tag.toLowerCase())) item.hashtags[index].class = 'highlighted';
      });
    }
  };

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
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
}

export default new ProfileService();