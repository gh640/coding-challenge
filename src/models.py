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
    # プライマリーキーは自動的に作られるので定義不要
    title = CharField()
    year = IntegerField()
    locations = CharField(null=True)
    geo_lng = FloatField(null=True)
    geo_lat = FloatField(null=True)
    raw = CharField(null=True)

    class Meta:
        database = db
        # primary_key = False
