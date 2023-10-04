package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.Item;
import uk.ac.bham.teamproject.domain.ItemImage;
import uk.ac.bham.teamproject.repository.ItemImageRepository;

/**
 * Integration tests for the {@link ItemImageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemImageResourceIT {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/item-images";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemImageRepository itemImageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemImageMockMvc;

    private ItemImage itemImage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemImage createEntity(EntityManager em) {
        ItemImage itemImage = new ItemImage().image(DEFAULT_IMAGE).imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        // Add required entity
        Item item;
        if (TestUtil.findAll(em, Item.class).isEmpty()) {
            item = ItemResourceIT.createEntity(em);
            em.persist(item);
            em.flush();
        } else {
            item = TestUtil.findAll(em, Item.class).get(0);
        }
        itemImage.setItem(item);
        return itemImage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemImage createUpdatedEntity(EntityManager em) {
        ItemImage itemImage = new ItemImage().image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        // Add required entity
        Item item;
        if (TestUtil.findAll(em, Item.class).isEmpty()) {
            item = ItemResourceIT.createUpdatedEntity(em);
            em.persist(item);
            em.flush();
        } else {
            item = TestUtil.findAll(em, Item.class).get(0);
        }
        itemImage.setItem(item);
        return itemImage;
    }

    @BeforeEach
    public void initTest() {
        itemImage = createEntity(em);
    }

    @Test
    @Transactional
    void createItemImage() throws Exception {
        int databaseSizeBeforeCreate = itemImageRepository.findAll().size();
        // Create the ItemImage
        restItemImageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemImage)))
            .andExpect(status().isCreated());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeCreate + 1);
        ItemImage testItemImage = itemImageList.get(itemImageList.size() - 1);
        assertThat(testItemImage.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testItemImage.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createItemImageWithExistingId() throws Exception {
        // Create the ItemImage with an existing ID
        itemImage.setId(1L);

        int databaseSizeBeforeCreate = itemImageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemImageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemImage)))
            .andExpect(status().isBadRequest());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItemImages() throws Exception {
        // Initialize the database
        itemImageRepository.saveAndFlush(itemImage);

        // Get all the itemImageList
        restItemImageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemImage.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    void getItemImage() throws Exception {
        // Initialize the database
        itemImageRepository.saveAndFlush(itemImage);

        // Get the itemImage
        restItemImageMockMvc
            .perform(get(ENTITY_API_URL_ID, itemImage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemImage.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingItemImage() throws Exception {
        // Get the itemImage
        restItemImageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemImage() throws Exception {
        // Initialize the database
        itemImageRepository.saveAndFlush(itemImage);

        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();

        // Update the itemImage
        ItemImage updatedItemImage = itemImageRepository.findById(itemImage.getId()).get();
        // Disconnect from session so that the updates on updatedItemImage are not directly saved in db
        em.detach(updatedItemImage);
        updatedItemImage.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restItemImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemImage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemImage))
            )
            .andExpect(status().isOk());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
        ItemImage testItemImage = itemImageList.get(itemImageList.size() - 1);
        assertThat(testItemImage.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testItemImage.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingItemImage() throws Exception {
        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();
        itemImage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemImage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemImage() throws Exception {
        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();
        itemImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemImage() throws Exception {
        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();
        itemImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemImageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemImage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemImageWithPatch() throws Exception {
        // Initialize the database
        itemImageRepository.saveAndFlush(itemImage);

        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();

        // Update the itemImage using partial update
        ItemImage partialUpdatedItemImage = new ItemImage();
        partialUpdatedItemImage.setId(itemImage.getId());

        restItemImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemImage))
            )
            .andExpect(status().isOk());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
        ItemImage testItemImage = itemImageList.get(itemImageList.size() - 1);
        assertThat(testItemImage.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testItemImage.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateItemImageWithPatch() throws Exception {
        // Initialize the database
        itemImageRepository.saveAndFlush(itemImage);

        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();

        // Update the itemImage using partial update
        ItemImage partialUpdatedItemImage = new ItemImage();
        partialUpdatedItemImage.setId(itemImage.getId());

        partialUpdatedItemImage.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restItemImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemImage))
            )
            .andExpect(status().isOk());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
        ItemImage testItemImage = itemImageList.get(itemImageList.size() - 1);
        assertThat(testItemImage.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testItemImage.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingItemImage() throws Exception {
        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();
        itemImage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemImage() throws Exception {
        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();
        itemImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemImage() throws Exception {
        int databaseSizeBeforeUpdate = itemImageRepository.findAll().size();
        itemImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemImageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itemImage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemImage in the database
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemImage() throws Exception {
        // Initialize the database
        itemImageRepository.saveAndFlush(itemImage);

        int databaseSizeBeforeDelete = itemImageRepository.findAll().size();

        // Delete the itemImage
        restItemImageMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemImage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemImage> itemImageList = itemImageRepository.findAll();
        assertThat(itemImageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
