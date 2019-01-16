export const USERS = {
  login: '/users/login',
  register: '/users/register',
  code: '/users/code',
  reset_password: '/users/reset_password', // post {account, password, code, timestamp}
  update: '/users/update', // post {sex, name, face, status, latitude, longitude, badge_id, badges}
  user: '/users/user',
  notification: '/users/show_notification',
  connect_by_random: '/users/connect_by_random',
  connect_by_id: '/users/connect_by_id', // get, {code}
  disconnect: '/users/disconnect',
  invitation_code: '/users/invitation_code',
  update_rate: '/users/update_rate',
  add_last_times: '/users/add_last_times',
  close_connection: '/users/close_connection',
  delete_notification: '/users/delete_notification', // get {message_id}
  feedback: '/users/feedback', // post {title, content, type}
  oauth_login: '/users/oauth_login', // post {code, type}
  bind_account: '/users/bind_account', // post {account, openid}
  check_token: '/users/check_token',  // get {uid, token, timestamp}
  calculate_emotion: '/users/calculate_emotion',  // post {content}
  update_vip: '/users/update_vip', //get {expires}
  enroll_activity: '/users/enroll_activity',
  update_activity: '/users/update_activity',
  get_activity: '/users/get_activity',
}

export const NOTES = {
  list: '/notes/list', // get
  publish: '/notes/publish', // post {title，content，images，latitude，longitude}
  like: '/notes/like', // post {note_id}
  delete: '/notes/delete', // get {note_id}
  update: '/notes/update', // post {note_id, title, content, images, mode}
  sync: '/notes/sync', // get {synctime}
  refresh_total_notes: '/notes/refresh_total_notes', // get
  add_comment: '/notes/add_comment', // post { note_id, user_id, content, owner_id }
  show_comment: '/notes/show_comment', // get { note_id, owner_id }
  delete_comment: '/notes/delete_comment', //
}

export const MODES = {
  show: '/modes/show', // get
}

export const UTILS = {
  qiniu_token: '/utils/qiniu_token', // get {filename}
  get_ocr_sign: '/utils/get_ocr_sign',
  get_nlp_result: '/utils/get_nlp_result', // post {content}
  update_emotion_report: '/utils/update_emotion_report', // get
  show_act: '/utils/show_act', // get
  check_version: '/utils/check_version', // get {is_wxapp, version}
}
