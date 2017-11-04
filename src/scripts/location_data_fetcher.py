# coding: utf-8

'''指定された場所の緯度経度情報を取得する
'''

import json
import os

import requests


GOOGLE_API_KEY = os.environ['GOOGLE_API_KEY']
GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'


def fetch_one(address):
    params = {
      'address': address,
      'key': GOOGLE_API_KEY,
    }
    result = requests.get(GOOGLE_GEOCODE_URL, params=params)

    raw = result.content
    data = json.loads(raw)

    if not data['results']:
        return None

    location = data['results'][0]['geometry']['location']
    geo_lng = location['lng']
    geo_lat = location['lat']

    return {
        'raw': raw,
        'geo_lng': geo_lng,
        'geo_lat': geo_lat,
    }
