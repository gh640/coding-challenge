# coding: utf-8

'''データモデルを提供する
'''

from peewee import SqliteDatabase
from peewee import Model
# from peewee import PrimaryKeyField, DateField, BooleanField
from peewee import CharField, IntegerField, FloatField


DATABASE_PATH = '../.db.sqlite'


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
