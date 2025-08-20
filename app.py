from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tarefas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configure o CORS para permitir requisições de http://127.0.0.1:5000
CORS (app, resources={r'/tarefas/*': {'origins': 'http://127.0.0.1:5000'}})

class Tarefa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(200))
    concluida = db.Column(db.Boolean, default=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tarefas', methods=['GET'])
def get_tarefas():
    tarefas = Tarefa.query.all()
    return jsonify([{'id': t.id, 'titulo': t.titulo, 'descricao': t.descricao, 'concluida': t.concluida}for t in tarefas])

@app.route('/tarefas', methods=['POST'])
def create_tarefa():
    data = request.get_json()
    if not data or 'titulo' not in data:
        return jsonify({'error': 'Título é obrigatório'}), 400
    tarefa = Tarefa(titulo=data['titulo'], descricao=data.get('descricao'), concluida=data.get('concluida', False))
    db.session.add(tarefa)
    db.session.commit()
    return jsonify({'id': tarefa.id, 'titulo': tarefa.titulo, 'descricao': tarefa.descricao, 'concluida': tarefa.concluida}), 201

@app.route('/tarefas/<int:id>', methods=['GET'])
def get_tarefa(id):
    tarefa = Tarefa.query.get_or_404(id)
    return jsonify({'id': tarefa.id, 'titulo': tarefa.titulo, 'descricao': tarefa.descricao, 'concluida': tarefa.concluida})

@app.route('/tarefas/<int:id>', methods=['PUT'])
def update_tarefa(id):
    tarefa = Tarefa.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Dados de tarefa não fornecidos'}), 400
    tarefa.titulo = data.get('titulo', tarefa.titulo)
    tarefa.descricao = data.get('descricao', tarefa.descricao)
    tarefa.concluida = data.get('concluida', tarefa.concluida)
    db.session.commit()
    return jsonify({'id': tarefa.id, 'titulo': tarefa.titulo, 'descricao': tarefa.descricao, 'concluida': tarefa.concluida})

@app.route('/tarefas/<int:id>', methods=['DELETE'])
def delete_tarefa(id):
    tarefa = Tarefa.query.get_or_404(id)
    db.session.delete(tarefa)
    db.session.commit()
    return jsonify({'message': 'Tarefa deletada com sucesso'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)