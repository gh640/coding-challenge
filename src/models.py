# coding: utf-8

'''データモデルを提供する
'''

from pathlib import Path

from peewee import SqliteDatabase
from peewee import Model
# from peewee import PrimaryKeyField, DateField, BooleanField
from peewee import CharField, IntegerField, FloatField


DATABASE_PATH = str((Path(__file__).parent.parent / '.db.sqlite') .absolute())


db = SqliteDatabase(DATABASE_PATH)


class Location(Model):
    # フィールド
    # プライマリーキーは自動的に作られるので定義不要
    title = CharField()
    year = IntegerField()
    locations = CharField(null=True)
    geo_lng = FloatField(null=True)
    geo_lat = FloatField(null=True)
    raw = CharField(null=True)

    # エリアを絞るための定数
    LNG_MIN = -122.5
    LNG_MAX = -122.0
    LAT_MIN = 37
    LAT_MAX = 38

    class Meta:
        database = db
        # primary_key = False

    @classmethod
    def selectbase(cls):
        return cls.select(cls.title,
                          cls.year,
                          cls.locations,
                          cls.geo_lng,
                          cls.geo_lat) \
                  .where(cls.geo_lng.is_null(False)) \
                  .where(cls.geo_lat.is_null(False)) \
                  .where(cls.geo_lng.between(cls.LNG_MIN, cls.LNG_MAX)) \
                  .where(cls.geo_lat.between(cls.LAT_MIN, cls.LAT_MAX))

    def as_dict(self):
        '''Location オブジェクトを辞書に変換する

        ただし raw は通常使われないので除外する
        '''
        exceptions = ['raw']
        return {key: value
                for key, value in self.__dict__['_data'].items()
                if key not in exceptions}
