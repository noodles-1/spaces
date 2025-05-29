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

    @Query("""
            MATCH (parent:Item {name: "ACCESSIBLE"})-[:CONTAINS]->(child:Item)
            WHERE child.name = $userId
            WITH child
            MATCH (child:Item)-[:CONTAINS]->(grandChildren:Item)
            RETURN grandChildren
    """)
    List<Item> findAccessibleRootChildren(@Param("userId") String userId);

    @Query("""
            MATCH (parent:Item {name: "INACCESSIBLE"})-[:CONTAINS]->(child:Item)
            WHERE child.name = $userId
            WITH child
            MATCH (child:Item)-[:CONTAINS]->(grandChildren:Item)
            RETURN grandChildren
    """)
    List<Item> findInaccessibleRootChildren(@Param("userId") String userId);

    @Query("""
            MATCH (parent:Item {name: "ACCESSIBLE"})-[:CONTAINS]->(child:Item)
            WHERE child.name = $userId
            RETURN child
            LIMIT 1
    """)
    Item findMainAccessibleDirectory(@Param("userId") String userId);

    @Query("""
            MATCH path = (descendant:Item {id: $descendantId})<-[:CONTAINS*]-(ancestor:Item {name: $userId})
            RETURN reverse([n IN nodes(path) | n]) AS ancestors
    """)
    List<Item> findOwnerUserAncestorsByDescendantId(@Param("descendantId") String descendantId, @Param("userId") String userId);
}
