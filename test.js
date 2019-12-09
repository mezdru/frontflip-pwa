var qs = require('qs');

var e = "https://wingzy.com/fr/ccc";

var e1 = "hashtags.tag=#A&name=B&hashtags.tag=#C&onboarded[gte]=2019-10-10T10:00:00:000Z";

console.log(qs.parse(e1));