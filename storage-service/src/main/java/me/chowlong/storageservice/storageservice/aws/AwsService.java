package me.chowlong.storageservice.storageservice.aws;

import me.chowlong.storageservice.storageservice.storage.dto.GenerateDownloadRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.*;

import java.time.Duration;

@Service
public class AwsService {
    @Value("${aws.bucket-name}")
    private String bucketName;

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    public AwsService(S3Client s3Client) {
        this.s3Client = s3Client;
        this.s3Presigner = S3Presigner
                .builder()
                .credentialsProvider(this.s3Client.serviceClientConfiguration().credentialsProvider())
                .endpointOverride(this.s3Client.serviceClientConfiguration().endpointOverride().get())
                .region(this.s3Client.serviceClientConfiguration().region())
                .build();
    }

    public String generateUploadUrl(String keyName, String contentType) {
        PutObjectRequest objectRequest = PutObjectRequest
                .builder()
                .bucket(this.bucketName)
                .key(keyName)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest
                .builder()
                .signatureDuration(Duration.ofMinutes(5))
                .putObjectRequest(objectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = this.s3Presigner.presignPutObject(presignRequest);
        return presignedRequest.url().toExternalForm();
    }

    public String generateDownloadUrl(GenerateDownloadRequestDTO generateDownloadRequestDTO) {
        GetObjectRequest objectRequest = GetObjectRequest
                .builder()
                .bucket(this.bucketName)
                .key(generateDownloadRequestDTO.getFileId())
                .responseContentDisposition("attachment; filename=\"" + generateDownloadRequestDTO.getFilename() + "\"")
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest
                .builder()
                .signatureDuration(Duration.ofMinutes(5))
                .getObjectRequest(objectRequest)
                .build();

        PresignedGetObjectRequest presignedRequest = this.s3Presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toExternalForm();
    }

    public String generateDeleteUrl(String keyName) {
        DeleteObjectRequest objectRequest = DeleteObjectRequest
                .builder()
                .bucket(this.bucketName)
                .key(keyName)
                .build();

        DeleteObjectPresignRequest presignRequest = DeleteObjectPresignRequest
                .builder()
                .signatureDuration(Duration.ofMinutes(5))
                .deleteObjectRequest(objectRequest)
                .build();

        PresignedDeleteObjectRequest presignedRequest = this.s3Presigner.presignDeleteObject(presignRequest);
        return presignedRequest.url().toExternalForm();
    }
}
