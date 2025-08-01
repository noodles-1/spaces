package me.chowlong.storageservice.storageservice.userPermission;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.chowlong.storageservice.storageservice.enums.UserPermissionType;
import me.chowlong.storageservice.storageservice.item.Item;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Date;

@Node("User Permission")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserPermission {
    @Id
    private String id;

    @Nonnull
    private String userId; // if value is "EVERYONE", then permission applies to all users regardless if unauthenticated

    @Nonnull
    private UserPermissionType type;

    @Nonnull
    @Relationship(type = "HAS_PERMISSION", direction = Relationship.Direction.OUTGOING)
    private Item item;

    @Nonnull
    private Date createdAt;

    @Nonnull
    private Date updatedAt;
}
