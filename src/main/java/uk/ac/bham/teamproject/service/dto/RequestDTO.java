package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.validation.constraints.*;
import uk.ac.bham.teamproject.domain.enumeration.RequestState;
import uk.ac.bham.teamproject.domain.enumeration.RequestType;

@SuppressWarnings("common-java:DuplicatedBlocks")
public class RequestDTO implements Serializable {

    private Long id;

    @NotNull
    private RequestType type;

    @NotNull
    private RequestState state;

    @NotNull
    private ZonedDateTime sentTime;

    @NotNull
    private ZonedDateTime expiryTime;

    private ZonedDateTime responseTime;

    private RequestUserDTO requester;

    private RequestUserDTO requestee;

    private RequestItemDTO item;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RequestType getType() {
        return type;
    }

    public void setType(RequestType type) {
        this.type = type;
    }

    public RequestState getState() {
        return state;
    }

    public void setState(RequestState state) {
        this.state = state;
    }

    public ZonedDateTime getSentTime() {
        return sentTime;
    }

    public void setSentTime(ZonedDateTime sentTime) {
        this.sentTime = sentTime;
    }

    public ZonedDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(ZonedDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public ZonedDateTime getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(ZonedDateTime responseTime) {
        this.responseTime = responseTime;
    }

    public RequestUserDTO getRequester() {
        return requester;
    }

    public void setRequester(RequestUserDTO requester) {
        this.requester = requester;
    }

    public RequestUserDTO getRequestee() {
        return requestee;
    }

    public void setRequestee(RequestUserDTO requestee) {
        this.requestee = requestee;
    }

    public RequestItemDTO getItem() {
        return item;
    }

    public void setItem(RequestItemDTO item) {
        this.item = item;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RequestDTO)) {
            return false;
        }

        RequestDTO requestDTO = (RequestDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, requestDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RequestDTO{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", state='" + getState() + "'" +
            ", sentTime='" + getSentTime() + "'" +
            ", expiryTime='" + getExpiryTime() + "'" +
            ", responseTime='" + getResponseTime() + "'" +
            ", requester=" + getRequester() +
            ", requestee=" + getRequestee() +
            ", item=" + getItem() +
            "}";
    }
}
