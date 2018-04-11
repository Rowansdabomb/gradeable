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
    paper = functions.transformPage(image.copy())
    
    qrxstart = int(PAGE_WIDTH/4)
    qrxend = int(3*PAGE_WIDTH/4)
    qrystart = int(2*PAGE_HEIGHT/3)
    qryend = int(PAGE_HEIGHT)

    qrImage = image[qrystart:qryend, qrxstart:qrxend]
    # cv2.imshow('qr: ', qrImage)
    # cv2.waitKey(0)
    qrGray = cv2.cvtColor(qrImage, cv2.COLOR_BGR2GRAY)
    qrThresh = cv2.threshold(qrGray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

    qr = functions.getQR(qrImage, qrThresh, PAGE_WIDTH)
    # cv2.imshow('qr: ', qr)
    # cv2.waitKey(0)
    qrH, qrW = qr.shape[:2]
    qrtext = functions.decodeQR(qr)
    # print(qrtext)

    #[0] testid, [1] test number, [2] page number, [3] number of questions on page
    qrArray = qrtext.split(',')
    print(qrArray)
    tests = user['tests']
    if(len(qrArray) <= 2):
      qcystart = int(PAGE_HEIGHT/8)
      qcyend = int(6*PAGE_HEIGHT/8)
      qcxstart = int(PAGE_WIDTH/10)
      qcxend = int(9*PAGE_WIDTH/10)
      nameROI = [paper[0][ qcystart:qcyend, qcxstart:qcxend], paper[1][ qcystart:qcyend, qcxstart:qcxend]]
      name = getName(nameROI, 10, 16, PAGE_WIDTH)
      functions.writeImage(name[0], temp_dir + 'page' + str(i) + '.png')
      smallerImage = cv2.resize(name[0], None, fx=.5, fy=.5, interpolation=cv2.INTER_LINEAR)
      functions.writeImage(smallerImage, temp_dir + 'graded_' + str(i) + '.png')
      temp = open(temp_dir + 'graded_' + str(i) + '.png', 'rb')
      png64 = temp.read()
      png64 = base64.b64encode(png64)
      gradedId = fs.put(png64)
      
      # when we get a name, we add it to testTakers
      # tests = user['tests']
      for (i, test) in enumerate(tests):
        if test['testId'] == qrArray[0]:
          testTakers.append({'name': name[1] + name[2], 'testId': qrArray[0], 'testNumber': qrArray[1], 'imageIds': []})
      for (i, image) in enumerate(gradedImages):
        if image['testId'] == qrArray[0]:
          name = name[1] + name[2]
          studentNames.append({'testId': qrArray[0], 'studentName': name})

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
          flag = False
          for image in gradedImages:
            if image['testId'] == qrArray[0] and image['pageNumber'] == qrArray[2]:
              flag = True
          if not(flag) :
            gradedImages.append({'imageId': gradedId, 'testId':qrArray[0], 'testTitle': testTitle, 'grade': grade[1], 'pageNumber': qrArray[2], 'testNumber':qrArray[1]})
        else:
          if(i == len(tests)):
            print('test not found')
  else:
    print('Error: cannot find file GridFs')

# for testTaker in testTakers:
#   for image in gradedImages:
#     if testTaker['testId'] == image['testId'] and testTaker['testNumber'] == image['testNumber']:
#       testTaker['imageIds'].append(image)

for tester in studentNames:
  for image in gradedImages:
    if tester['testId'] == image['testId']:
      image['studentName'] = tester['studentName']

# print(testTakers)

db.users.update_one(
  {'_id': ObjectId(userId)}, 
    {
      "$set": {
        'gradedImages': gradedImages,
      }
    }
)

# for testTaker in testTakers:
#   db.users.update_one(
#     {'_id': ObjectId(userId), 'tests.testId': testTaker['testId']},
#     {
#       "$push": {
#         'tests.$.testTakers': testTakers,
#       }
#     }
#   )



