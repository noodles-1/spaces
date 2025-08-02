package me.chowlong.storageservice.storageservice.userPermission;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPermissionRepository extends Neo4jRepository<UserPermission, String> {
    UserPermission findUserPermissionById(String id);

    /**
     * Finds the user permissions from the ancestors of a given item.
     * @param descendantId
     * @return list of user permissions
     */
    @Query("""
            MATCH path = (descendant:Item {id: $descendantId})<-[*]-()
            WITH DISTINCT [n IN nodes(path) WHERE n:`User Permission`] as userPermissions
            UNWIND userPermissions as permission
            MATCH userPermissionPath = (permission)-[:HAS_PERMISSION]->(item:Item)
            RETURN userPermissionPath
    """)
    List<UserPermission> findUserPermissionsFromAncestorsByDescendantId(@Param("descendantId") String descendantId);

    /**
     * Finds a user permission of a given item.
     * @param descendantId
     * @param userId
     * @return user permission
     */
    @Query("""
            MATCH (descendant:Item {id: $descendantId})<-[*]-(permission:`User Permission`)
            MATCH path = (permission:`User Permission` {userId: $userId})-[:HAS_PERMISSION]->(ancestor:Item)
            RETURN path
    """)
    UserPermission findUserPermissionFromAncestorsByDescendantIdAndUserId(@Param("descendantId") String descendantId, @Param("userId") String userId);
}
