from pydantic import BaseModel

# Modelo de datos para las películas pendientes
class UserRatingMovie(BaseModel):
    user_id: int
    movie_id: str
    rating: float