from pydantic import BaseModel

# Modelo de datos para las películas pendientes
class UserGravatar(BaseModel):
    user_id: int
    gravatar_id: str