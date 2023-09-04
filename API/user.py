from typing import Optional
from pydantic import BaseModel

# Clase que representa la tabla USER de la base de datos
class User(BaseModel):
    user_id: int
    user_name: str
    email: str
    password: str
    gravatar_id: Optional[str] = None