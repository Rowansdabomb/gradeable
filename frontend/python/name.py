# import the necessary packages
from imutils.perspective import four_point_transform
from imutils import contours
import numpy as np
import imutils
import cv2

def getName(firstnamesize, lastnamesize):
    alpha = 'abcdefghijklmnopqrstuvwxyz '
    firstName = []
    lastName = []
    # load the image, convert it to grayscale, blur it
    # slightly, then find edges
    image = cv2.imread('testname.PNG')
    # cv2.imshow("image", image)
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
        # print('contours found')
        # sort the contours according to their size in
        # descending order
        cnts = sorted(cnts, key=cv2.contourArea, reverse=True)
    
        # loop over the sorted contours
        # print(cv2.contourArea(cnts[0]))
        # print(image.size)
        if(cv2.contourArea(cnts[0]) > image.size*(.7)  ):
            for c in cnts:
                # approximate the contour
                peri = cv2.arcLength(c, True)
                approx = cv2.approxPolyDP(c, 0.02 * peri, True)
                contourCounts = contourCounts + 1
                # if our approximated contour has four points
                # and is one of largest by area,
                # then we can assume we have found the paper
                if len(approx) == 4 and contourCounts < countourSizeThreshold:
                    # print('page edge found')
                    paperEdge = True
                    docCnt = approx
                    break
                elif (contourCounts >= countourSizeThreshold):
                    # print('page edge NOT found')
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

    # cv2.imshow("thresh", thresh)
    # cv2.imshow("gray", gray)
    # cv2.waitKey(0)
    # find contours in the thresholded image, then initialize
    # the list of contours that correspond to questions
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if imutils.is_cv2() else cnts[1]
    questionCnts = []

    qSize = 8
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
    allbubbles = image
    # cv2.drawContours(allbubbles, questionCnts, -1, (0, 255, 0), 2)
    # cv2.imshow('paper', allbubbles)

    
    # there are firstnamesize columns for firstname, and lastnamesize columns for last name
    name = cv2.imread('testname.PNG')
    for n in range(firstnamesize+lastnamesize):
        # sort the contours for the current question from
        # top-to-bottom, then initialize the index of the
        # bubbled answer
        qcnts = []
        for k in range(26):
            qcnts.append(questionCnts[k*26 + firstnamesize+lastnamesize-1-n])
        columnbubbles = cv2.imread('testname.PNG')
        # cv2.drawContours(columnbubbles, qcnts, -1, (0, 255, 0), 2)
        # cv2.imshow('column', columnbubbles)
        bubbled = [10000, 0, 0]
        # loop over the sorted contours
        abs = 10000
        total = 0
        for (j, c) in enumerate(qcnts):
            # construct a mask that reveals only the current
            # "bubble" for the question
            mask = np.zeros(thresh.shape, dtype="uint8")
            cv2.drawContours(mask, [c], -1, 255, -1)
            # cv2.imshow("mask before", mask)
            # #cv2.imshow("mask", mask)
            # cv2.waitKey(0)
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

        # print(bubbled[1], bubbled[0])

            
        # initialize the contour color and the index of the
        # *correct* answer
        color = (0, 0, 255)
        if(n < firstnamesize):
            if((bubbled[1] - bubbled[0])/bubbled[0] < .3):
                firstName.append(alpha[26])
            else:
                firstName.append(alpha[bubbled[2]])
                cv2.drawContours(name, qcnts[bubbled[2]], -1, color, 2)
        elif(n < firstnamesize + lastnamesize):
            if((bubbled[1] - bubbled[0])/bubbled[0] < .3):
                lastName.append(alpha[26])
            else:
                lastName.append(alpha[bubbled[2]])
                cv2.drawContours(name, qcnts[bubbled[2]], -1, color, 2)
        # draw the outline of the correct answer on the test
        
        # cv2.drawContours(name, qcnts[bubbled[2]], -1, color, 2)
    cv2.imshow("Exam", name)
    cv2.waitKey(0)
    print(firstName, lastName)
