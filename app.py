import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker 
from sqlalchemy import create_engine, inspect
# from sqlalchemy_utils import get_tables, database_exists
from flask import Flask, jsonify, render_template, url_for
from flask_sqlalchemy import SQLAlchemy



app = Flask(__name__)


#################################################
# Database Setup
#################################################
DB_URL = "postgresql://postgres:chumwater@localhost/baltimore_cctv_db"
# app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:chumwater@localhost/baltimore_cctv_db"
# db = SQLAlchemy(app)

engine = create_engine(DB_URL)
conn = engine.connect()

# engine = create_engine("postgresql://postgres:chumwater@localhost/baltimore_cctv_db")
# inspector = inspect(engine)


# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# census_data= Base.classes.bpd_cctv_census

# base = declarative_base()
# Session = sessionmaker(db)
# session = Session()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/viz_map")
def viz_map():
    return render_template("visualizations_heatmap.html")

@app.route("/cmap")
def cameras():
    df = pd.read_csv("db/camera_data.csv")
    return df.to_json(orient='records')

@app.route("/hmap")
def homicides():
    df = pd.read_csv("db/balt_homicides.csv")
    return df.to_json(orient='records')

@app.route("/smap")
def shootings():
    df = pd.read_csv("db/balt_shootings.csv")
    return df.to_json(orient='records')

@app.route("/pmap")
def person ():
    df = pd.read_csv("db/balt_person.csv")
    return df.to_json(orient='records')

@app.route("/propmap")
def prop ():
    df = pd.read_csv("db/balt_property.csv")
    return df.to_json(orient='records')

@app.route("/lmap")
def larceny ():
    df = pd.read_csv("db/balt_larceny.csv")
    return df.to_json(orient='records')


@app.route("/viz_tree")
def viz_tree():
    return render_template("visualizations_tree.html")

@app.route("/tree")
def crimes():
    df = pd.read_csv("db/crimes_by_neighborhood_csv")
    return df.to_json(orient='records')


@app.route("/viz_bubble")
def viz_bubble():
    return render_template("visualizations_bubble.html")

@app.route("/bubble")
def census():
    df = pd.read_csv("db/bpd_cctv_census.csv")
    return df.to_json(orient='records')

# @app.route("/bubble")
# # create function to call in db and jsonify the data
# def census():
#     df = pd.read_sql("SELECT * FROM bpd_cctv_census", conn)
#     output_json = df.to_json(orient='records')
#     return output_json


@app.route("/conclusion")
def conclusion():
    return render_template("conclusion.html")


@app.route("/data_list")
def data_list():
    return render_template("data_list.html")

if __name__ == "__main__":
    app.run()
