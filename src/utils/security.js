/**
 * Created by lenovo on 2020/7/30.
 */
import CryptoJS from 'crypto-js/crypto-js'

export default {
  //加密
  encrypt(word, keyStr){
    keyStr = keyStr ? keyStr : 'abcdef0123456789';
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
  },


  //解密
  decrypt(word, keyStr){
    keyStr = keyStr ? keyStr : 'abcdef0123456789';
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }

}
