package me.chowlong.storageservice.storageservice.item;

import jakarta.validation.Valid;
import me.chowlong.storageservice.storageservice.enums.Root;
import me.chowlong.storageservice.storageservice.exception.item.ItemNameInvalidException;
import me.chowlong.storageservice.storageservice.item.dto.ItemResponseDTO;
import me.chowlong.storageservice.storageservice.item.dto.MoveItemRequestDTO;
import me.chowlong.storageservice.storageservice.item.dto.NewItemRequestDTO;
import me.chowlong.storageservice.storageservice.principal.UserPrincipal;
import me.chowlong.storageservice.storageservice.util.ResponseHandler;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/items")
public class ItemController {
    private final ItemService itemService;
    private final ModelMapper modelMapper;

    public ItemController(ItemService itemService, ModelMapper modelMapper) {
        this.itemService = itemService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/children/{parentId}")
    public ResponseEntity<Object> getChildrenByParentId(@PathVariable("parentId") String parentId) {
        List<Item> children = this.itemService.getChildrenByParentId(parentId);
        List<ItemResponseDTO> childrenResponse = children
                .stream()
                .map(child -> this.modelMapper.map(child, ItemResponseDTO.class))
                .toList();

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("children", childrenResponse);
        return ResponseHandler.generateResponse("Fetched children successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/children/recursive/{parentId}")
    public ResponseEntity<Object> getChildrenByParentIdRecursive(@PathVariable("parentId") String parentId) {
        List<Item> children = this.itemService.getChildrenByParentIdRecursive(parentId);
        List<ItemResponseDTO> childrenResponse = children
                .stream()
                .map(child -> this.modelMapper.map(child, ItemResponseDTO.class))
                .toList();

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("children", childrenResponse);
        return ResponseHandler.generateResponse("Fetched children recursive successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/check-deleted/{parentId}")
    public ResponseEntity<Object> checkDirectoryDeleted(@PathVariable("parentId") String parentId) {
        Root root = this.itemService.getItemRootNameById(parentId);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleted", root == Root.INACCESSIBLE);
        return ResponseHandler.generateResponse("Checked if directory is deleted successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/accessible/children")
    public ResponseEntity<Object> getAccessibleRootChildren(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Item> children = this.itemService.getAccessibleRootChildren(userPrincipal.getUserId());
        List<ItemResponseDTO> childrenResponse = children
                .stream()
                .map(child -> this.modelMapper.map(child, ItemResponseDTO.class))
                .toList();

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("children", childrenResponse);
        return ResponseHandler.generateResponse("Fetched accessible root children successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/accessible/starred")
    public ResponseEntity<Object> getAccessibleStarredItems(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Item> children = this.itemService.getAccessibleStarredItems(userPrincipal.getUserId());
        List<ItemResponseDTO> childrenResponse = children
                .stream()
                .map(item -> this.modelMapper.map(item, ItemResponseDTO.class))
                .toList();

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("children", childrenResponse);
        return ResponseHandler.generateResponse("Fetched starred items successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/inaccessible/children")
    public ResponseEntity<Object> getInaccessibleRootChildren(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Item> children = this.itemService.getInaccessibleRootChildren(userPrincipal.getUserId());
        List<ItemResponseDTO> childrenResponse = children
                .stream()
                .map(child -> this.modelMapper.map(child, ItemResponseDTO.class))
                .toList();

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("children", childrenResponse);
        return ResponseHandler.generateResponse("Fetched inaccessible root children successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/owner-ancestors/{descendantId}")
    public ResponseEntity<Object> getOwnerUserAncestorsByDescendantId(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("descendantId") String descendantId
    ) {
        List<Item> ancestors = this.itemService.getOwnerUserAncestorsByDescendantId(descendantId, userPrincipal.getUserId());
        List<ItemResponseDTO> ancestorsResponse = ancestors
                .stream()
                .map(ancestor -> this.modelMapper.map(ancestor, ItemResponseDTO.class))
                .toList();

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("ancestors", ancestorsResponse);
        return ResponseHandler.generateResponse("Fetched owner's ancestors successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/root/{itemId}")
    public ResponseEntity<Object> getItemRootNameById(@PathVariable("itemId") String itemId) {
        Root root = this.itemService.getItemRootNameById(itemId);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("rootName", root.toString());
        return ResponseHandler.generateResponse("Fetched item root name successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/create-main-dirs")
    public ResponseEntity<Object> createUserMainDirectories(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        this.itemService.createUserMainDirectories(userPrincipal.getUserId());
        return ResponseHandler.generateResponse("Generated main directories successfully.", HttpStatus.OK, null);
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody NewItemRequestDTO newItemDTO
    ) throws ItemNameInvalidException {
        String itemName = newItemDTO.getName();
        if (itemName.isEmpty() || 200 < itemName.length()) {
            throw new ItemNameInvalidException();
        }

        Pattern itemNamePattern = Pattern.compile("^(?!\\.{1,2}$)[^/]+$");
        if (!itemNamePattern.matcher(itemName).matches()) {
            throw new ItemNameInvalidException();
        }

        Item item = this.itemService.createItem(newItemDTO, userPrincipal.getUserId());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("item", this.modelMapper.map(item, ItemResponseDTO.class));
        return ResponseHandler.generateResponse("Created item successfully.", HttpStatus.OK, responseData);
    }

    @PatchMapping("/star/{itemId}")
    public ResponseEntity<Object> toggleItemStarred(@PathVariable("itemId") String itemId) {
        this.itemService.toggleItemStarred(itemId);
        return ResponseHandler.generateResponse("Toggled item starred successfully.", HttpStatus.OK, null);
    }

    @PatchMapping("/delete")
    public ResponseEntity<Object> deleteItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody MoveItemRequestDTO moveItemRequestDTO
    ) {
        if (moveItemRequestDTO.getSourceParentId() != null) {
            this.itemService.deleteFromAccessibleToTrash(userPrincipal.getUserId(), moveItemRequestDTO);
        }
        else {
            this.itemService.deleteFromMainAccessibleToTrash(userPrincipal.getUserId(), moveItemRequestDTO);
        }
        return ResponseHandler.generateResponse("Moved item to trash successfully.", HttpStatus.OK, null);
    }

    @PatchMapping("/restore")
    public ResponseEntity<Object> restoreItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody MoveItemRequestDTO moveItemRequestDTO
    ) {
        this.itemService.restoreFromTrashToAccessible(userPrincipal.getUserId(), moveItemRequestDTO);
        return ResponseHandler.generateResponse("Restored item successfully.", HttpStatus.OK, null);
    }
}
