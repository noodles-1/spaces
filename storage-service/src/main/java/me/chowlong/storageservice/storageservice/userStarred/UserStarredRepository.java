package me.chowlong.storageservice.storageservice.userStarred;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStarredRepository extends Neo4jRepository<UserStarred, String> {
    /**
     * Finds the user starred node of an item.
     * @param userId
     * @param itemId
     * @return user starred node
     */
    @Query("""
            MATCH (item:Item {id: $itemId})<-[:IS_STARRED]-(star:`User Starred` {userId: $userId})
            RETURN star
    """)
    UserStarred findUserStarredOfItem(String userId, String itemId);
}
