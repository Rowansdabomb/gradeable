from pymongo import MongoClient
from bson.objectid import ObjectId
import gridfs
import numpy as np
import functions
import cv2
import os
import sys
import json
import base64
from name import getName

PAGE_WIDTH = 794
PAGE_HEIGHT = 1123

curr_dir = os.path.dirname(os.path.realpath(__file__))
temp_dir = curr_dir.replace('\\', '/') + '/tempImages/'

userId = sys.argv[1]
client = MongoClient('mongodb://localhost:27017')
db = client.hundop
fs = gridfs.GridFS(db)

users = db.users
user = users.find_one({'_id': ObjectId(userId)})
gradedImages = user['gradedImages']
studentNames = []
testTakers = []

for i, imgObj in enumerate(user['tempImages']):
  imageId = ObjectId(imgObj['imageId'])
  if(fs.exists(imageId)):
    grid_file = fs.get(imageId).read()
    image_dir = temp_dir + str(i) + '.png'
    output= open(image_dir,"wb") 
    output.write(grid_file)
    output.close
    image = cv2.imread(image_dir)

    # normalize image sizes
    pageH, pageW = image.shape[:2]
    # print(pageH, pageW)
    newPageWRatio = PAGE_WIDTH/pageW
    newPageHRation = PAGE_HEIGHT/pageH
    image = cv2.resize(image, None, fx=newPageWRatio, fy=newPageHRation, interpolation=cv2.INTER_LINEAR)
    pageH, pageW = image.shape[:2]
    print(pageH, pageW)
    paper = functions.transformPage(image.copy())
    
    qrxstart = int(2*PAGE_WIDTH/5)
    qrxend = int(3*PAGE_WIDTH/5)
    qrystart = int(3*PAGE_HEIGHT/4)
    qryend = int(PAGE_HEIGHT)

    qrImage = paper[0][qrystart:qryend, qrxstart:qrxend]

    qrGray = cv2.cvtColor(qrImage, cv2.COLOR_BGR2GRAY)
    # qrThresh = cv2.threshold(qrGray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    # qrThresh = cv2.threshold(qrGray, 0, 255, 43, cv2.THRESH_BINARY_INV)[1]
    qrThresh = cv2.adaptiveThreshold(qrGray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 20)
    largeQr = cv2.resize(qrThresh.copy(), None, fx=2.5, fy=2.5, interpolation=cv2.INTER_LINEAR)
    cv2.imshow('qr: ', largeQr)
    cv2.waitKey(0)

    qr = functions.getQR(qrImage, qrThresh, PAGE_WIDTH)
    cv2.imshow('qr: ', qr)
    cv2.waitKey(0)
    qrH, qrW = qr.shape[:2]
    qrtext = functions.decodeQR(qr)
    # print(qrtext)

    #qrarray: [0] testid, [1] test number, [2] page number, [3] number of questions on page
    qrArray = qrtext.split(',')
    print(qrArray)
    tests = user['tests']
    if(len(qrArray) <= 2):
      y = int(PAGE_HEIGHT/5)
      h = int(3*PAGE_HEIGHT/5)
      x = int(PAGE_WIDTH/10)
      w = int(4*PAGE_WIDTH/5)
      nameROI = [paper[0][ y:y+h, x:x+w], paper[1][ y:y+h, x:x+w]]
      # cv2.imshow('w/e', nameROI[0])
      # cv2.waitKey(0)
      name = getName(nameROI, 10, 16, PAGE_WIDTH)
      functions.writeImage(name[0], temp_dir + 'page' + str(i) + '.png')
      smallerImage = cv2.resize(name[0], None, fx=.5, fy=.5, interpolation=cv2.INTER_LINEAR)
      functions.writeImage(smallerImage, temp_dir + 'graded_' + str(i) + '.png')
      temp = open(temp_dir + 'graded_' + str(i) + '.png', 'rb')
      png64 = temp.read()
      png64 = base64.b64encode(png64)
      gradedId = fs.put(png64)
      # when we get a name, we add it to testTakers
      # qrarray: [0] testid, [1] test number, [2] page number, [3] number of questions on page
      for (i, test) in enumerate(tests):
        if test['testId'] == qrArray[0]:
          studentName = name[1].replace(' ', '') + ' ' + name[2].replace(' ', '')
          testTakers.append({'studentName': studentName, 'testId': qrArray[0], 'testNumber': qrArray[1], 'imageIds': []})
      for (i, image) in enumerate(gradedImages):
        if image['testId'] == qrArray[0]:
          studentName = name[1] + name[2]
          studentNames.append({'testId': qrArray[0], 'studentName': studentName})

    elif(len(qrArray) > 2):
      # tests = user['tests']
      answerkey = []
      for (i, test) in enumerate(tests):
        # grapefruit, change back to ==
        if test['testId'] == qrArray[0]:
          # print('test found')
          testTitle = test['testTitle']
          temp = test['testState']
          temp = json.loads(temp)
          selectedAnswers = temp['selectedAnswer']
          pageEnd = temp['pageEnds'][int(qrArray[2])]
          pageStart = temp['pageStarts'][int(qrArray[2])]

          numberOfAnswers = temp['bubbleValues'][pageStart: pageEnd]
          selectedAnswers = selectedAnswers[pageStart: pageEnd]
          for i in range(len(selectedAnswers)):
            answerkey.append([selectedAnswers[i], len(numberOfAnswers[i])])
          qcystart = int(PAGE_HEIGHT/9)
          qcyend = int(8*PAGE_HEIGHT/9)
          qcxstart = int(PAGE_WIDTH/10)
          qcxend = int(2*PAGE_WIDTH/10)

          questionROI = paper[1][ qcystart:qcyend, qcxstart:qcxend]
          # cv2.imshow('qroi', questionROI)
          # cv2.waitKey(0)
          cnts = functions.getQuestions(questionROI, qcxstart, qcystart, PAGE_HEIGHT, PAGE_WIDTH)
          grade = functions.gradePage(paper[0].copy(), paper[1].copy(), cnts, answerkey)
          if(grade == -1):
            print('incorrect test')
            break
          temp = image.copy()
          cv2.drawContours(image, cnts, -1, (255, 0, 0), 10)
          functions.writeImage(grade[0], temp_dir + 'page' + str(i) + '.png')
          smallerImage = cv2.resize(grade[0], None, fx=.5, fy=.5, interpolation=cv2.INTER_LINEAR)
          functions.writeImage(smallerImage, temp_dir + 'graded_' + str(i) + '.png')
          temp = open(temp_dir + 'graded_' + str(i) + '.png', 'rb')
          png64 = temp.read()
          png64 = base64.b64encode(png64)
          gradedId = fs.put(png64)
          imageInGradedImages = False
          for image in gradedImages:
            if(image['testId'] == qrArray[0] and image['pageNumber'] == qrArray[2]) and image['testNumber'] == qrArray[1]:
              imageInGradedImages = True
              # print('found: ', qrArray[0], qrArray[2])
          if not(imageInGradedImages) :
            gradedImages.append({'imageId': gradedId, 'testId':qrArray[0], 'testTitle': testTitle, 'grade': grade[1], 'pageNumber': qrArray[2], 'testNumber':qrArray[1]})
            # print(gradedImages)
        else:
          if(i == len(tests)):
            print('test not found')
  else:
    print('Error: cannot find file GridFs')

for tester in testTakers:
  for image in gradedImages:
    if tester['testId'] == image['testId'] and tester['testNumber'] == image['testNumber']:
      image['studentName'] = tester['studentName']

print('studentNames: ', studentNames)
print()
print('testTakers: ', testTakers)

db.users.update(
  {'_id': ObjectId(userId)}, 
  {"$set": { 'gradedImages': gradedImages}},
)
print('done')



