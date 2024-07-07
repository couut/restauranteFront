from app.database import get_db

class Reserva:
    def __init__(self, id_reserva=None, nombre=None,telefono=None ,email=None , comensales=None, menu=None ,fecha=None,horario=None):
        self.id_reserva = id_reserva
        self.nombre = nombre
        self.telefono = telefono
        self.email = email
        self.comensales = comensales
        self.menu = menu
        self.fecha = fecha
        self.horario = horario
    @staticmethod
    def get_all():
        db=get_db()
        cursor=db.cursor()
        cursor.execute('SELECT * FROM reservas') #el nombre de la tabla es reservas
        filas = cursor.fetchall()
        reservas =[Reserva(id_reserva= fila[0], fecha=fila[6], horario=fila[7], nombre=fila[1], comensales=fila[4], telefono=fila[2], email=fila[3], menu=fila[5]) for fila in filas]
        cursor.close()
        return reservas
    @staticmethod
    def get_by_id(id_reserva):
        db=get_db()
        cursor=db.cursor()
        cursor.execute('SELECT * FROM reservas WHERE id_reserva = %s', (id_reserva,))
        fila = cursor.fetchone()
        reserva = Reserva(id_reserva= fila[0], fecha=fila[6], horario=fila[7], nombre=fila[1], comensales=fila[4], telefono=fila[2], email=fila[3], menu=fila[5])
        cursor.close()
        return reserva
    
    def add(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""INSERT INTO reservas (nombre, telefono, email, comensales, menu, fecha, horario) VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (self.nombre, self.telefono, self.email, self.comensales, self.menu, self.fecha, self.horario))
        self.id_reserva = cursor.lastrowid
        db.commit()
        cursor.close()

    def update(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""UPDATE reservas SET nombre = %s, telefono = %s, email = %s, comensales = %s, menu = %s, fecha = %s, horario = %s WHERE id_reserva = %s""",
         (self.nombre, self.telefono, self.email, self.comensales, self.menu, self.fecha, self.horario, self.id_reserva))
        db.commit()
        cursor.close()

    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute('DELETE FROM reservas WHERE id_reserva = %s', (self.id_reserva))
        db.commit()
        cursor.close()

    def serialize(self):
        return {
            'id_reserva': self.id_reserva,
            'nombre': self.nombre,
            'telefono': self.telefono,
            'email': self.email,
            'comensales': self.comensales,
            'menu': self.menu,
            'fecha': self.fecha,
            'horario': self.horario
        }
    @staticmethod
    def verificar_horario(fecha,horario):
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM reservas WHERE fecha = %s AND horario = %s', (fecha, horario))
        reserva = cursor.fetchone()
        cursor.close()
        return reserva is None
