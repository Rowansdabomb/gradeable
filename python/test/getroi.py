from imutils.perspective import four_point_transform
from imutils import contours
import numpy as np
import imutils
import cv2

def getROI():    
    imagePath = 'GradeA-1.png'
    image = cv2.imread(imagePath)
    pageheight, pagewidth = image.shape[:2]
    bubblesize = 15
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
        # sort the contours according to their size in
        # descending order
        cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

        # loop over the sorted contours
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

    cv2.imshow("thresh", thresh)
    # find contours in the thresholded image, then initialize
    # the list of contours that correspond to questions
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if imutils.is_cv2() else cnts[1]
    contours = []
# approximate size for qrcode

    size = bubblesize/988*pagewidth
    minSize = size
    maxSize = size + 10
    print(minSize, maxSize)
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
        if w >= minSize and h >= minSize and ar >= 1-aspect and ar <= 1+aspect:
            contours.append(c)

    # sort the question contours top-to-bottom, then initialize
    # the total number of correct answers
    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    # questionCnts = contours.sort_contours(questionCnts,
    #     method="top-to-bottom")[0]

    final = image
    print(pagewidth, pageheight, contours[0][2][0][0])
    xstart= contours[0][0][0][0]
    xend= contours[0][2][0][0]
    ystart=contours[0][0][0][1]
    yend=contours[0][2][0][1]
    qrroi = image[ystart:yend, xstart:xend]
    cv2.drawContours(final, [contours[0]], -1, (0, 0, 255), 4)
    imgscaled = cv2.resize(final, None, fx=.3, fy=.3, interpolation=cv2.INTER_LINEAR)
    cv2.imshow('final', imgscaled)
    cv2.imshow('qr', qrroi)
    cv2.waitKey(0)
    return qrroi