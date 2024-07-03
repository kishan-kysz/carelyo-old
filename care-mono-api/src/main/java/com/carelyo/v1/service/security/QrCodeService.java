package com.carelyo.v1.service.security;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.springframework.stereotype.Service;

/**
 * Service for Prescription QR codes
 */
@Service
public class QrCodeService {

  /**
   * get QR code
   *
   * @param string toString method should be applied to the object whished to transform in QR code
   * @param width  width of the QR code image
   * @param height height of the QR code image
   * @return QR code image
   * @throws WriterException
   * @throws IOException
   */
  public static byte[] getQRCodeImage(String string, int width, int height)
      throws WriterException, IOException {
    QRCodeWriter qrCodeWriter = new QRCodeWriter();
    BitMatrix bitMatrix = qrCodeWriter.encode(string, BarcodeFormat.QR_CODE, width, height);

    ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
    MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
    return pngOutputStream.toByteArray();
  }
}
