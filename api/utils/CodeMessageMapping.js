const mapping = {
  ok: { code: 0, message: 'ok' },
  unauthorized: { code: 1, message: 'Unauthorized' },
  internal_error: { code: 2, message: 'Internal server error' },
  bad_request_username_password_wrong: {
    code: 3,
    message: 'Bad Request: username or password is wrong',
  },
  bad_request_username_password_mismatch: {
    code: 4,
    message: 'Bad Request: username or password is mismatch',
  },
  bad_request_user_not_found: { code: 5, message: 'Bad Request: User not found' },
  invalid_token: { code: 6, message: 'Invalid Token!' },
  authorization_format_error: { code: 7, message: 'Format for Authorization: Bearer [token]' },
  authorization_not_found: { code: 8, message: 'No Authorization was found' },
  authorization_privilege_not_sufficient: {
    code: 9,
    message: 'Authorization privilege not sufficient',
  },
  bad_request_notification_not_found: { code: 5, message: 'Bad Request: Notification not found' },
};

module.exports = mapping;
