from app.models import *
from flask import request, jsonify

def crear_reserva():
    data = request.get_json()
    if not Reserva.verificar_horario(data['fecha'], data['horario']):
        return jsonify({'mensaje': 'El horario no está disponible'}), 400
    if isinstance(data, list):  # Verifica si los datos son una lista
        for dato in data:
            # Asegúrate de que cada elemento en la lista es un diccionario
            reserva = Reserva(nombre=dato['nombre'], telefono=dato['telefono'], email=dato['email'], comensales=dato['comensales'], menu=dato['menu'], fecha=dato['fecha'], horario=dato['horario'])
            reserva.add()
        return jsonify({'mensaje': 'Reservas creadas exitosamente'}), 201
    else:
        reserva = Reserva(id_reserva=None, nombre=data['nombre'], telefono=data['telefono'], email=data['email'], comensales=data['comensales'], menu=data['menu'], fecha=data['fecha'], horario=data['horario'])
        reserva.add()
        return jsonify({'mensaje': 'Reserva creada exitosamente'}), 201

def get_all_reserva():
    reservas = Reserva.get_all()
    return jsonify([reserva.serialize() for reserva in reservas]) 

def get_reserva_by_id(id_reserva):
    reserva = Reserva.get_by_id(id_reserva)
    if not reserva:
        return jsonify({'mensaje': 'No existe reserva asociada'}), 404
    return jsonify(reserva.serialize())

def delete_reserva(id_reserva):
    reserva = Reserva.get_by_id(id_reserva)
    if not reserva:
        return jsonify({'mensaje': 'No existe reserva asociada'}), 404
    reserva.delete()
    return jsonify({'mensaje': 'Reserva eliminada exitosamente'})

def update_reserva(id_reserva):
    data = request.get_json()
    reserva = Reserva.get_by_id(id_reserva)
    if not reserva:
        return jsonify({'mensaje': 'No existe reserva asociada'}), 404
    Reserva(
        reserva.nombre = data['nombre'],
        reserva.telefono = data['telefono'],
        reserva.email = data['email'],
        reserva.comensales = data['comensales'],
        reserva.menu = data['menu'],
        reserva.fecha = data['fecha'],
        reserva.horario = data['horario'],
    )
    reserva.update()
    return jsonify({'mensaje': 'Reserva actualizada exitosamente'})

