# import the necessary packages
from imutils.perspective import four_point_transform
from imutils import contours
import numpy as np
import imutils
import cv2
import sys
def get_contour_precedence(contour, cols):
    origin = cv2.boundingRect(contour)
    return origin[1] * cols + origin[0]

def quickSort(array, i):
    less = []
    equal = []
    greater = []
    # print('len of array: ' + str(len(array)))
    if len(array) > 1:
        pivot = array[0][i]
        for x in array:
            # print(x[2])
            if x[i] < pivot:
                less.append(x)
            if x[i] == pivot:
                equal.append(x)
            if x[i] > pivot:
                greater.append(x)
        # Don't forget to return something!
        return quickSort(less, i)+equal+quickSort(greater, i)  # Just use the + operator to join lists
    # Note that you want equal ^^^^^ not pivot
    else:  # You need to hande the part at the end of the recursion - when you only have one element in your array, just return the array.
        return array

def getName(img, firstnamesize, lastnamesize, pageW):

    alpha = 'abcdefghijklmnopqrstuvwxyz '
    nameSize = firstnamesize+lastnamesize
    firstName = []
    lastName = []
    image = img[0]
    qSize = 5
    aspect = .2
    name = image.copy()
    thresh = img[1]
    # find contours in the thresholded image, then initialize
    # the list of contours that correspond to questions
    # cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
    #     cv2.CHAIN_APPROX_SIMPLE)
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_NONE)
    cnts = cnts[0] if imutils.is_cv2() else cnts[1]
    questionCnts = []

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
            questionCnts.append((c, x, y))

    # sort the question contours top-to-bottom, then initialize
    # the total number of correct answers
    nameCnts = []
    firstSort = quickSort(questionCnts, 2)
    for n in range(nameSize):
      column = firstSort[n*nameSize: n*nameSize+nameSize]
      temp = questionCnts[n*nameSize: n*nameSize+nameSize]
      sortedColumn = quickSort(column, 1)
      for x in sortedColumn:
        # print(x[1], x[2])
        nameCnts.append(x[0])
    # questionCnts = contours.sort_contours(questionCnts,
    #     method="top-to-bottom")[0]
    allbubbles = image.copy()
    cv2.drawContours(allbubbles, nameCnts, -1, (0, 255, 0), 2)
    # cv2.imshow('allbubbles', allbubbles)
    # cv2.waitKey(0)
    # there are firstnamesize columns for firstname, and lastnamesize columns for last name
    for n in range(nameSize):
        # sort the contours for the current question from
        # top-to-bottom, then initialize the index of the
        # bubbled answer
        qcnts = []
        for k in range(26):
            # qcnts.append(questionCnts[k*26 + firstnamesize+lastnamesize-1-n])
            qcnts.append(nameCnts[k*26 + firstnamesize+lastnamesize-1-n])
            columnbubbles = image.copy()
            cv2.drawContours(columnbubbles, qcnts, -1, (0, 255, 0), 2)
        bubbled = [10000, 0, 0]
        # loop over the sorted contours
        abs = 10000
        total = 0
        for (j, c) in enumerate(qcnts):
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
            if total < bubbled[0]:
                bubbled[0] = total
            if bubbled is None or total > bubbled[1]:
                bubbled[1] = total
                bubbled[2] = j

        # initialize the contour color and the index of the
        # *correct* answer
        color = (0, 0, 255)

        if(n < lastnamesize):
            # print((bubbled[1] - bubbled[0])/bubbled[0])
            # print(bubbled[0], bubbled[1])
            if((bubbled[1] - bubbled[0])/bubbled[0] < .2):
                lastName.append(alpha[26])
                # qcnts[bubbled[2]] = []
            else:
                lastName.append(alpha[bubbled[2]])
        elif(n < firstnamesize + lastnamesize):
            if((bubbled[1] - bubbled[0])/bubbled[0] < .2):
                firstName.append(alpha[26])
                # qcnts[bubbled[2]] = []
            else:
                firstName.append(alpha[bubbled[2]])

        # draw the outline of the correct answer on the test
        cv2.drawContours(name, qcnts[bubbled[2]], -1, color, 2)
        # cv2.imshow('name', name)
        # cv2.waitKey(0)
    # cv2.imshow("Exam", name)
    # cv2.waitKey(0)
    return (name, ''.join(firstName[::-1]), ''.join(lastName[::-1]))


