package me.chowlong.storageservice.storageservice.item;

import me.chowlong.storageservice.storageservice.enums.ItemType;
import me.chowlong.storageservice.storageservice.enums.Root;
import me.chowlong.storageservice.storageservice.item.dto.MoveItemRequestDTO;
import me.chowlong.storageservice.storageservice.item.dto.NewItemRequestDTO;
import me.chowlong.storageservice.storageservice.item.dto.RenameItemRequestDTO;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ItemService {
    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public Item getItemById(String id) {
        return this.itemRepository.findItemById(id);
    }

    public Item getItemUserRootById(String id) {
        return this.itemRepository.findItemUserRootById(id);
    }

    public List<Item> getAccessibleChildrenByParentId(String parentId) {
        return this.itemRepository.findAccessibleChildrenById(parentId);
    }

    public List<Item> getAccessibleChildrenByParentIdRecursive(String parentId) {
        return this.itemRepository.findAccessibleChildrenByIdRecursive(parentId);
    }

    public List<Item> getAccessibleRootChildren(String userId) {
        return this.itemRepository.findAccessibleRootChildren(userId);
    }

    public List<Item> getAccessibleRootChildrenRecursive(String userId) {
        return this.itemRepository.findAccessibleRootChildrenRecursive(userId);
    }

    public List<Item> getAccessibleChildrenRecursive(String folderId) {
        return this.itemRepository.findAccessibleChildrenRecursive(folderId);
    }

    public List<Item> getInaccessibleChildrenByParentIdRecursive(String parentId) {
        return this.itemRepository.findInaccessibleChildrenByIdRecursive(parentId);
    }

    public List<Item> getInaccessibleRootChildren(String userId) {
        return this.itemRepository.findInaccessibleRootChildren(userId);
    }

    public List<Item> getOwnerUserAncestorsByDescendantId(String descendantId, String userId) {
        return this.itemRepository.findOwnerUserAncestorsByDescendantId(descendantId, userId);
    }

    public List<Item> getOwnerUserAncestorsByDescendantIdAndAncestorId(String descendantId, String itemId) {
        return this.itemRepository.findOwnerUserAncestorsByDescendantIdAndAncestorId(descendantId, itemId);
    }

    public List<Item> getAllStarredItemsOfUser(String userId) {
        return this.itemRepository.findAllStarredItemsOfUser(userId);
    }

    public List<Item> getAllSharedItemsToUser(String userId) {
        return this.itemRepository.findAllSharedItemsToUser(userId);
    }

    public List<Item> getAllSharedItemsToUserRecursive(String userId) {
        return this.itemRepository.findAllSharedItemsToUserRecursive(userId);
    }

    public Root getItemRootNameById(String itemId) {
        return this.itemRepository.findItemRootNameById(itemId);
    }

    public void createUserMainDirectories(String userId) {
        Item userMainAccessibleDirectory = new Item();
        userMainAccessibleDirectory.setId(UUID.randomUUID().toString());
        userMainAccessibleDirectory.setName(userId);
        userMainAccessibleDirectory.setType(ItemType.FOLDER);
        userMainAccessibleDirectory.setRoot(false);
        userMainAccessibleDirectory.setCreatedAt(new Date());
        userMainAccessibleDirectory.setUpdatedAt(new Date());

        Item userMainInaccessibleDirectory = new Item();
        userMainInaccessibleDirectory.setId(UUID.randomUUID().toString());
        userMainInaccessibleDirectory.setName(userId);
        userMainInaccessibleDirectory.setType(ItemType.FOLDER);
        userMainInaccessibleDirectory.setRoot(false);
        userMainInaccessibleDirectory.setCreatedAt(new Date());
        userMainInaccessibleDirectory.setUpdatedAt(new Date());

        Item accessibleRoot = this.itemRepository.findItemByName(String.valueOf(Root.ACCESSIBLE));
        Item inaccessibleRoot = this.itemRepository.findItemByName(String.valueOf(Root.INACCESSIBLE));
        accessibleRoot.getChildren().add(userMainAccessibleDirectory);
        inaccessibleRoot.getChildren().add(userMainInaccessibleDirectory);
        this.itemRepository.save(accessibleRoot);
        this.itemRepository.save(inaccessibleRoot);
    }

    public Item createItem(NewItemRequestDTO newItemDTO, String userId) {
        Item newItem = new Item();
        newItem.setId(newItemDTO.getId() != null ? newItemDTO.getId() : UUID.randomUUID().toString());
        newItem.setName(newItemDTO.getName());
        newItem.setCreatedBy(userId);
        newItem.setType(newItemDTO.getType());
        newItem.setContentType(newItemDTO.getContentType());
        newItem.setSize(newItemDTO.getSize());
        newItem.setRoot(false);
        newItem.setCreatedAt(new Date());
        newItem.setUpdatedAt(new Date());

        Item parentItem;
        if (newItemDTO.getParentId() != null) {
            parentItem = this.itemRepository.findItemById(newItemDTO.getParentId());
        }
        else {
            parentItem = this.itemRepository.findMainAccessibleDirectory(userId);
        }

        parentItem.getChildren().add(newItem);
        this.itemRepository.save(parentItem);

        return newItem;
    }

    public void moveFromMainAccessibleToAccessible(String userId, MoveItemRequestDTO moveItemRequestDTO) {
        Item item = this.itemRepository.removeFromMainAccessibleDirectory(userId, moveItemRequestDTO.getItemId());
        Item parentItem = this.itemRepository.findItemById(moveItemRequestDTO.getDestinationParentId());
        parentItem.getChildren().add(item);
        this.itemRepository.save(parentItem);
    }

    public void moveFromAccessibleToAccessible(MoveItemRequestDTO moveItemRequestDTO) {
        Item item = this.itemRepository.removeFromAccessibleDirectory(moveItemRequestDTO.getSourceParentId(), moveItemRequestDTO.getItemId());
        Item parentItem = this.itemRepository.findItemById(moveItemRequestDTO.getDestinationParentId());
        parentItem.getChildren().add(item);
        this.itemRepository.save(parentItem);
    }

    public void moveFromAccessibleToMainAccessible(String userId, MoveItemRequestDTO moveItemRequestDTO) {
        Item item = this.itemRepository.removeFromAccessibleDirectory(moveItemRequestDTO.getSourceParentId(), moveItemRequestDTO.getItemId());
        Item parentItem = this.itemRepository.findMainAccessibleDirectory(userId);
        parentItem.getChildren().add(item);
        this.itemRepository.save(parentItem);
    }

    public void deleteFromMainAccessibleToTrash(String userId, MoveItemRequestDTO moveItemRequestDTO) {
        Item item = this.itemRepository.removeFromMainAccessibleDirectory(userId, moveItemRequestDTO.getItemId());
        item.setAccessibleParentId(null);

        Item parentItem = this.itemRepository.findMainInaccessibleDirectory(userId);
        parentItem.getChildren().add(item);
        this.itemRepository.save(parentItem);
    }

    public void deleteFromAccessibleToTrash(String userId, MoveItemRequestDTO moveItemRequestDTO) {
        Item item = this.itemRepository.removeFromAccessibleDirectory(moveItemRequestDTO.getSourceParentId(), moveItemRequestDTO.getItemId());
        item.setAccessibleParentId(moveItemRequestDTO.getSourceParentId());

        Item parentItem = this.itemRepository.findMainInaccessibleDirectory(userId);
        parentItem.getChildren().add(item);
        this.itemRepository.save(parentItem);
    }

    public void restoreFromTrashToAccessible(String userId, MoveItemRequestDTO moveItemRequestDTO) {
        Item item = this.itemRepository.removeFromMainInaccessibleDirectory(userId, moveItemRequestDTO.getItemId());

        Item parentItem;
        try {
            if (item.getAccessibleParentId() != null) {
                parentItem = this.itemRepository.findItemById(item.getAccessibleParentId());
                if (parentItem == null) {
                    throw new Exception();
                }

                Root root = this.itemRepository.findItemRootNameById(parentItem.getId());
                if (root == Root.INACCESSIBLE) {
                    throw new Exception();
                }
            }
            else {
                throw new Exception();
            }
        }
        catch (Exception e) {
            parentItem = this.itemRepository.findMainAccessibleDirectory(userId);
        }

        parentItem.getChildren().add(item);
        this.itemRepository.save(parentItem);
    }

    public void renameItemById(RenameItemRequestDTO renameItemRequestDTO) {
        Item item = this.itemRepository.findItemById(renameItemRequestDTO.getItemId());
        String newItemName = renameItemRequestDTO.getNewItemName();
        if (renameItemRequestDTO.getItemFileExtension() != null)
            newItemName += "." + renameItemRequestDTO.getItemFileExtension();
        item.setName(newItemName);
        item.setUpdatedAt(new Date());
        this.itemRepository.save(item);
    }

    public void deleteItemPermanently(String itemId) {
        Item item = this.itemRepository.findItemById(itemId);
        if (item.getType() == ItemType.FILE || item.getChildren().isEmpty()) {
            this.itemRepository.delete(item);
        }
        else {
            this.itemRepository.deleteInaccessibleChildrenByIdRecursive(itemId);
        }
    }
}
