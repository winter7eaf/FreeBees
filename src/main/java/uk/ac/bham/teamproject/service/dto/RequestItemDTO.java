package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

public class RequestItemDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(min = 3)
    private String title;

    @NotNull
    @Size(min = 3, max = 12)
    @Pattern(regexp = "^(GIR 0AA|[A-PR-UWYZ][A-HK-Y]?[0-9][ABEHMNPRVWXY0-9]? {0,1}[0-9][ABD-HJLNP-UW-Z]{2})$")
    private String postcode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RequestItemDTO)) {
            return false;
        }

        RequestItemDTO requestItemDTO = (RequestItemDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, requestItemDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return "ItemDTO{" + "id=" + getId() + ", title='" + getTitle() + "'" + ", postcode='" + getPostcode() + "'" + "}";
    }
}
