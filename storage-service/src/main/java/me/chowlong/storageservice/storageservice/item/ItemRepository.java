package me.chowlong.storageservice.storageservice.item;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends Neo4jRepository<Item, String> {
    Item findItemByName(String name);
    Item findItemById(String id);

    @Query("""
            MATCH (parent:Item {id: $parentId})-[:CONTAINS]->(children:Item)
            RETURN children
    """)
    List<Item> findChildrenById(@Param("parentId") String parentId);
}
