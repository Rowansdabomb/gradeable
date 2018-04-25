# import the necessary packages
from imutils.perspective import four_point_transform
from imutils import contours
import numpy as np
import imutils
import cv2
import sys
# def get_contour_precedence(contour, cols):
#     origin = cv2.boundingRect(contour)
#     return origin[1] * cols + origin[0]

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
        return quickSort(less, i)+equal+quickSort(greater, i)      
        # Note that you want equal ^^^^^ not pivot
    else:  # You need to handle the part at the end of the recursion - when you only have one element in your array, just return the array.
        return array

def getName(img, firstnamesize, lastnamesize, pageW):

    alpha = 'abcdefghijklmnopqrstuvwxyz '
    nameSize = firstnamesize+lastnamesize
    columnSize = 27
    firstName = []
    lastName = []
    image = img[0]
    qSize = 5
    aspect = .2
    name = image.copy()
    thresh = img[1]
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_NONE)
    cnts = cnts[0] if imutils.is_cv2() else cnts[1]
    questionCnts = []

    # loop over the contours

    for c in cnts:
        (x, y, w, h) = cv2.boundingRect(c)
        ar = w / float(h)

        if w >= qSize and h >= qSize and ar >= 1-aspect and ar <= 1+aspect:
            questionCnts.append((c, x, y))

    # sort the question contours top-to-bottom, then initialize
    # the total number of correct answers
    nameCnts = []
    firstSort = quickSort(questionCnts, 1)
    for n in range(nameSize):
      column = firstSort[n*columnSize: n*columnSize+columnSize]
      sortedColumn = quickSort(column, 2)
      for x in sortedColumn:
        nameCnts.append(x[0])
      allbubbles = image.copy()
      cv2.drawContours(allbubbles, nameCnts, -1, (0, 255, 0), 2)
      cv2.imshow('allbubbles', allbubbles)
      cv2.waitKey(0)
      
    # there are firstnamesize columns for firstname, and lastnamesize columns for last name
    for n in range(nameSize):
        qcnts = []
        for k in range(columnSize):
            # qcnts.append(nameCnts[k*nameSize + nameSize-1-n])
            qcnts.append(nameCnts[n*columnSize + k])
        bubbled = [10000, 0, 0]
        # loop over the sorted contours
        abs = 10000
        total = 0
        for (j, c) in enumerate(qcnts):
            mask = np.zeros(thresh.shape, dtype="uint8")
            cv2.drawContours(mask, [c], -1, 255, -1)
            mask = cv2.bitwise_and(thresh, thresh, mask=mask)
            total = cv2.countNonZero(mask)
            if total < bubbled[0]:
                bubbled[0] = total
            if bubbled is None or total > bubbled[1]:
                bubbled[1] = total
                bubbled[2] = j

        color = (0, 0, 255)
        # print((bubbled[1] - bubbled[0])/bubbled[0])
        # print(bubbled[0], bubbled[1])
        if(n < lastnamesize):

            if((bubbled[1] - bubbled[0])/bubbled[0] < .35):
                lastName.append(alpha[26])
            else:
                lastName.append(alpha[bubbled[2]])
                cv2.drawContours(name, qcnts[bubbled[2]], -1, color, 2)
        elif(n < firstnamesize + lastnamesize):
            if((bubbled[1] - bubbled[0])/bubbled[0] < .35):
                firstName.append(alpha[26])
            else:
                firstName.append(alpha[bubbled[2]])
                cv2.drawContours(name, qcnts[bubbled[2]], -1, color, 2)

        
    cv2.imshow("Exam", name)
    cv2.waitKey(0)
    # print(''.join(firstName[::-1]), ''.join(lastName[::-1]))
    # print(''.join(firstName), ''.join(lastName))
    return (name, ''.join(firstName), ''.join(lastName))


