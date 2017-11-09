# coding: utf-8

'''フロントコントローラを提供する
'''

from flask import json
from flask import Flask
from flask import request
from flask import send_from_directory

# from json_loader import load_locations
# from json_loader import prepare_locations
from models import Location
from utils import render, location_to_dict


app = Flask(__name__)


@app.route('/static/<path:path>')
def send_js(path):
    return send_from_directory('static', path)


@app.route('/')
def index():
    return render(app, 'index.html')


@app.route('/location')
def location():
    req_title = request.args.get('title', None)

    query = Location.selectbase()

    if req_title:
        query = query.where(Location.title ** '%{}%'.format(req_title))

    locations = [location_to_dict(l) for l in query]

    return json.jsonify(locations)


@app.route('/movie')
def movie():
    req_title = request.args.get('title', None)

    query = Location.select(Location.title).distinct()

    if req_title:
        query = query.where(Location.title ** '%{}%'.format(req_title))

    movies = [{'id': index, 'title': l.title} for index, l in enumerate(query)]

    return json.jsonify(movies)
