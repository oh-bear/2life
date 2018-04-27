export const USERS = {
  login: '/users/login',
  register: '/users/register',
  code: '/users/code',
  update: '/users/update',
  user: '/users/user',
  notification: '/users/show_notification'
}

export const NOTES = {
  list: '/notes/list', //get
  publish: '/notes/publish', //post {title，content，images，latitude，longitude}
}

export const UTILS = {
  qiniu_token: '/utils/qiniu_token', //get {filename}
}
