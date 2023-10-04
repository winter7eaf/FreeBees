package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Tag.
 */
@Entity
@Table(name = "tag")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Tag implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 2)
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "tags")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "giver", "receiver", "tags", "images", "requests", "handoffs" }, allowSetters = true)
    private Set<Item> items = new HashSet<>();

    @ManyToMany(mappedBy = "lookingfors")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "lookingfors" }, allowSetters = true)
    private Set<UserProfile> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tag id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Tag name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Item> getItems() {
        return this.items;
    }

    public void setItems(Set<Item> items) {
        if (this.items != null) {
            this.items.forEach(i -> i.removeTag(this));
        }
        if (items != null) {
            items.forEach(i -> i.addTag(this));
        }
        this.items = items;
    }

    public Tag items(Set<Item> items) {
        this.setItems(items);
        return this;
    }

    public Tag addItem(Item item) {
        this.items.add(item);
        item.getTags().add(this);
        return this;
    }

    public Tag removeItem(Item item) {
        this.items.remove(item);
        item.getTags().remove(this);
        return this;
    }

    public Set<UserProfile> getUsers() {
        return this.users;
    }

    public void setUsers(Set<UserProfile> userProfiles) {
        if (this.users != null) {
            this.users.forEach(i -> i.removeLookingfor(this));
        }
        if (userProfiles != null) {
            userProfiles.forEach(i -> i.addLookingfor(this));
        }
        this.users = userProfiles;
    }

    public Tag users(Set<UserProfile> userProfiles) {
        this.setUsers(userProfiles);
        return this;
    }

    public Tag addUser(UserProfile userProfile) {
        this.users.add(userProfile);
        userProfile.getLookingfors().add(this);
        return this;
    }

    public Tag removeUser(UserProfile userProfile) {
        this.users.remove(userProfile);
        userProfile.getLookingfors().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tag)) {
            return false;
        }
        return id != null && id.equals(((Tag) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tag{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
