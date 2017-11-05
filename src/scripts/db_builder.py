# coding: utf-8

'''
'''

# JSON から 1 件ずつ取得する
# DB に入れる
# DB から 1 件ずつ取得する
# DB の住所をもとに Google から緯度経度を取得する
# DB に入れる

from datetime import datetime

from concurrent.futures import ThreadPoolExecutor, as_completed

from models import db, Location
from json_loader import load_locations, prepare_locations
from .location_data_fetcher import fetch_one


def create_tables():
    '''テーブルを作成する
    '''
    db.connect()
    db.create_tables([Location])
    db.close()


def delete_tables():
    '''テーブルを削除する
    '''
    db.connect()
    db.drop_tables([Location])
    db.close()


def insert_json_data():
    '''JSON データを location テーブルに全件挿入する
    '''
    locations = prepare_locations(load_locations())

    for l in locations:
        location = {
          'title': l['title'],
          'year': int(l['year']),
          'locations': l['locations'],
        }
        # print(location)
        Location.create(**location)


def fetch_and_update_lnglat_all(max_workers=10, skip_existing=False):
    '''Location テーブル内にあるデータの緯度経度情報を更新する
    '''
    locations_all = Location.select(Location.id)

    if skip_existing:
        locations_all = filter(lambda l: l.geo_lng, locations_all)

    # 直列に実行すると遅いので並列で実行する
    results = []
    with ThreadPoolExecutor(max_workers) as executor:
        func = fetch_and_update_lnglat_for_id
        futures = (executor.submit(func, l.id) for l in locations_all)

        # as_completed は future の iter を受け取って、終了しているものから順に yield する
        # https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.as_completed
        for t in as_completed(futures):
            data = t.result()
            results.append(data)


def fetch_and_update_lnglat_for_id(id_, suffix=', San Francisco'):
    '''Google Maps API を使って Location の緯度経度情報を 1 件更新する
    '''
    locations = Location.select().where(Location.id == id_).limit(1)
    for l in locations:
        if not l.locations:
            continue

        data = fetch_one(l.locations + suffix)
        if not data:
            continue

        l.geo_lng = data['geo_lng']
        l.geo_lat = data['geo_lat']
        l.save()
        print('Location {id_} is updated.'.format(id_=id_))
