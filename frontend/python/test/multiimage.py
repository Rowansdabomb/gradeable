import cv2
import os, os.path
from gradertest import gradeImage

print(cv2.__version__)
path = os.getcwd()
# print(os.listdir(path))
def printHello():
    return 'hello, this is a printed statement test'
def multiImage():
    testDir = "python/test/"
    outputDir = "graded_pages/"
    imageDir = testDir + "ungraded_pages/" #directory path
    image_path_list = []
    valid_image_extensions = [".jpg", ".jpeg", ".png"]
    valid_image_extensions = [item.lower() for item in valid_image_extensions]

    # if os.path.exists(imageDir):
    for file in os.listdir(imageDir):
        extension = os.path.splitext(file)[1]
        if extension.lower() not in valid_image_extensions:
            continue
        image_path_list.append(os.path.join(imageDir, file))
    # else:
    #     print('Error:')


    imageNumber = 0
    result = ''
    for imagePath in image_path_list:
        imageNumber = imageNumber + 1
        img = cv2.imread(imagePath)
        if img is None:
            continue

        f = open(testDir + "answerkey.txt", "r")
        temp = []
        for line in f:
            temp.extend(list(line.strip()))

        ANSWER_KEY = {}
        for i in range(0, len(temp), 4):
            ANSWER_KEY[int(i/4)] = (int(temp[i+2]), int(temp[i+3]))
        
        result = result + gradeImage(ANSWER_KEY, imagePath, testDir + outputDir, imageNumber) + ' '

    #     key = cv2.waitKey(0)
    #     if key == 27: #escape
    #         break
    return result
    # cv2.destroyAllWindows()
