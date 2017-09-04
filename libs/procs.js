exports.hashCode = function(s) {
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

exports.removeAccent = function(s) {
   if (typeof s === "undefined") {
      return;
   }
   var i = 0, uni1, arr1;
   var newclean = s;
   uni1 = 'à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ|A';
   arr1 = uni1.split('|');
   for (i = 0; i < uni1.length; i++)
       newclean = newclean.replace(uni1[i], 'a');
   uni1 = 'è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ|E';
   arr1 = uni1.split('|');
   for (i = 0; i < uni1.length; i++)
       newclean = newclean.replace(uni1[i], 'e');
   uni1 = 'ì|í|ị|ỉ|ĩ|Ì|Í|Ị|Ỉ|Ĩ|I';
   arr1 = uni1.split('|');
   for (i = 0; i < uni1.length; i++)
       newclean = newclean.replace(uni1[i], 'i');
   uni1 = 'ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ|O';
   arr1 = uni1.split('|');
   for (i = 0; i < uni1.length; i++)
       newclean = newclean.replace(uni1[i], 'o');
   uni1 = 'ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ|U';
   arr1 = uni1.split('|');
   for (i = 0; i < uni1.length; i++)
       newclean = newclean.replace(uni1[i], 'u');
   uni1 = 'ỳ|ý|ỵ|ỷ|ỹ|Ỳ|Ý|Ỵ|Ỷ|Ỹ|Y';
   arr1 = uni1.split('|');
   for (i = 0; i < uni1.length; i++)
       newclean = newclean.replace(uni1[i], 'y');
   uni1 = 'd|Đ|D';
   arr1 = uni1.split('|');
   for (i = 0; i < uni1.length; i++)
       newclean = newclean.replace(uni1[i], 'd');
   newclean = newclean.toLowerCase();
   ret = newclean.replace(/[\&]/g, '-').replace(/[^a-zA-Z0-9.-\/]/g, '-').replace(/[-]+/g, '-').replace(/-$/, '');
   return ret;
}
