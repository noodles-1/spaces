package me.chowlong.userservice.aws;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class AwsService {
    @Value("${aws.bucket-name}")
    private String bucketName;
    @Value("${aws.cdn-endpoint}")
    private String cdnEndpoint;

    @Autowired
    private AmazonS3 s3Client;

    public String uploadFile(String keyName, String contentType, long contentLength, InputStream inputStream) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(contentType);
        metadata.setContentLength(contentLength);

        this.s3Client.putObject(new PutObjectRequest(this.bucketName, keyName, inputStream, metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));
        return String.format("%s/%s", this.cdnEndpoint, keyName);
    }

    public void deleteFile(String keyName) {
        this.s3Client.deleteObject(new DeleteObjectRequest(this.bucketName, keyName));
    }
}
