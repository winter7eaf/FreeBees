package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import uk.ac.bham.teamproject.domain.enumeration.ItemCondition;
import uk.ac.bham.teamproject.domain.enumeration.ItemState;

/**
 * A Item.
 */
@Entity
@Table(name = "item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 3)
    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false)
    private ItemCondition condition;

    @Lob
    @Column(name = "image", nullable = false)
    private byte[] image;

    @NotNull
    @Column(name = "image_content_type", nullable = false)
    private String imageContentType;

    @NotNull
    @Size(min = 3, max = 12)
    @Pattern(regexp = "^(GIR 0AA|[A-PR-UWYZ][A-HK-Y]?[0-9][ABEHMNPRVWXY0-9]? {0,1}[0-9][ABD-HJLNP-UW-Z]{2})$")
    @Column(name = "postcode", length = 12, nullable = false)
    private String postcode;

    @NotNull
    @Column(name = "upload_time", nullable = false)
    private ZonedDateTime uploadTime;

    @Column(name = "given_time")
    private ZonedDateTime givenTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private ItemState state;

    @ManyToOne(optional = false)
    @NotNull
    private User giver;

    @ManyToOne
    private User receiver;

    @ManyToMany
    @JoinTable(name = "rel_item__tag", joinColumns = @JoinColumn(name = "item_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "items", "users" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "item")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "item" }, allowSetters = true)
    private Set<ItemImage> images = new HashSet<>();

    @OneToMany(mappedBy = "item")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "requester", "requestee", "item" }, allowSetters = true)
    private Set<Request> requests = new HashSet<>();

    @OneToMany(mappedBy = "item")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rateToGiver", "rateToReceiver", "giver", "receiver", "item" }, allowSetters = true)
    private Set<Handoff> handoffs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Item id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Item title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Item description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ItemCondition getCondition() {
        return this.condition;
    }

    public Item condition(ItemCondition condition) {
        this.setCondition(condition);
        return this;
    }

    public void setCondition(ItemCondition condition) {
        this.condition = condition;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Item image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Item imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getPostcode() {
        return this.postcode;
    }

    public Item postcode(String postcode) {
        this.setPostcode(postcode);
        return this;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    public ZonedDateTime getUploadTime() {
        return this.uploadTime;
    }

    public Item uploadTime(ZonedDateTime uploadTime) {
        this.setUploadTime(uploadTime);
        return this;
    }

    public void setUploadTime(ZonedDateTime uploadTime) {
        this.uploadTime = uploadTime;
    }

    public ZonedDateTime getGivenTime() {
        return this.givenTime;
    }

    public Item givenTime(ZonedDateTime givenTime) {
        this.setGivenTime(givenTime);
        return this;
    }

    public void setGivenTime(ZonedDateTime givenTime) {
        this.givenTime = givenTime;
    }

    public ItemState getState() {
        return this.state;
    }

    public Item state(ItemState state) {
        this.setState(state);
        return this;
    }

    public void setState(ItemState state) {
        this.state = state;
    }

    public User getGiver() {
        return this.giver;
    }

    public void setGiver(User user) {
        this.giver = user;
    }

    public Item giver(User user) {
        this.setGiver(user);
        return this;
    }

    public User getReceiver() {
        return this.receiver;
    }

    public void setReceiver(User user) {
        this.receiver = user;
    }

    public Item receiver(User user) {
        this.setReceiver(user);
        return this;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Item tags(Set<Tag> tags) {
        this.setTags(tags);
        return this;
    }

    public Item addTag(Tag tag) {
        this.tags.add(tag);
        tag.getItems().add(this);
        return this;
    }

    public Item removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getItems().remove(this);
        return this;
    }

    public Set<ItemImage> getImages() {
        return this.images;
    }

    public void setImages(Set<ItemImage> itemImages) {
        if (this.images != null) {
            this.images.forEach(i -> i.setItem(null));
        }
        if (itemImages != null) {
            itemImages.forEach(i -> i.setItem(this));
        }
        this.images = itemImages;
    }

    public Item images(Set<ItemImage> itemImages) {
        this.setImages(itemImages);
        return this;
    }

    public Item addImage(ItemImage itemImage) {
        this.images.add(itemImage);
        itemImage.setItem(this);
        return this;
    }

    public Item removeImage(ItemImage itemImage) {
        this.images.remove(itemImage);
        itemImage.setItem(null);
        return this;
    }

    public Set<Request> getRequests() {
        return this.requests;
    }

    public void setRequests(Set<Request> requests) {
        if (this.requests != null) {
            this.requests.forEach(i -> i.setItem(null));
        }
        if (requests != null) {
            requests.forEach(i -> i.setItem(this));
        }
        this.requests = requests;
    }

    public Item requests(Set<Request> requests) {
        this.setRequests(requests);
        return this;
    }

    public Item addRequest(Request request) {
        this.requests.add(request);
        request.setItem(this);
        return this;
    }

    public Item removeRequest(Request request) {
        this.requests.remove(request);
        request.setItem(null);
        return this;
    }

    public Set<Handoff> getHandoffs() {
        return this.handoffs;
    }

    public void setHandoffs(Set<Handoff> handoffs) {
        if (this.handoffs != null) {
            this.handoffs.forEach(i -> i.setItem(null));
        }
        if (handoffs != null) {
            handoffs.forEach(i -> i.setItem(this));
        }
        this.handoffs = handoffs;
    }

    public Item handoffs(Set<Handoff> handoffs) {
        this.setHandoffs(handoffs);
        return this;
    }

    public Item addHandoff(Handoff handoff) {
        this.handoffs.add(handoff);
        handoff.setItem(this);
        return this;
    }

    public Item removeHandoff(Handoff handoff) {
        this.handoffs.remove(handoff);
        handoff.setItem(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Item)) {
            return false;
        }
        return id != null && id.equals(((Item) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Item{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", condition='" + getCondition() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", postcode='" + getPostcode() + "'" +
            ", uploadTime='" + getUploadTime() + "'" +
            ", givenTime='" + getGivenTime() + "'" +
            ", state='" + getState() + "'" +
            "}";
    }
}
