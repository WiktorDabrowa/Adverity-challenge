import csv
import requests
from .models import File
from .exceptions import EnrichementError
from django.core.files.storage import default_storage 
from io import StringIO

def prepare_file_data(file: File):
    file_path = default_storage.open(file.url).name
    with open(file_path, 'r') as csv_file:
        reader = csv.reader(csv_file)
        rows = [line for line in reader]
        return {
            'name': file.name,
            'titles': rows[0],
            'rows': rows[1:]
        }


def get_data(url):
    response = requests.get(url)
    try:
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError:
        raise EnrichementError('Failed to fetch specified resource. Please double check the endpoint!')
    

def create_new_file(file_name, owner, file):
    local_file_path = f'{owner.username}_{file_name}'.replace(' ', '_')
    if not local_file_path.endswith('.csv'):
        local_file_path += '.csv'
    file_path = default_storage.save(local_file_path, file)
    file_instance = File(
            name=file_name,
            url=file_path,
            owner=owner
    )
    file_instance.save()


def create_new_csv_file(content):
    f = StringIO()
    csv.writer(f).writerows([content['titles'], *content['rows']])
    return f


def clean_row(row):
    row = str(row)
    return row.replace('\n', ' ').replace('\r', ' ').replace(',','.')