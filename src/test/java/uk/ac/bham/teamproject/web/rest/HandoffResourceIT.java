package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static uk.ac.bham.teamproject.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.Handoff;
import uk.ac.bham.teamproject.domain.Item;
import uk.ac.bham.teamproject.domain.RateRecord;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.domain.enumeration.HandoffState;
import uk.ac.bham.teamproject.repository.HandoffRepository;

/**
 * Integration tests for the {@link HandoffResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class HandoffResourceIT {

    private static final HandoffState DEFAULT_STATE = HandoffState.PROGRESSING;
    private static final HandoffState UPDATED_STATE = HandoffState.LOCKED;

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/handoffs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HandoffRepository handoffRepository;

    @Mock
    private HandoffRepository handoffRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHandoffMockMvc;

    private Handoff handoff;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Handoff createEntity(EntityManager em) {
        Handoff handoff = new Handoff().state(DEFAULT_STATE).startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME);
        // Add required entity
        RateRecord rateRecord;
        if (TestUtil.findAll(em, RateRecord.class).isEmpty()) {
            rateRecord = RateRecordResourceIT.createEntity(em);
            em.persist(rateRecord);
            em.flush();
        } else {
            rateRecord = TestUtil.findAll(em, RateRecord.class).get(0);
        }
        handoff.setRateToGiver(rateRecord);
        // Add required entity
        handoff.setRateToReceiver(rateRecord);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        handoff.setGiver(user);
        // Add required entity
        handoff.setReceiver(user);
        // Add required entity
        Item item;
        if (TestUtil.findAll(em, Item.class).isEmpty()) {
            item = ItemResourceIT.createEntity(em);
            em.persist(item);
            em.flush();
        } else {
            item = TestUtil.findAll(em, Item.class).get(0);
        }
        handoff.setItem(item);
        return handoff;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Handoff createUpdatedEntity(EntityManager em) {
        Handoff handoff = new Handoff().state(UPDATED_STATE).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);
        // Add required entity
        RateRecord rateRecord;
        if (TestUtil.findAll(em, RateRecord.class).isEmpty()) {
            rateRecord = RateRecordResourceIT.createUpdatedEntity(em);
            em.persist(rateRecord);
            em.flush();
        } else {
            rateRecord = TestUtil.findAll(em, RateRecord.class).get(0);
        }
        handoff.setRateToGiver(rateRecord);
        // Add required entity
        handoff.setRateToReceiver(rateRecord);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        handoff.setGiver(user);
        // Add required entity
        handoff.setReceiver(user);
        // Add required entity
        Item item;
        if (TestUtil.findAll(em, Item.class).isEmpty()) {
            item = ItemResourceIT.createUpdatedEntity(em);
            em.persist(item);
            em.flush();
        } else {
            item = TestUtil.findAll(em, Item.class).get(0);
        }
        handoff.setItem(item);
        return handoff;
    }

    @BeforeEach
    public void initTest() {
        handoff = createEntity(em);
    }

    @Test
    @Transactional
    void createHandoff() throws Exception {
        int databaseSizeBeforeCreate = handoffRepository.findAll().size();
        // Create the Handoff
        restHandoffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(handoff)))
            .andExpect(status().isCreated());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeCreate + 1);
        Handoff testHandoff = handoffList.get(handoffList.size() - 1);
        assertThat(testHandoff.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testHandoff.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testHandoff.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void createHandoffWithExistingId() throws Exception {
        // Create the Handoff with an existing ID
        handoff.setId(1L);

        int databaseSizeBeforeCreate = handoffRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHandoffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(handoff)))
            .andExpect(status().isBadRequest());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStateIsRequired() throws Exception {
        int databaseSizeBeforeTest = handoffRepository.findAll().size();
        // set the field null
        handoff.setState(null);

        // Create the Handoff, which fails.

        restHandoffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(handoff)))
            .andExpect(status().isBadRequest());

        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = handoffRepository.findAll().size();
        // set the field null
        handoff.setStartTime(null);

        // Create the Handoff, which fails.

        restHandoffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(handoff)))
            .andExpect(status().isBadRequest());

        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHandoffs() throws Exception {
        // Initialize the database
        handoffRepository.saveAndFlush(handoff);

        // Get all the handoffList
        restHandoffMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(handoff.getId().intValue())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(sameInstant(DEFAULT_END_TIME))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHandoffsWithEagerRelationshipsIsEnabled() throws Exception {
        when(handoffRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHandoffMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(handoffRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHandoffsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(handoffRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHandoffMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(handoffRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getHandoff() throws Exception {
        // Initialize the database
        handoffRepository.saveAndFlush(handoff);

        // Get the handoff
        restHandoffMockMvc
            .perform(get(ENTITY_API_URL_ID, handoff.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(handoff.getId().intValue()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.startTime").value(sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(sameInstant(DEFAULT_END_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingHandoff() throws Exception {
        // Get the handoff
        restHandoffMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHandoff() throws Exception {
        // Initialize the database
        handoffRepository.saveAndFlush(handoff);

        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();

        // Update the handoff
        Handoff updatedHandoff = handoffRepository.findById(handoff.getId()).get();
        // Disconnect from session so that the updates on updatedHandoff are not directly saved in db
        em.detach(updatedHandoff);
        updatedHandoff.state(UPDATED_STATE).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restHandoffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHandoff.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHandoff))
            )
            .andExpect(status().isOk());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
        Handoff testHandoff = handoffList.get(handoffList.size() - 1);
        assertThat(testHandoff.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testHandoff.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testHandoff.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void putNonExistingHandoff() throws Exception {
        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();
        handoff.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHandoffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, handoff.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(handoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHandoff() throws Exception {
        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();
        handoff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHandoffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(handoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHandoff() throws Exception {
        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();
        handoff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHandoffMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(handoff)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHandoffWithPatch() throws Exception {
        // Initialize the database
        handoffRepository.saveAndFlush(handoff);

        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();

        // Update the handoff using partial update
        Handoff partialUpdatedHandoff = new Handoff();
        partialUpdatedHandoff.setId(handoff.getId());

        partialUpdatedHandoff.startTime(UPDATED_START_TIME);

        restHandoffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHandoff.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHandoff))
            )
            .andExpect(status().isOk());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
        Handoff testHandoff = handoffList.get(handoffList.size() - 1);
        assertThat(testHandoff.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testHandoff.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testHandoff.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void fullUpdateHandoffWithPatch() throws Exception {
        // Initialize the database
        handoffRepository.saveAndFlush(handoff);

        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();

        // Update the handoff using partial update
        Handoff partialUpdatedHandoff = new Handoff();
        partialUpdatedHandoff.setId(handoff.getId());

        partialUpdatedHandoff.state(UPDATED_STATE).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restHandoffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHandoff.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHandoff))
            )
            .andExpect(status().isOk());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
        Handoff testHandoff = handoffList.get(handoffList.size() - 1);
        assertThat(testHandoff.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testHandoff.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testHandoff.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingHandoff() throws Exception {
        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();
        handoff.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHandoffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, handoff.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(handoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHandoff() throws Exception {
        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();
        handoff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHandoffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(handoff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHandoff() throws Exception {
        int databaseSizeBeforeUpdate = handoffRepository.findAll().size();
        handoff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHandoffMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(handoff)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Handoff in the database
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHandoff() throws Exception {
        // Initialize the database
        handoffRepository.saveAndFlush(handoff);

        int databaseSizeBeforeDelete = handoffRepository.findAll().size();

        // Delete the handoff
        restHandoffMockMvc
            .perform(delete(ENTITY_API_URL_ID, handoff.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Handoff> handoffList = handoffRepository.findAll();
        assertThat(handoffList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
