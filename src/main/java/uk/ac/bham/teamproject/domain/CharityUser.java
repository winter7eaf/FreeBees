package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A CharityUser.
 */
@Entity
@Table(name = "charity_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CharityUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    // @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    // @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "charity_name")
    private String charityName;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "description")
    private String description;

    @Column(name = "logo_url")
    private String logoURL;

    @Column(name = "website")
    private String website;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CharityUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCharityName() {
        return this.charityName;
    }

    public CharityUser charityName(String charityName) {
        this.setCharityName(charityName);
        return this;
    }

    public void setCharityName(String charityName) {
        this.charityName = charityName;
    }

    public String getDescription() {
        return this.description;
    }

    public CharityUser description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLogoURL() {
        return this.logoURL;
    }

    public CharityUser logoURL(String logoURL) {
        this.setLogoURL(logoURL);
        return this;
    }

    public void setLogoURL(String logoURL) {
        this.logoURL = logoURL;
    }

    public String getWebsite() {
        return this.website;
    }

    public CharityUser website(String website) {
        this.setWebsite(website);
        return this;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CharityUser user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CharityUser)) {
            return false;
        }
        return id != null && id.equals(((CharityUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CharityUser{" +
            "id=" + getId() +
            ", charityName='" + getCharityName() + "'" +
            ", description='" + getDescription() + "'" +
            ", logoURL='" + getLogoURL() + "'" +
            ", website='" + getWebsite() + "'" +
            "}";
    }
}
