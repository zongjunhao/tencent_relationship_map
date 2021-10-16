import json

from ResultCodeEnum import ResultCodeEnum


class BaseResponse:
    data: object = None
    result_code: str = None
    result_desc: str = None

    # def __init__(self, data, result_code, result_desc):
    #     self.data = data
    #     self.result_code = result_code
    #     self.result_desc = result_desc

    def set_result(self, result_code_enum: ResultCodeEnum):
        self.result_code = result_code_enum.code
        self.result_desc = result_code_enum.desc

    def to_string(self):
        return json.dumps(self.__dict__)
