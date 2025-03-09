from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta

# request
# redirect para direccionar a una página de nuevo

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task.db'
db = SQLAlchemy(app)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.String(200))
    done = db.Column(db.Boolean)
    fecha_creacion = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc) + timedelta(hours=-5))
    
    
#Crear la base de datos antes de ejecutar la aplicación
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    tasks = Task.query.all()
    dias_semana = {
        "Monday" : "Lunes", "Tuesday" : "Martes", "Wednesday" : "Miércoles",
        "Thursday" : "Jueves", "Friday" : "Viernes", "Saturday" : "Sábado", "Sunday" : "Domingo"
    }
    return render_template('index.html', tasks = tasks, dias_semana = dias_semana)

@app.route('/create-task', methods = ['POST'])
def create():
    task = Task(content=request.form['content'], done=False)
    db.session.add(task)
    db.session.commit()
    return redirect(url_for('home'))

@app.route('/edit/<int:id>', methods = ['GET', 'POST'])
def edit(id):
    task = db.session.get(Task, id)
    
    if request.method == 'POST':
        task.content = request.form['content-edit']
        db.session.commit()
        return redirect(url_for('home'))
    return render_template('edit.html', task = task)
    
@app.route('/done/<id>')
def done(id):
    task = Task.query.filter_by(id=int(id)).first()
    task.done = not(task.done)
    db.session.commit()
    return redirect(url_for('home'))

@app.route('/delete/<id>')
def delete(id):
    task = Task.query.filter_by(id=int(id)).delete()
    db.session.commit()
    return redirect(url_for('home'))
