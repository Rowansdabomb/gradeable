# import the necessary packages
from imutils.perspective import four_point_transform
from imutils import contours
import numpy as np
import argparse
import imutils
import cv2

# construct the argument parse and parse the arguments
# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True,
	help="path to the input image")
args = vars(ap.parse_args())

f = open("answerkey.txt", "r")
temp = []
for line in f:
  temp.extend(list(line.strip()))
print(temp)
ANSWER_KEY = {}
for i in range(0, len(temp), 4):
  ANSWER_KEY[int(i/4)] = (int(temp[i+2]), int(temp[i+3]))
print(ANSWER_KEY)
# load the image, convert it to grayscale, blur it
# slightly, then find edges
image = cv2.imread(args["image"])
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)
edged = cv2.Canny(blurred, 75, 200)

# find contours in the edge map, then initialize
# the contour that corresponds to the document
cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE)
cnts = cnts[0] if imutils.is_cv2() else cnts[1]
docCnt = None
paperEdge = False
contourCounts = 0
countourSizeThreshold = 3
# ensure that at least one contour was found
if len(cnts) > 0:
    print('contours found')
    # sort the contours according to their size in
    # descending order
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)
 
    # loop over the sorted contours
    for c in cnts:
        # approximate the contour
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        contourCounts = contourCounts + 1
        # if our approximated contour has four points
        # and is one of largest by area,
        # then we can assume we have found the paper
        if len(approx) == 4 and contourCounts < countourSizeThreshold:
          print('page edge found')
          paperEdge = True
          docCnt = approx
          break
        elif (contourCounts >= countourSizeThreshold):
          print('page edge NOT found')
          break

# apply a four point perspective transform to both the
# original image and grayscale image to obtain a top-down
# birds eye view of the paper
if(paperEdge):
  paper = four_point_transform(image, docCnt.reshape(4, 2))
  warped = four_point_transform(gray, docCnt.reshape(4, 2))
  # apply Otsu's thresholding method to binarize the warped
  # piece of paper
  thresh = cv2.threshold(warped, 0, 255,
      cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

else:
  paper = image
  thresh = cv2.threshold(gray, 0, 255,
      cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

cv2.imshow("thresh", thresh)
# find contours in the thresholded image, then initialize
# the list of contours that correspond to questions
cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE)
cnts = cnts[0] if imutils.is_cv2() else cnts[1]
questionCnts = []

qSize = 20
aspect = .05
# loop over the contours
for c in cnts:
    # compute the bounding box of the contour, then use the
    # bounding box to derive the aspect ratio
    (x, y, w, h) = cv2.boundingRect(c)
    ar = w / float(h)

    # in order to label the contour as a question, region
    # should be sufficiently wide, sufficiently tall, and
    # have an aspect ratio approximately equal to 1
    if w >= qSize and h >= qSize and ar >= 1-aspect and ar <= 1+aspect:
        questionCnts.append(c)

# sort the question contours top-to-bottom, then initialize
# the total number of correct answers
questionCnts = contours.sort_contours(questionCnts,
    method="top-to-bottom")[0]
correct = 0
# create a list of correct answer values
correctAnswers = []
for item in ANSWER_KEY:
  correctAnswers.append(ANSWER_KEY[item][0])
print(correctAnswers)

# each question has n possible answers, to loop over the
# question in batches of n
qptr = 0
bigcount = 0
for n in range(len(ANSWER_KEY)):
  for (q, i) in enumerate(np.arange(0, ANSWER_KEY[n][1], ANSWER_KEY[n][1])):
      # sort the contours for the current question from
      # top-to-bottom, then initialize the index of the
      # bubbled answer
      cnts = questionCnts[qptr:qptr + ANSWER_KEY[n][1]]
      qptr = qptr + ANSWER_KEY[n][1]
      
      bubbled = None
      # loop over the sorted contours
      for (j, c) in enumerate(cnts):
          # construct a mask that reveals only the current
          # "bubble" for the question
          mask = np.zeros(thresh.shape, dtype="uint8")
          cv2.drawContours(mask, [c], -1, 255, -1)
          # apply the mask to the thresholded image, then
          # count the number of non-zero pixels in the
          # bubble area
          mask = cv2.bitwise_and(thresh, thresh, mask=mask)
          
          total = cv2.countNonZero(mask)

          # if the current total has a larger number of total
          # non-zero pixels, then we are examining the currently
          # bubbled-in answer
          if bubbled is None or total > bubbled[0]:
              bubbled = (total, j)
      
      # initialize the contour color and the index of the
      # *correct* answer
      color = (0, 0, 255)
      k = correctAnswers[bigcount]
      bigcount = bigcount + 1

      # check to see if the bubbled answer is correct
      if k == bubbled[1]:
          color = (0, 255, 0)
          correct += 1

      # draw the outline of the correct answer on the test

      cv2.drawContours(paper, [cnts[k]], -1, color, 2)

# grab the test taker
score = (correct / len(ANSWER_KEY)) * 100
print('# of questions = ' + str(len(questionCnts)))
print("[INFO] score: {:.2f}%".format(score))
cv2.putText(paper, "{:.2f}%".format(score), (10, 30),
    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
cv2.imshow("Exam", paper)
cv2.waitKey(0)