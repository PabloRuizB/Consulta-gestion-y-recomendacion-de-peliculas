import os
import mysql.connector
import pickle
from surprise import Dataset, Reader, NMF, accuracy
from surprise.model_selection import train_test_split

# Conexion a la base de datos
cnx = mysql.connector.connect(
    host="localhost",
    user="root",
    password="winged7%AP",
    database="tfg"
)
cursor = cnx.cursor()

#Variables que gestionan el algoritmo de entrenamiento entre metodos
algorithm_file: str = 'recomendador.pkl'
algorithm: any

# Metodo que entrena el modelo en base a los ratings que haya en la base de datos
def train_model():
    # Consulta a la base de datos para obtener los datos necesarios
    query = "SELECT user_id, movie_id, rating FROM rating"
    cursor.execute(query)
    data = cursor.fetchall()

    # Procesamiento de datos
    processed_data = [(row[0], row[1], row[2]) for row in data]

    # Crear objeto Reader y Dataset
    reader = Reader(rating_scale=(1, 5))
    dataset = Dataset.load_from_df(processed_data, reader)

    # División de los datos en entrenamiento y prueba
    trainset, testset = train_test_split(dataset, test_size=0.1)

    # Crear una instancia del modelo
    algorithm = NMF(n_factors=15, n_epochs=20)

    # Entrenar el modelo
    algorithm.fit(trainset)

    # Generar predicciones
    predictions = algorithm.test(testset)

    # Medir la precisión del modelo
    accuracy.rmse(predictions)

    # Cerrar la conexión a la base de datos
    cursor.close()
    cnx.close()
    save_model()

#Metodo que devuelve un array de recomendaciones a un usuario
def recomend_to_user(user_id: int):

    if (check_if_model_exists() == False):
        train_model()
        
    query = "SELECT m.id FROM movie AS m LEFT JOIN rating AS r ON r.movie_id=m.id WHERE r.user_id != {user_id}"
    cursor.execute(query)
    data = cursor.fetchall()

    # Generar recomendaciones para el nuevo usuario
    unseen_movies = [(row[0], row[1], row[2]) for row in data]
    new_user_predictions = [algorithm.predict(user_id, movie_id) for movie_id in unseen_movies]

    # Ordenar las predicciones en función de las valoraciones más altas
    sorted_predictions = sorted(new_user_predictions, key=lambda x: x.est, reverse=True)

    # Mostrar las películas recomendadas al nuevo usuario
    recommended_movies = [prediction.iid for prediction in sorted_predictions[:50]]

    return recommended_movies

def getColdInitMovies():
    # Peliculas con caracteristicas mas discriminativas
    return ['tt0068646', 'tt0111161', 'tt0468569', 'tt0110912', 'tt0118799', 'tt0060196', 'tt0070047', 'tt0816692', 'tt0167261', 'tt0114369', 'tt0109830', 'tt2380307']

def retrain_model_for_user():
    # Crear un objeto Dataset con los nuevos datos
    # TODO
    # Obtener el trainset actual del modelo cargado
    # trainset = algorithm.trainset

    # # Agregar los nuevos datos al trainset existente
    # trainset_new = trainset.build_testset() + nuevos_datos.build_full_trainset().build_testset()

    # # Realizar el entrenamiento con los nuevos datos
    # algorithm.train(trainset_new)

    # # Guardar el modelo actualizado en un archivo
    # save_model()

    return

#Metodo que carga el modelo
def load_model():
    with open(algorithm_file, 'rb') as file:
        algorithm = pickle.load(file)

#Metodo que guarda el modelo
def save_model():
    with open(algorithm_file, 'wb') as file:
        pickle.dump(algorithm, file)

#Metodo que compueba si hay algun modelo guardado.
def check_if_model_exists() -> bool:
    return os.path.exists(algorithm_file)


def user_has_completed_cold_init(user_id: str):
    query = f"SELECT COUNT(*) FROM rating WHERE user_id='{user_id}'"
    cursor.execute(query)
    queryResult = cursor.fetchall()

    if queryResult >= 10:
        return True
    else:
        return False
