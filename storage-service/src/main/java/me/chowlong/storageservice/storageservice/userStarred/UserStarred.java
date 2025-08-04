package me.chowlong.storageservice.storageservice.userStarred;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.chowlong.storageservice.storageservice.item.Item;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@Node("User Starred")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserStarred {
    @Id
    private String id;

    @Nonnull
    private String userId;

    @Nonnull
    @Relationship(type = "IS_STARRED", direction = Relationship.Direction.OUTGOING)
    private Item item;
}
