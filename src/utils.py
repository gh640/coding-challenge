# coding: utf-8

'''その他ユーティリティ関数を提供する
'''


def location_to_dict(location):
    '''Location オブジェクトを辞書に変換する
    '''
    return {
      'id': location.id,
      'title': location.title,
      'year': location.year,
      'locations': location.locations,
      'geo_lng': location.geo_lng,
      'geo_lat': location.geo_lat,
    }
