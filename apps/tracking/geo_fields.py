"""
Database-agnostic GeoDjango compatible spatial fields.
Uses native PostGIS geometry columns in PostgreSQL, and seamlessly stores WKT
with instant GEOSGeometry / Polygon / Point deserialization in SQLite dev mode.
"""

from django.contrib.gis.geos import GEOSGeometry, Point, Polygon
from django.db import models


class CompatiblePolygonField(models.Field):
    description = "A GeoDjango-compatible Polygon field supporting PostGIS and SQLite"

    def __init__(self, *args, srid=4326, **kwargs):
        self.srid = srid
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        if self.srid != 4326:
            kwargs["srid"] = self.srid
        return name, path, args, kwargs

    def db_type(self, connection):
        if hasattr(connection.ops, "geo_db_type"):
            return "geometry(Polygon,4326)"
        return "text"

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        if isinstance(value, Polygon):
            return value
        try:
            geom = GEOSGeometry(value, srid=self.srid)
            return geom
        except Exception:
            return value

    def to_python(self, value):
        if value is None:
            return value
        if isinstance(value, Polygon):
            return value
        try:
            return GEOSGeometry(value, srid=self.srid)
        except Exception:
            return value

    def get_prep_value(self, value):
        if value is None:
            return value
        if isinstance(value, (Polygon, GEOSGeometry)):
            return value.wkt
        return str(value)


class CompatiblePointField(models.Field):
    description = "A GeoDjango-compatible Point field supporting PostGIS and SQLite"

    def __init__(self, *args, srid=4326, **kwargs):
        self.srid = srid
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        if self.srid != 4326:
            kwargs["srid"] = self.srid
        return name, path, args, kwargs

    def db_type(self, connection):
        if hasattr(connection.ops, "geo_db_type"):
            return "geometry(Point,4326)"
        return "text"

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        if isinstance(value, Point):
            return value
        try:
            geom = GEOSGeometry(value, srid=self.srid)
            return geom
        except Exception:
            return value

    def to_python(self, value):
        if value is None:
            return value
        if isinstance(value, Point):
            return value
        try:
            return GEOSGeometry(value, srid=self.srid)
        except Exception:
            return value

    def get_prep_value(self, value):
        if value is None:
            return value
        if isinstance(value, (Point, GEOSGeometry)):
            return value.wkt
        return str(value)
