# coding: utf-8

'''フロントコントローラを提供する
'''

from math import ceil
import os

from flask import json
from flask import Flask
from flask import request
from flask import send_from_directory
from flask import render_template

# from json_loader import load_locations
# from json_loader import prepare_locations
from models import Location


# ページ毎のロケ地表示する
LOCATION_ITEMS_PER_PAGE = 20


app = Flask(__name__)
app.config['GOOGLE_API_KEY'] = os.environ['GOOGLE_API_KEY']
app.config['ROOT'] = (app.config['APPLICATION_ROOT']
                      if app.config['APPLICATION_ROOT'] else '')


@app.route('/static/<path:path>')
def send_js(path):
    return send_from_directory('static', path)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/location')
def location():
    req_title = request.args.get('title', None)
    try:
        req_page = int(request.args.get('page', 1))
    except ValueError as e:
        req_page = 1

    query = Location.selectbase()

    if req_title:
        query = query.where(Location.title ** '%{}%'.format(req_title))

    total_items = query.count()
    total_pages = ceil(total_items / LOCATION_ITEMS_PER_PAGE)

    current_page = req_page if req_page <= total_pages else total_pages

    query = query.paginate(current_page, LOCATION_ITEMS_PER_PAGE)

    locations = [l.as_dict() for l in query]

    return json.jsonify({
        'meta': {
            'pager_data': {
                'totalItems':  total_items,
                'totalPages':  total_pages,
                'currentPage':  current_page,
            },
        },
        'entities': {
            'locations': locations,
        },
    })


@app.route('/movie')
def movie():
    req_title = request.args.get('title', None)

    query = Location.select(Location.title).distinct()

    if req_title:
        query = query.where(Location.title ** '%{}%'.format(req_title))

    movies = [{'id': index, 'title': l.title} for index, l in enumerate(query)]

    return json.jsonify(movies)
