from configparser import ConfigParser

def config_db(filename='/mnt/c/Users/Phillip/Desktop/personal projects/recommendations_system/recommendations_system/controller/backend/database.ini', section='postgresql'):
    parser = ConfigParser()
    parser.read(filename)

    db = {}

    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception(f"Section {section} not found in the {filename} file")

    return db

def config_api(filename='/mnt/c/Users/Phillip/Desktop/personal projects/recommendations_system/recommendations_system/controller/backend/rapidapi.ini', section='rapidapi'):
    parser = ConfigParser()
    parser.read(filename)

    key = ""

    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            key = param[1]
    else:
        raise Exception(f"Section {section} not found in the {filename} file")

    return key