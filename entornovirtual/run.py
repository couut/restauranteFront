from flask import Flask 
from flask_cors import CORS
from app.database import init_app
from app.views import *

app= Flask(__name__)
init_app(app)

CORS(app)

#Rutas para el CRUD
app.route('/api/reserva/', methods=['POST'])(crear_reserva)
app.route('/api/reserva/', methods=['GET'])(get_all_reserva)
app.route('/api/reserva/<int:id_reserva>', methods=['GET'])(get_reserva_by_id)
app.route('/api/reserva/<int:id_reserva>', methods=['DELETE'])(delete_reserva)
app.route('/api/reserva/<int:id_reserva>', methods=['PUT'])(update_reserva)

if __name__ == '__main__':
    app.run(debug=True)