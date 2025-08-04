package me.chowlong.storageservice.storageservice.item;

import me.chowlong.storageservice.storageservice.enums.Root;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends Neo4jRepository<Item, String> {
    Item findItemByName(String name);
    Item findItemById(String id);

    /**
     * Finds the accessible root user folder of an item.
     * @param id
     * @return root user item node
     */
    @Query("""
            MATCH path = (item:Item {id: $id})<-[:CONTAINS*]-(root:Item {name: "ACCESSIBLE"})
            RETURN nodes(path)[length(path) - 1]
    """)
    Item findItemAccessibleUserRootById(String id);

    /**
     * Finds the immediate files and/or folders from a given
     * non-root accessible directory.
     * @param parentId
     * @return list of items
     */
    @Query("""
            MATCH (root:Item {name: "ACCESSIBLE"})-[:CONTAINS*]->(parent:Item)
            MATCH (parent:Item {id: $parentId})-[:CONTAINS]->(children:Item)
            RETURN children
    """)
    List<Item> findAccessibleChildrenById(@Param("parentId") String parentId);

    /**
     * Finds the files and/or folders and their subfolders from a given
     * non-root accessible directory.
     * @param parentId
     * @return tree of items
     */
    @Query("""
            MATCH (root:Item {name: "ACCESSIBLE"})-[:CONTAINS*]->(parent:Item)
            MATCH subtree = (parent:Item {id: $parentId})-[:CONTAINS*]->()
            RETURN subtree
    """)
    List<Item> findAccessibleChildrenByIdRecursive(@Param("parentId") String parentId);

    /**
     * Finds the files and/or folders and their subfolders from a given
     * non-root inaccessible directory.
     * @param parentId
     * @return tree of items
     */
    @Query("""
            MATCH (root:Item {name: "INACCESSIBLE"})-[:CONTAINS*]->(parent:Item)
            MATCH subtree = (parent:Item {id: $parentId})-[:CONTAINS*]->()
            RETURN subtree
    """)
    List<Item> findInaccessibleChildrenByIdRecursive(@Param("parentId") String parentId);

    /**
     * Deletes the files and/or folders and their subfolders from a given
     * non-root inaccessible directory.
     * @param parentId
     */
    @Query("""
            MATCH (root:Item {name: "INACCESSIBLE"})-[:CONTAINS*]->(parent:Item)
            MATCH subtree = (parent:Item {id: $parentId})-[:CONTAINS*]->()
            DETACH DELETE subtree
    """)
    void deleteInaccessibleChildrenByIdRecursive(@Param("parentId") String parentId);

    /**
     * Finds the immediate files and/or folders from the
     * root accessible directory.
     * @param userId
     * @return list of items
     */
    @Query("""
            MATCH (parent:Item {name: "ACCESSIBLE"})-[:CONTAINS]->(child:Item)
            MATCH (child:Item {name: $userId})-[:CONTAINS]->(grandChildren:Item)
            RETURN grandChildren
    """)
    List<Item> findAccessibleRootChildren(@Param("userId") String userId);

    /**
     * Finds the immediate files and/or folders and their subfolders from the
     * root accessible directory.
     * @param userId
     * @return tree of items
     */
    @Query("""
            MATCH (root:Item {name: "ACCESSIBLE"})-[:CONTAINS]->(parent:Item)
            MATCH subtree = (parent:Item {name: $userId})-[:CONTAINS*]->(children:Item)
            RETURN subtree
    """)
    List<Item> findAccessibleRootChildrenRecursive(@Param("userId") String userId);

    /**
     * Finds all accessible starred files and/or folders recursively.
     * @param userId
     * @return list of items
     */
    @Query("""
            MATCH (parent:Item {name: "ACCESSIBLE"})-[:CONTAINS]->(child:Item)
            MATCH (child:Item {name: $userId})-[:CONTAINS*]->(grandChildren:Item {isStarred: TRUE})
            RETURN grandChildren
    """)
    List<Item> findAccessibleStarredItems(@Param("userId") String userId);

    /**
     * Finds the immediate files and/or folders from the
     * root inaccessible directory.
     * @param userId
     * @return list of items
     */
    @Query("""
            MATCH (parent:Item {name: "INACCESSIBLE"})-[:CONTAINS]->(child:Item)
            MATCH (child:Item {name: $userId})-[:CONTAINS]->(grandChildren:Item)
            RETURN grandChildren
    """)
    List<Item> findInaccessibleRootChildren(@Param("userId") String userId);

    /**
     * Finds the root accessible directory.
     * @param userId
     * @return item
     */
    @Query("""
            MATCH (parent:Item {name: "ACCESSIBLE"})-[:CONTAINS]->(child:Item {name: $userId})
            RETURN child
            LIMIT 1
    """)
    Item findMainAccessibleDirectory(@Param("userId") String userId);

    /**
     * Removes a file or folder from the root accessible directory.
     * @param userId
     * @param itemId
     * @return removed item
     */
    @Query("""
            MATCH (root:Item {name: "ACCESSIBLE"})-[:CONTAINS]->(parent:Item)
            MATCH (parent {name: $userId})-[r:CONTAINS]->(child:Item {id: $itemId})
            DELETE r
            RETURN child
    """)
    Item removeFromMainAccessibleDirectory(@Param("userId") String userId, @Param("itemId") String itemId);

    /**
     * Removes a file or folder from an accessible directory.
     * @param sourceParentId
     * @param itemId
     * @return removed item
     */
    @Query("""
            MATCH (root:Item {name: "ACCESSIBLE"})-[:CONTAINS*]->(parent:Item)
            MATCH (parent {id: $parentId})-[r:CONTAINS]->(child:Item {id: $itemId})
            DELETE r
            RETURN child
    """)
    Item removeFromAccessibleDirectory(@Param("parentId") String sourceParentId, @Param("itemId") String itemId);

    /**
     * Finds the root inaccessible directory.
     * @param userId
     * @return item
     */
    @Query("""
            MATCH (parent:Item {name: "INACCESSIBLE"})-[:CONTAINS]->(child:Item {name: $userId})
            RETURN child
            LIMIT 1
    """)
    Item findMainInaccessibleDirectory(@Param("userId") String userId);

    /**
     * Restores a file or folder from the main inaccessible directory.
     * @param userId
     * @param itemId
     * @return restored item
     */
    @Query("""
            MATCH (root:Item {name: "INACCESSIBLE"})-[:CONTAINS]->(parent:Item)
            MATCH (parent {name: $userId})-[r:CONTAINS]->(child:Item {id: $itemId})
            DELETE r
            RETURN child
    """)
    Item removeFromMainInaccessibleDirectory(@Param("userId") String userId, @Param("itemId") String itemId);

    /**
     * Finds the ancestor files of a given folder including the current folder
     * and root directory.
     * @param descendantId
     * @param userId
     * @return list of ancestor items
     */
    @Query("""
            MATCH path = (descendant:Item {id: $descendantId})<-[:CONTAINS*]-(ancestor:Item {name: $userId})
            RETURN reverse([n IN nodes(path) | n]) AS ancestors
    """)
    List<Item> findOwnerUserAncestorsByDescendantId(@Param("descendantId") String descendantId, @Param("userId") String userId);

    /**
     * Finds the ancestor files of a given folder including the current folder
     * up to the specified ancestor folder.
     * @param descendantId
     * @param ancestorId
     * @return list of ancestor items
     */
    @Query("""
            MATCH path = (descendant:Item {id: $descendantId})<-[:CONTAINS*]-(ancestor:Item {id: $ancestorId})
            RETURN reverse([n IN nodes(path) | n]) AS ancestors
    """)
    List<Item> findOwnerUserAncestorsByDescendantIdAndAncestorId(@Param("descendantId") String descendantId, @Param("ancestorId") String ancestorId);

    /**
     * Finds the root node of an item.
     * @param itemId
     * @return root (accessible or inaccessible)
     */
    @Query("""
            MATCH (item:Item {id: $itemId})<-[:CONTAINS*0..]-(root:Item {isRoot: TRUE})
            RETURN root.name
    """)
    Root findItemRootNameById(@Param("itemId") String itemId);

    /**
     * Finds all starred items of a user.
     * @param userId
     * @return list of items
     */
    @Query("""
            MATCH (stars:`User Starred` {userId: $userId})
            UNWIND stars AS star
            MATCH (star)-[:IS_STARRED]->(item:Item)
            RETURN item
    """)
    List<Item> findAllStarredItemsOfUser(String userId);
}
