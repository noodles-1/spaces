package me.chowlong.storageservice.storageservice.item;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.chowlong.storageservice.storageservice.enums.ItemType;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Node("Item")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Item {
    @Id
    private String id;

    @Nonnull
    private String name;

    @Nonnull
    private ItemType type;

    @Nullable
    private String contentType;

    @Nullable
    private Long size;

    @Nonnull
    private boolean isRoot = false;

    @Nonnull
    @Relationship(type = "CONTAINS", direction = Relationship.Direction.OUTGOING)
    private List<Item> children = new ArrayList<>();

    @Nullable
    private String accessibleParentId;

    @Nonnull
    private Date createdAt;

    @Nonnull
    private Date updatedAt;
}
