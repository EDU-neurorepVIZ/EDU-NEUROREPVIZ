
import os
import tkinter
import tkinter.filedialog 
from tkinter.filedialog import askopenfilename
from tkinter.filedialog import askdirectory
from tkinter import *
import tkinter.messagebox as boxes
import sys
import os.path
import httplib2
import base64

import GetStudiesID as orthan

file_path_1 = ''
file_path_2 = ''



#~~~~ FUNCTIONS~~~~
def update():
      orthan.cross_reference()
      #orthan.WriteDictToCSV()
      
def open_file_path():
  global file_path_1
  filename1 = askopenfilename()
  file_path_1 = os.path.abspath(filename1)
  #print(file_path_1)
  #entry1.delete(0, END)
  entry1.insert(0, file_path_1)
  #entry1.selection_clear()
  
def upload_file():
  global file_path_1
  file_path_1 = os.path.abspath(file_path_1)
  #print(file_path_1)
  entry1.delete(0, END)
  entry1.insert(0, file_path_1)
  terminado = orthan.UploadFile(file_path_1)
  if terminado:
  #show = boxes.showinfo("Uploading", "Uploading Files")
    show = boxes.showinfo("Complete", "Upload completed")
  else:
        show = boxes.showerror('ERROR','The file must be a DICOM file.')

def open_folder_path():
  global file_path_2
  filename2 = askdirectory()
  file_path_2 = os.path.abspath(filename2)
  #print(file_path_2)
  #entry2.delete(0, END)
  entry2.insert(0, file_path_2)

def upload_folder():
  global file_path_2
  file_path_2 = os.path.abspath(file_path_2)
  #print(file_path_1)
  entry2.delete(0, END)
  entry2.insert(0, file_path_2)
  terminado = orthan.UploadFolder(file_path_2)
  if terminado:
  #show = boxes.showinfo("Uploading", "Uploading Files")
    show = boxes.showinfo("Complete", "Upload completed")

def generate():
      update()
      orthan.generate_csv_ids()
      orthan.generate_cvs_id_names()
      orthan.generate_url_osimis()
      done = orthan.generate_url()
      if done:
            message_box = boxes.showinfo('Completed','Document generated')

def anonimize():
      update()
      done = orthan.anonimize_data()
      if done:
            message_box = boxes.showinfo('Complete','Data base anonymized')

def empty():
      print('empty')

#~~~~~~ GUI ~~~~~~~~

root = Tk()
root.title('NeurorepVIZ Manager')
root.geometry("700x300+200+100")
root.aspect()
root.pack_propagate(0)

mf = Frame(root)
mf.pack()
f1 = Frame(mf, width=600, height=250)
f1.pack(fill=X)
f2 = Frame(mf, width=600, height=250)
f2.pack()
f3 = Frame(mf, width=600, height=250)
f3.pack()
f4 = Frame(mf, width=600, height=250)
f4.pack()
f5 = Frame(mf, width=600, height=250)
f5.pack()

##Instead of creating object of that class you have just assigned class to those variable
file_path_1 = StringVar()
file_path_2 = StringVar()

Label(f1,text="Upload File").grid(row=1, column=0, sticky='e')
entry1 = Entry(f1, width=60, textvariable=file_path_1)
entry1.grid(row=1,column=1,padx=3,pady=3,sticky='we',columnspan=15)
Button(f1, text="Browse File", command=open_file_path).grid(row=1, column=27, sticky='ew', padx=8, pady=4)
Button(f1, text="Upload", command=upload_file).grid(row=1, column=42, sticky='ew', padx=8, pady=4)

Label(f2,text="Upload Folder").grid(row=2, column=0, sticky='e')
entry2 = Entry(f2, width=60, textvariable=file_path_2)
entry2.grid(row=2,column=1,padx=3,pady=3,sticky='we',columnspan=15)
Button(f2, text="Browse Folder", command=open_folder_path).grid(row=2, column=27, sticky='ew', padx=8, pady=4)
Button(f2, text="Upload", command=upload_folder).grid(row=2, column=42, sticky='ew', padx=8, pady=4)

Label(f3,text='Generate Documents').grid(row=3, column=0, sticky='e')
Button(f3, text="Generate", command=generate).grid(row=3, column=10, sticky='ew', padx=8, pady=4)
Label(f3, text='Anonymize').grid(row=3, column=20, sticky='e')
Button(f3, text="Anonymize", command=anonimize).grid(row=3, column=30, sticky='ew', padx=8, pady=4)

Label(f4,text='').grid(row=4, column=0, sticky='e')
Button(f5, text='Quit', command=f3.quit).grid(row=5, column=0, sticky=W, pady=4)
root.mainloop()