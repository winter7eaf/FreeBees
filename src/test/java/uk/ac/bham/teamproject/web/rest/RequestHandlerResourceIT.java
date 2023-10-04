package uk.ac.bham.teamproject.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.repository.ItemRepository;
import uk.ac.bham.teamproject.repository.RequestRepository;
import uk.ac.bham.teamproject.repository.UserRepository;
import uk.ac.bham.teamproject.service.RequestService;

/**
 * Test class for the RequestHandlerResource REST controller.
 *
 * @see RequestHandlerResource
 */
@IntegrationTest
class RequestHandlerResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        RequestRepository requestRepository = null;
        ItemRepository itemRepository = null;
        RequestService requestService = null;
        UserRepository userRepository = null;
        RequestHandlerResource requestHandlerResource = new RequestHandlerResource(
            requestRepository,
            itemRepository,
            requestService,
            userRepository
        );
        restMockMvc = MockMvcBuilders.standaloneSetup(requestHandlerResource).build();
    }

    /**
     * Test createReceiveItemRequest
     */
    @Test
    void testCreateReceiveItemRequest() throws Exception {
        restMockMvc.perform(post("/api/request-handler/create-receive-item-request")).andExpect(status().isOk());
    }

    /**
     * Test createGiveItemRequest
     */
    @Test
    void testCreateGiveItemRequest() throws Exception {
        restMockMvc.perform(post("/api/request-handler/create-give-item-request")).andExpect(status().isOk());
    }

    /**
     * Test responseRequest
     */
    @Test
    void testResponseRequest() throws Exception {
        restMockMvc.perform(put("/api/request-handler/response-request")).andExpect(status().isOk());
    }

    /**
     * Test receiveRequest
     */
    @Test
    void testReceiveRequest() throws Exception {
        restMockMvc.perform(get("/api/request-handler/receive-request")).andExpect(status().isOk());
    }

    /**
     * Test getAllRequests
     */
    @Test
    void testGetAllRequests() throws Exception {
        restMockMvc.perform(get("/api/request-handler/get-all-requests")).andExpect(status().isOk());
    }

    /**
     * Test n
     */
    @Test
    void testN() throws Exception {
        restMockMvc.perform(get("/api/request-handler/n")).andExpect(status().isOk());
    }
}
