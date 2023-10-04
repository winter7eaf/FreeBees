package uk.ac.bham.teamproject.web.rest;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import uk.ac.bham.teamproject.domain.Item;
import uk.ac.bham.teamproject.domain.Request;
import uk.ac.bham.teamproject.domain.enumeration.ItemState;
import uk.ac.bham.teamproject.domain.enumeration.RequestState;
import uk.ac.bham.teamproject.repository.ItemRepository;
import uk.ac.bham.teamproject.repository.RequestRepository;
import uk.ac.bham.teamproject.repository.UserRepository;
import uk.ac.bham.teamproject.security.SecurityUtils;
import uk.ac.bham.teamproject.service.RequestService;
import uk.ac.bham.teamproject.service.dto.RequestDTO;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * RequestHandlerResource controller
 */
@RestController
@RequestMapping("/api/request-handler")
public class RequestHandlerResource {

    private final Logger log = LoggerFactory.getLogger(RequestHandlerResource.class);
    private static final String ENTITY_NAME = "request";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RequestRepository requestRepository;
    private final ItemRepository itemRepository;
    private final RequestService requestService;
    private final UserRepository userRepository;

    public RequestHandlerResource(
        RequestRepository requestRepository,
        ItemRepository itemRepository,
        RequestService requestService,
        UserRepository userRepository
    ) {
        this.requestRepository = requestRepository;
        this.itemRepository = itemRepository;
        this.requestService = requestService;
        this.userRepository = userRepository;
    }

    /**
     * POST createReceiveItemRequest
     */
    @PostMapping("/receive-item")
    @Transactional
    public ResponseEntity<RequestDTO> createReceiveItemRequest(@RequestParam("itemId") Long itemId) {
        Optional<String> stringOptional = SecurityUtils.getCurrentUserLogin();
        Optional<Item> byId = itemRepository.findById(itemId);
        if (stringOptional.isEmpty()) {
            throw new BadRequestAlertException("Unknown requester", "user", "idnotfound");
        } else if (byId.isEmpty()) {
            throw new BadRequestAlertException("Item not found", "item", "idnotfound");
        } else {
            String currentUserLogin = stringOptional.get();
            Item itemRequesting = byId.get();
            if (!itemRequesting.getState().equals(ItemState.AVAILABLE)) {
                throw new BadRequestAlertException("Item is not available", "item", "idinvalid");
            } else if (itemRequesting.getGiver().getLogin().equals(currentUserLogin)) {
                throw new BadRequestAlertException("user self request item", "user", "idinvalid");
            } else {
                log.debug("User login = {} request item id = {}", currentUserLogin, itemId);
                RequestDTO result = requestService.createReceiveItemRequest(currentUserLogin, byId.get());
                return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                    .body(result);
            }
        }
    }

    /**
     * POST createGiveItemRequest
     */
    @PostMapping("/give-item-user")
    public ResponseEntity<RequestDTO> createGiveItemRequest(
        @RequestParam("itemId") Long itemId,
        @RequestParam("requesteeLogin") String requesteeLogin
    ) {
        Optional<String> stringOptional = SecurityUtils.getCurrentUserLogin();
        Optional<Item> byId = itemRepository.findById(itemId);
        if (stringOptional.isEmpty()) {
            throw new BadRequestAlertException("Unknown requester", "user", "idnotfound");
        } else if (byId.isEmpty()) {
            throw new BadRequestAlertException("Item not found", "item", "idnotfound");
        } else if (!userRepository.existsByLogin(requesteeLogin)) {
            throw new BadRequestAlertException("Requestee not found", "User", "idnotfound");
        } else {
            String currentUserLogin = stringOptional.get();
            Item itemToGive = byId.get();
            if (currentUserLogin.equals(requesteeLogin)) {
                throw new BadRequestAlertException("user self give item", "user", "idinvalid");
            } else if (!itemToGive.getGiver().getLogin().equals(currentUserLogin)) {
                throw new BadRequestAlertException("item not belongs to requester", "item", "idinvalid");
            } else if (!itemToGive.getState().equals(ItemState.AVAILABLE)) {
                throw new BadRequestAlertException("item not available", "item", "idinvalid");
            } else {
                log.debug("User login = {} request to give item id = {} to User login = {}", currentUserLogin, itemId, requesteeLogin);
                RequestDTO result = requestService.createGiveItemRequest(currentUserLogin, requesteeLogin, itemToGive);
                return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                    .body(result);
            }
        }
    }

    /**
     * PUT responseRequest
     */
    @PutMapping("/respond")
    public ResponseEntity<RequestDTO> responseRequest(@RequestParam("requestId") Long requestId, @RequestParam("accept") boolean isAccept) {
        Optional<String> stringOptional = SecurityUtils.getCurrentUserLogin();
        Optional<Request> byId = requestRepository.findById(requestId);
        if (stringOptional.isEmpty()) {
            throw new BadRequestAlertException("Unknown requestee", "user", "idnotfound");
        } else if (byId.isEmpty()) {
            throw new BadRequestAlertException("request not found", ENTITY_NAME, "idnotfound");
        } else {
            String currentUserLogin = stringOptional.get();
            Request request = byId.get();
            if (request.getRequester().getLogin().equals(currentUserLogin)) {
                throw new BadRequestAlertException("user self respond", ENTITY_NAME, "idinvalid");
            } else if (!request.getRequestee().getLogin().equals(currentUserLogin)) {
                throw new BadRequestAlertException("user not the requestee", ENTITY_NAME, "idinvalid");
            } else if (!request.getState().equals(RequestState.PENDING)) {
                throw new BadRequestAlertException("request expired or responded", ENTITY_NAME, "idinvalid");
            } else if (!request.getItem().getState().equals(ItemState.AVAILABLE)) {
                throw new BadRequestAlertException("item not available", "item", "idinvalid");
            } else {
                log.debug("User login = {} respond request id = {}, isAccept = {}", currentUserLogin, requestId, isAccept);
                RequestDTO result = requestService.responseRequest(requestId, isAccept);
                return ResponseEntity
                    .ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, request.getId().toString()))
                    .body(result);
            }
        }
    }

    /**
     * GET receiveRequest
     */
    @GetMapping("/receive")
    public List<RequestDTO> receiveRequest() {
        log.debug("receive all PENDING requests");
        return requestService.receiveRequest();
    }

    /**
     * GET getAllRequests
     */
    @GetMapping("/list")
    public List<RequestDTO> getAllRequests() {
        log.debug("get all requests");
        return requestService.getAllRequest();
    }
}
