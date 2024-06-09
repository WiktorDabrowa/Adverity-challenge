from .exceptions import EnrichementError
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from .utils import prepare_file_data, get_data, clean_row
from typing import NamedTuple


class RequestData(NamedTuple):
    endpoint: str
    local_key: str
    foreign_key: str
    new_file_name: str

class EnrichmentValidator:

    def __init__(self, file, request_data):
        self.file = file
        self.data = request_data

    def validate_data(self):
        self._validate_url(self.data.endpoint)
        self._validate_key(self.data.local_key, self.file)
        self._validate_name(self.data.new_file_name)

    @staticmethod
    def _validate_url(url):
        validator = URLValidator()
        try:
            validator(url)
        except ValidationError:
            raise ValidationError('Specified enpoint URL is invalid!', code=400)

    @staticmethod
    def _validate_key(local_key, file):
        file_data = prepare_file_data(file)
        if local_key not in file_data['titles']:
            raise ValidationError("The key you specified is not in the specified file!")
    
    @staticmethod
    def _validate_name(name):
        if '/' in name:
            raise ValidationError("File name cannot contain '/', please select another name", code=400)
        
    
class FileEnricher:

    def __init__(self, file, request):
        self.file = file
        self.request = request
        self.data = RequestData(
            endpoint=request.data['endpoint'],
            local_key=request.data['localKey'],
            foreign_key=request.data['foreignKey'],
            new_file_name=request.data['newFileName']
        )
        EnrichmentValidator(
            file=file,
            request_data=self.data
        ).validate_data()

    def enrich_file(self):
        current_file_content = prepare_file_data(self.file)
        external_resource = get_data(self.data.endpoint)
        self._validate_foreign_key_in_resource(external_resource, self.data.foreign_key)
        new_file = self._merge_data(current_file_content, external_resource)
        return new_file
        
    
    @staticmethod
    def _validate_foreign_key_in_resource(data: list[dict], foreign_key):
        if foreign_key not in data[0].keys():
            raise EnrichementError('Resource you have provided does not have the specified key!')
    
    def _get_new_column_titles(self, current_file_content, external_resource):
        foreign_titles = list(external_resource[0].keys())
        foreign_titles.remove(self.data.foreign_key)
        return foreign_titles

    def _enrich_data_rows(self, current_file_content, external_resource, new_column_titles):
        key_index = current_file_content['titles'].index(self.data.local_key)
        new_rows = []
        for row in current_file_content['rows']:
            match_found = False
            for ext_row in external_resource:
                if str(row[key_index]) == str(ext_row[self.data.foreign_key]):
                    match_found = True
                    row = row + [clean_row(ext_row[key]) for key in new_column_titles]
                    break
            if not match_found:
                row = row + ['null' for _ in new_column_titles]
            new_rows.append(row)
        return new_rows

    def _merge_data(self, current_file_content, external_resource):
        new_column_titles = self._get_new_column_titles(current_file_content, external_resource)
        enriched_rows = self._enrich_data_rows(current_file_content, external_resource, new_column_titles)
        return {
            'name': self.data.new_file_name,
            'titles': current_file_content['titles'] + new_column_titles,
            'rows': enriched_rows
        }