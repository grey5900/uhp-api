/**
 * Created by isaac on 15/10/28.
 */

var uploadPath = __dirname + '/../ocr';
uploadPath = '/var/ftp/pub';
module.exports = {
  code: {
    success: 1000
  },
  // db: 'mongodb://lxm:123@192.168.199.135:27017/uhp-sds',
  db: 'mongodb://localhost/uhp-sds',
  uploadPath: uploadPath,
  meta: {
    installed: 'uhs.installed'
  }
};
