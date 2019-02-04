import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

from datetime import datetime
from functools import singledispatch
from datetime import datetime as dt
from flask import Flask, Markup
import datetime
import time
import json
import datetime as dt

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sqlalchemy import create_engine, func,desc
import collections


app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bk.db"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
Samples = Base.classes.link


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df["Item"] = df["Item"].str.strip()
    item_list = list(dict.fromkeys(df["Item"]))
    # Return a list of the item names
    return jsonify(item_list)

@app.route("/samples/<sample>")
def samples(sample):

    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    df["Item"] = df["Item"].str.strip()
    df["Date"] = df["Date"].str.strip()

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    df = df.loc[df["Item"] == sample, ["Transection", "Date", "id"]]
    df = df.groupby(['Date'])['Transection'].count().reset_index()

    # Format the data to send as json
    data = {
        "Transaction": df["Transection"].values.tolist(),
        "Date": df["Date"].values.tolist()
    }

    return jsonify(data)

@app.route("/mostpopular")
def mostpopular():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    df = df[["Item", "Transection"]]
    df["Item"] = df["Item"].str.strip()
    
    counts = df.groupby(["Item"])["Transection"].count().reset_index()
    counts.columns = ["Item", "Sales"]

    counts = counts.sort_values("Sales", ascending=False)
    counts = counts.nlargest(10, "Sales")

    item_list = {
        "Item": counts["Item"].values.tolist(),
        "Sales": counts["Sales"].values.tolist()
    }

    return jsonify(item_list)

@app.route("/topten")
def topten():
    return render_template("mostpopular.html")

@app.route("/sales_over_time")
def sales_time_series():
    return render_template("timeseries.html")   

@singledispatch
def to_serializable(val):
    """Used by default."""
    return str(val)
    
@to_serializable.register(datetime)
def ts_datetime(val):
    """Used if *val* is an instance of datetime."""
    return val.isoformat() + "Z"


@app.route('/login',methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
      user = request.form['nm']
      return redirect(url_for('success',name = user))
   else:
      user = request.args.get('nm')
      return redirect(url_for('success',name = user))


@app.route('/success/<name>')
def success(name):
    foo = session.query(func.count(Info.Transection),Info.Item).\
    group_by(Info.Item).order_by(Info.Item).all()
    data2= json.dumps([{"date": foo[x][1],"value": foo[x][0]}
        for x in range(len(foo))],default=to_serializable)
    data={'chart_data':data2}
    print(data)
    return render_template('in8.html',data=data)

if __name__ == "__main__":
    app.run(debug=True)



