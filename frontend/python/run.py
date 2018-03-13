from multiimage import multiImage
from name import getName
from pymongo import MongoClient
# from getqrcode import getQRCode
from getroi import getROI
import numpy as np
import functions
import cv2
import time
import sys

userId = sys.argv[1]
client = MongoClient('mongodb://localhost:27017/')
db = client.hundop
print(db)
start = time.clock()
print('run.py started')

image = cv2.imread('GradeA-1.png')
pageH, pageW = image.shape[:2]

paper = functions.transformPage(image.copy())

qrxstart = int(pageW/2-200)
qrxend = int(pageW/2+200)
qrystart = pageH - 400
qryend = pageH

qrImage = image[qrystart:qryend, qrxstart:qrxend]
qrGray = cv2.cvtColor(qrImage, cv2.COLOR_BGR2GRAY)
qrThresh = cv2.threshold(qrGray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

qr = functions.getQR(qrImage, qrThresh, pageW)
qrtext = functions.decodeQR(qr)
print(qrtext)

answerkey = functions.getAnswerKey()
qcystart = int(pageH/9)
qcyend = int(8*pageH/9)
qcxstart = int(pageW/10)
qcxend = int(2*pageW/10)

questionROI = paper[1][ qcystart:qcyend, qcxstart:qcxend]
cv2.imshow('roi', questionROI)
cnts = functions.getQuestions(questionROI, qcxstart, qcystart)

grade = functions.gradePage(paper[0].copy(), paper[1].copy(), cnts, answerkey)
print('grade:' + str(grade[1]))
print(time.clock() - start)
temp = image.copy()
cv2.drawContours(image, cnts, -1, (255, 0, 0), 10)

cv2.imshow('questions', cv2.resize(image, None, fx=.3, fy=.3, interpolation=cv2.INTER_LINEAR))
cv2.imshow('transform', cv2.resize(paper[0], None, fx=.3, fy=.3, interpolation=cv2.INTER_LINEAR))
cv2.imshow('graded', cv2.resize(grade[0], None, fx=.3, fy=.3, interpolation=cv2.INTER_LINEAR))
cv2.imshow('qr', qr)
cv2.waitKey(0)