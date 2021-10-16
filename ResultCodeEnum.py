from enum import Enum


class ResultCodeEnum(Enum):
    UNKNOWN_ERROR = ("1001", "Unknown error, please try again.")
    SUCCESS = ("1002", "return data successfully")
    FAILURE = ("1003", "return data fail, place try again")

    def __init__(self, code: str, desc: str):
        self.code = code
        self.desc = desc
