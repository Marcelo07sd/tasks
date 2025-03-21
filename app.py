from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clientes.db'
db = SQLAlchemy(app)
# Definir el modelo
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200))
    done = db.Column(db.Boolean)

# Crear la tabla en la base de datos
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    tasks = Task.query.all()
    
    return render_template('index.html', tasks=tasks)

@app.route('/create-task', methods=['POST'])
def create():
    data = request.get_json()
    task = Task(content=data['content'], done=False)
    db.session.add(task)
    db.session.commit()
    return jsonify({'id': task.id, 'content': task.content})

@app.route('/done/<int:id>')
def done(id):
    task = db.session.get(Task, id)
    if task:
        task.done = not task.done
        db.session.commit()
    print(task.done)
    return jsonify({ 'done': task.done})

@app.route('/edit/<int:id>', methods=['POST', 'GET'])
def edit(id):
    task = db.session.get(Task, id)
    if request.method == 'POST' and task:
        data = request.get_json()
        task.content = data['content_edit']
        db.session.commit()
        return jsonify({'id':str(id), 'content':task.content, 'result':'exito'})
    
    return jsonify({'id':str(id), 'content':task.content, 'result':'exito'})

@app.route('/delete/<int:id>')
def delete(id):
    task = db.session.get(Task, id)
    if task:
        db.session.delete(task)
        db.session.commit()
    return jsonify({ 'id': str(id)})


        
