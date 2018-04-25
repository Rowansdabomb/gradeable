from pyzbar.pyzbar import decode
from PIL import Image

decode(Image.open('testqr.jpg')) 
# [Decoded(data=b'Foramenifera', type='CODE128'), Decoded(data=b'Rana temporaria', type='CODE128')]