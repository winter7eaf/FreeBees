package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import uk.ac.bham.teamproject.domain.RateRecord;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.repository.RateRecordRepository;

/**
 * Integration tests for the {@link RateRecordResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RateRecordResourceIT {

    private static final Integer DEFAULT_RATE_VALUE = 0;
    private static final Integer UPDATED_RATE_VALUE = 1;

    private static final String ENTITY_API_URL = "/api/rate-records";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RateRecordRepository rateRecordRepository;

    @Mock
    private RateRecordRepository rateRecordRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRateRecordMockMvc;

    private RateRecord rateRecord;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RateRecord createEntity(EntityManager em) {
        RateRecord rateRecord = new RateRecord().rateValue(DEFAULT_RATE_VALUE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        rateRecord.setRater(user);
        // Add required entity
        rateRecord.setRatee(user);
        // Add required entity
        Handoff handoff;
        if (TestUtil.findAll(em, Handoff.class).isEmpty()) {
            handoff = HandoffResourceIT.createEntity(em);
            em.persist(handoff);
            em.flush();
        } else {
            handoff = TestUtil.findAll(em, Handoff.class).get(0);
        }
        rateRecord.setHandoffRef(handoff);
        return rateRecord;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RateRecord createUpdatedEntity(EntityManager em) {
        RateRecord rateRecord = new RateRecord().rateValue(UPDATED_RATE_VALUE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        rateRecord.setRater(user);
        // Add required entity
        rateRecord.setRatee(user);
        // Add required entity
        Handoff handoff;
        if (TestUtil.findAll(em, Handoff.class).isEmpty()) {
            handoff = HandoffResourceIT.createUpdatedEntity(em);
            em.persist(handoff);
            em.flush();
        } else {
            handoff = TestUtil.findAll(em, Handoff.class).get(0);
        }
        rateRecord.setHandoffRef(handoff);
        return rateRecord;
    }

    @BeforeEach
    public void initTest() {
        rateRecord = createEntity(em);
    }

    @Test
    @Transactional
    void createRateRecord() throws Exception {
        int databaseSizeBeforeCreate = rateRecordRepository.findAll().size();
        // Create the RateRecord
        restRateRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rateRecord)))
            .andExpect(status().isCreated());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeCreate + 1);
        RateRecord testRateRecord = rateRecordList.get(rateRecordList.size() - 1);
        assertThat(testRateRecord.getRateValue()).isEqualTo(DEFAULT_RATE_VALUE);
    }

    @Test
    @Transactional
    void createRateRecordWithExistingId() throws Exception {
        // Create the RateRecord with an existing ID
        rateRecord.setId(1L);

        int databaseSizeBeforeCreate = rateRecordRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRateRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rateRecord)))
            .andExpect(status().isBadRequest());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRateValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = rateRecordRepository.findAll().size();
        // set the field null
        rateRecord.setRateValue(null);

        // Create the RateRecord, which fails.

        restRateRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rateRecord)))
            .andExpect(status().isBadRequest());

        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRateRecords() throws Exception {
        // Initialize the database
        rateRecordRepository.saveAndFlush(rateRecord);

        // Get all the rateRecordList
        restRateRecordMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rateRecord.getId().intValue())))
            .andExpect(jsonPath("$.[*].rateValue").value(hasItem(DEFAULT_RATE_VALUE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRateRecordsWithEagerRelationshipsIsEnabled() throws Exception {
        when(rateRecordRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRateRecordMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(rateRecordRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRateRecordsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(rateRecordRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRateRecordMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(rateRecordRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getRateRecord() throws Exception {
        // Initialize the database
        rateRecordRepository.saveAndFlush(rateRecord);

        // Get the rateRecord
        restRateRecordMockMvc
            .perform(get(ENTITY_API_URL_ID, rateRecord.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rateRecord.getId().intValue()))
            .andExpect(jsonPath("$.rateValue").value(DEFAULT_RATE_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingRateRecord() throws Exception {
        // Get the rateRecord
        restRateRecordMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRateRecord() throws Exception {
        // Initialize the database
        rateRecordRepository.saveAndFlush(rateRecord);

        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();

        // Update the rateRecord
        RateRecord updatedRateRecord = rateRecordRepository.findById(rateRecord.getId()).get();
        // Disconnect from session so that the updates on updatedRateRecord are not directly saved in db
        em.detach(updatedRateRecord);
        updatedRateRecord.rateValue(UPDATED_RATE_VALUE);

        restRateRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRateRecord.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRateRecord))
            )
            .andExpect(status().isOk());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
        RateRecord testRateRecord = rateRecordList.get(rateRecordList.size() - 1);
        assertThat(testRateRecord.getRateValue()).isEqualTo(UPDATED_RATE_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingRateRecord() throws Exception {
        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();
        rateRecord.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRateRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rateRecord.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rateRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRateRecord() throws Exception {
        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();
        rateRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRateRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rateRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRateRecord() throws Exception {
        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();
        rateRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRateRecordMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rateRecord)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRateRecordWithPatch() throws Exception {
        // Initialize the database
        rateRecordRepository.saveAndFlush(rateRecord);

        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();

        // Update the rateRecord using partial update
        RateRecord partialUpdatedRateRecord = new RateRecord();
        partialUpdatedRateRecord.setId(rateRecord.getId());

        restRateRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRateRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRateRecord))
            )
            .andExpect(status().isOk());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
        RateRecord testRateRecord = rateRecordList.get(rateRecordList.size() - 1);
        assertThat(testRateRecord.getRateValue()).isEqualTo(DEFAULT_RATE_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateRateRecordWithPatch() throws Exception {
        // Initialize the database
        rateRecordRepository.saveAndFlush(rateRecord);

        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();

        // Update the rateRecord using partial update
        RateRecord partialUpdatedRateRecord = new RateRecord();
        partialUpdatedRateRecord.setId(rateRecord.getId());

        partialUpdatedRateRecord.rateValue(UPDATED_RATE_VALUE);

        restRateRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRateRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRateRecord))
            )
            .andExpect(status().isOk());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
        RateRecord testRateRecord = rateRecordList.get(rateRecordList.size() - 1);
        assertThat(testRateRecord.getRateValue()).isEqualTo(UPDATED_RATE_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingRateRecord() throws Exception {
        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();
        rateRecord.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRateRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rateRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rateRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRateRecord() throws Exception {
        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();
        rateRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRateRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rateRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRateRecord() throws Exception {
        int databaseSizeBeforeUpdate = rateRecordRepository.findAll().size();
        rateRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRateRecordMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(rateRecord))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RateRecord in the database
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRateRecord() throws Exception {
        // Initialize the database
        rateRecordRepository.saveAndFlush(rateRecord);

        int databaseSizeBeforeDelete = rateRecordRepository.findAll().size();

        // Delete the rateRecord
        restRateRecordMockMvc
            .perform(delete(ENTITY_API_URL_ID, rateRecord.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RateRecord> rateRecordList = rateRecordRepository.findAll();
        assertThat(rateRecordList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
