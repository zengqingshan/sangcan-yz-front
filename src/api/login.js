import request from '@/utils/request';
import { encrypt } from '@/utils/jsencrypt';

// 登录方法
export function login(username, password, code, uuid) {
  const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwxC0VAfhsbNHbUia+d3g7PxIOFPIw1crKnLE9rix28r5ogGzD0toS11bFq+ZUKHSJHX6fsXUmwBBxSCV6czdJr1CFllNf72VMBHGk11uKl9IbsCuR1BGoWQThi9UDomxTgbNvs6VypTkFifp23VZ6kniyt72iJk2X10yz4XIU9wIDAQAB'
  username = encrypt(username,pubKey);
  password = encrypt(password,pubKey);
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/jxict-project-sso/doLogin',
    method: 'post',
    data: data
  })
}

// 短信验证码
export function getSmsCode(data) {
  return request({
    url: '/jxict-project-sso/getSmsCode',
    method: 'post',
    data: data
  })
}

// 短信登录
export function smslogin(data) {
  return request({
    url: '/jxict-project-sso/doSmsLogin',
    method: 'post',
    data: data
  })
}

// 注册
export function register(phone, password, smscode) {
	  const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwxC0VAfhsbNHbUia+d3g7PxIOFPIw1crKnLE9rix28r5ogGzD0toS11bFq+ZUKHSJHX6fsXUmwBBxSCV6czdJr1CFllNf72VMBHGk11uKl9IbsCuR1BGoWQThi9UDomxTgbNvs6VypTkFifp23VZ6kniyt72iJk2X10yz4XIU9wIDAQAB'
  phone = encrypt(phone,pubKey);
  password = encrypt(password,pubKey);
  smscode = encrypt(smscode,pubKey);
  const data = {
    phone,
    password,
    smscode
  }
  return request({
    url: '/jxict-project-sso/register',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo(search) {
  return request({
    url: `/jxict-project-sso/getInfo${search}`,
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/jxict-project-sso/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/jxict-project-sso/captchaImage',
    method: 'get'
  })
}
