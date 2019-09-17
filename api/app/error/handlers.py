import traceback
from flask import current_app, jsonify
from werkzeug.exceptions import HTTPException
from werkzeug.http import HTTP_STATUS_CODES
from app.error import bp


def error_response(status_code, message=None):
    payload = {'error': HTTP_STATUS_CODES.get(status_code, 'Unknown error')}
    if message:
        payload['message'] = message
    response = jsonify(payload)
    response.status_code = status_code
    return response


def bad_request(message):
    return error_response(400, message)


@bp.app_errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    current_app.logger.error(traceback.format_exc())
    return error_response(code, str(e))
