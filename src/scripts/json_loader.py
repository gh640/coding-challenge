# coding: utf-8

'''JSON からロケーション情報を抽出する
'''

from pathlib import Path

from flask import json


JSON_PATH = '../rows.json'


def load_locations() -> dict:
    '''ロケーションの生データを取得する
    '''
    movie_file = Path(JSON_PATH)
    locations_raw = json.load(movie_file.open())['data']

    return locations_raw


def prepare_locations(locations_raw: list) -> list:
    '''ロケーション地一覧の生データから必要な部分のみを抽出する
    '''
    return [{
      'title': m[8],
      'locations': m[10],
      'year': m[9],
    } for m in locations_raw]
