import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

  const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
  '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ=='

  const privateKey = 'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEA0vfvyTdGJkdbHkB8\n' +
  'mp0f3FE0GYP3AYPaJF7jUd1M0XxFSE2ceK3k2kw20YvQ09NJKk+OMjWQl9WitG9p\n' +
  'B6tSCQIDAQABAkA2SimBrWC2/wvauBuYqjCFwLvYiRYqZKThUS3MZlebXJiLB+Ue\n' +
  '/gUifAAKIg1avttUZsHBHrop4qfJCwAI0+YRAiEA+W3NK/RaXtnRqmoUUkb59zsZ\n' +
  'UBLpvZgQPfj1MhyHDz0CIQDYhsAhPJ3mgS64NbUZmGWuuNKp5coY2GIj/zYDMJp6\n' +
  'vQIgUueLFXv/eZ1ekgz2Oi67MNCk5jeTF2BurZqNLR3MSmUCIFT3Q6uHMtsB9Eha\n' +
  '4u7hS31tj1UWE+D+ADzp59MGnoftAiBeHT7gDMuqeJHPL4b+kC+gzV4FGTfhR9q3\n' +
  'tTbklZkD2A=='

 // const publicKey ='MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAINGoIjre-UiT41pGn-XE-xCcSwkO2fN6_eqBS4ivG3GM9NnjG5ecFwYE-uWLlsIV5hQGthmq1AKtQY_Lj_NZ08CAwEAAQ';
// const privateKey ='MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEAg0agiOt75SJPjWkaf5cT7EJxLCQ7Z83r96oFLiK8bcYz02eMbl5wXBgT65YuWwhXmFAa2GarUAq1Bj8uP81nTwIDAQABAkAJWS83cOWKxK27mT981IpjqbubdB0S4FQsd9wUk_6tJnUQQALqfzCNrwxe_bmxDlKQLGBh-0u0uo_DEvSjlRoRAiEAt_jQrjpEbDA03BSRWuYqyfJXJmOrEnVfHwK759vv-lcCIQC2rC3stjUqd0caU6Pc5zvP4kJtf1ZM4ZEstywvDEdPyQIgWgIiFxvq3gO32PU3KIHz7VnjyaR5zk4ee82aoZW5k4ECIBxpQSdM244ESTHGCnlkGYBmr3A6WuDQQHUU9DFJFppJAiBsOBLSMxFE3SMWnzwqkyx7wdAbKoPh75sQat014vlAmA\n';
// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}

