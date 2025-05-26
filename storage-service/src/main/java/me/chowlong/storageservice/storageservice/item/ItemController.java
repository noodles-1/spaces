package me.chowlong.storageservice.storageservice.item;

import jakarta.validation.Valid;
import me.chowlong.storageservice.storageservice.item.dto.NewItemDTO;
import me.chowlong.storageservice.storageservice.util.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/items")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/children/{parentId}")
    public ResponseEntity<Object> getChildrenByParentId(@PathVariable("parentId") String parentId) {
        List<Item> children = this.itemService.getChildrenByParentId(parentId);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("children", children);
        return ResponseHandler.generateResponse("Fetched children successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createItem(@Valid @RequestBody NewItemDTO newItemDTO) {
        Item item = this.itemService.createItem(newItemDTO);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("item", item);
        return ResponseHandler.generateResponse("Created item successfully.", HttpStatus.OK, responseData);
    }
}
