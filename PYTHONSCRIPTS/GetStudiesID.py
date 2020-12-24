import pyorthanc 
import csv
import os
import os.path as ospath
import pydicom
import sys
import httplib2
import os.path

import socket


orthanc = pyorthanc.Orthanc('http://localhost:8042')
orthanc.setup_credentials('admin','admin')

# This list is to create a relation between existing ids
# and anonymized in order to avoid duplicates
list_patients = []
list_studies = []
list_patients_a = []
list_studies_a = []
dict_patients = {}


def anonimize_data():
    '''
    Anonymization of the studies that have not been anonymized
    '''
    temp_list = []
    patients = orthanc.get_patients()
    for id_p in patients:
        info = orthanc.get_patient_information(id_p)
        if 'AnonymizedFrom' in info:
            ident = info['AnonymizedFrom']
            temp_list.append(ident)
            if ident not in list_patients_a:
                list_patients_a.append(ident)

    for data in patients:
        patient_info = orthanc.get_patient_information(data)
        if 'AnonymizedFrom' not in patient_info:
            print('Vamos a comenzar anonimizacion')
            temp_id = patient_info['ID']
            if temp_id not in temp_list:
                anonymize = orthanc.anonymize_patient(temp_id)
                if temp_id not in list_patients:
                    list_patients_a.append(temp_id)
    
    return True
            
def get_studies_id():
    '''
    This method allows to get only the identificators of the studies
    getting the original and anonymized studies without the names
    @return list of the studies
    '''
    list_studies = []
    studies_ids = orthanc.get_studies()
    for studies in studies_ids:
        list_studies.append(studies)
    return(list_studies)

def get_studies_id_name():
    '''
    This method allows to get only the identificators of the studies
    getting the original and anonymized studies including the names
    @return list in format
    '''
    list_studies_names = []
    studies_ids = orthanc.get_studies()
    for studies in studies_ids:
        Study_patient = studies + ',' +orthanc.get_study_information(studies)['PatientMainDicomTags']['PatientName']
        list_studies_names.append(Study_patient)
    return(list_studies_names)

def generate_csv_ids():
    studies = get_studies_id()
    csvfile = open('ids.csv','w+') 
    
    for data in studies:
        csvfile.write(data)
        csvfile.write('\n')

    csvfile.close()

def generate_cvs_id_names():
    studies = get_studies_id_name()
    csvfile = open('idsnames.csv','w+') 
    
    for data in studies:
        csvfile.write(data)
        csvfile.write('\n')

    csvfile.close()

def generate_url_osimis():
    hostname = socket.gethostname()
    IP = socket.gethostbyname(hostname)
    
    base_url = 'http://' + IP +':8042/osimis-viewer/app/index.html?study='
    csvfile = open('URL_ids_all.csv','w+')
    
    studies = get_studies_id()

    for data in studies:
        final_url = base_url+data
        final = final_url
        csvfile.write(final)
        csvfile.write('\n')
    
    csvfile.close()

def generate_url():
    hostname = socket.gethostname()
    IP = socket.gethostbyname(hostname)
    
    base_url = 'http://' + IP +':8042/osimis-viewer/app/index.html?study='
    csvfile = open('URL_ids.csv','w+')
    csvfile.write('PatientName,StudyID,URL')
    csvfile.write('\n')
    
    for data in dict_patients:
        
        name = orthanc.get_patient_information(data)['MainDicomTags']['PatientName']
        patient_a = dict_patients[data]
        patient_info = orthanc.get_patient_information(patient_a)
        studies_a = patient_info['Studies']
        text = ''+name+','+patient_a
        for study in studies_a:
            text = text+','+base_url+study
            csvfile.write(text)
            csvfile.write('\n')
            print(text)

    csvfile.close()
    return True

def generate_pacient_studies_csv():
    update_lists()
    cvsfile = open('pacient_study.csv','w+')
   
    pacient_id = orthanc.get_patients()
    for id in pacient_id:
        pacient_information = orthanc.get_patient_information(id)

        print(pacient_information)

def update_lists():
    patients = orthanc.get_patients()
    for id_p in patients:
        info = orthanc.get_patient_information(id_p)
        if 'AnonymizedFrom' in info:
            ident = info['ID']
            if ident not in list_patients_a:
                list_patients_a.append(id_p)
        else:
            if id_p not in list_patients:
                list_patients.append(id_p)

def cross_reference():
    update_lists()
    list_p = []
    list_a = []
    for ide in list_patients_a:
        temp_var = orthanc.get_patient_information(ide)['AnonymizedFrom']
        list_a.append(ide)
        list_p.append(temp_var)
    dict_p = dict(zip(list_p,list_a))
    dict_patients.update(dict_p)

def relation_patients():
    file = open('pacient_relation.csv','wb')
    w = csv.DictWriter(file,dict_patients.items())
    w.writerows(dict_patients)
    file.close()    

def WriteDictToCSV():
    csv_file = 'pacients.csv'
    dict_data = dict_patients
    csv_columns = {'Patients','Anonymized'}

    with open(csv_file, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        for data in dict_data:
            writer.writerow(data)

def UploadFile(path_file):
    
    ext = os.path.splitext(path_file)[-1].lower()
    if ext == ".dcm" or ext =="":
        with open(path_file, 'rb') as file_handler:
            orthanc.post_instances(file_handler.read())
        return True
    else:
        return False

def UploadFolder(path_folder):
    for root, dirs, files in os.walk(path_folder):
        for f in files:
            route = os.path.join(root, f)
            ext = os.path.splitext(route)[-1].lower()
            if ext == ".dcm" or ext =="":
                with open(route, 'rb') as file_handler:
                    try:
                        r = orthanc.post_instances(file_handler.read())
                    except r as identifier:
                        pass
    
def ReadPatientsCSV():
    dict_fin = {}
    file = open("patients.csv",'r')

    dict_test = csv.reader(file)    
    
    for data in dict_test:
        dict_fin[data[0]] = data[1]
        list_patients = data[0]
        list_patients_a = data[1]

    file.close()
    print(dict_fin)
    
def WritePatientsCSV():
    file = open('patients.csv','w')
    file.write('PatientID,AnonymousID')
    file.write('\n')

    for key in dict_patients:
        
        temp_t = [key,dict_patients[key]]
        temp = ','.join(temp_t)
        file.write(temp)
        file.write('\n')

    file.close()

def get_anonymous_studies():
    for data in list_patients_a:
        print(data)
        studies = orthanc.get_patient_studies_information(data)
        for study in studies:
            study_id = study['ID']
            print(study_id)


    
    




