package me.chowlong.logservice.config;

import me.chowlong.logservice.auditLog.AuditLogDto;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConsumerConfiguration {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapAddress;
    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    @Bean
    public ConsumerFactory<String, AuditLogDto> auditLogConsumerFactory() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, this.bootstrapAddress);
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, this.groupId);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configs.put(JsonDeserializer.TYPE_MAPPINGS,
                "auditLogDto:me.chowlong.logservice.auditLog.AuditLogDto, "
                        + "me.chowlong.userservice.auditLog.AuditLogDto:me.chowlong.logservice.auditLog.AuditLogDto"
        );
        configs.put(JsonDeserializer.TRUSTED_PACKAGES, "me.chowlong");
        return new DefaultKafkaConsumerFactory<>(configs);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AuditLogDto> auditLogKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, AuditLogDto> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(auditLogConsumerFactory());
        return factory;
    }
}
