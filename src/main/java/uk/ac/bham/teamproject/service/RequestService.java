package uk.ac.bham.teamproject.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.config.Constants;
import uk.ac.bham.teamproject.domain.Item;
import uk.ac.bham.teamproject.domain.Request;
import uk.ac.bham.teamproject.domain.enumeration.RequestState;
import uk.ac.bham.teamproject.domain.enumeration.RequestType;
import uk.ac.bham.teamproject.repository.RequestRepository;
import uk.ac.bham.teamproject.repository.UserRepository;
import uk.ac.bham.teamproject.service.dto.RequestDTO;
import uk.ac.bham.teamproject.service.dto.UserDTO;
import uk.ac.bham.teamproject.service.mapper.RequestMapper;
import uk.ac.bham.teamproject.service.mapper.UserMapper;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

@Service
@Transactional
public class RequestService {

    private final Logger log = LoggerFactory.getLogger(RequestService.class);

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final RequestMapper requestMapper;
    private final UserMapper userMapper;

    public RequestService(
        RequestRepository requestRepository,
        UserRepository userRepository,
        RequestMapper requestMapper,
        UserMapper userMapper
    ) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.requestMapper = requestMapper;
        this.userMapper = userMapper;
    }

    public RequestDTO createReceiveItemRequest(String requesterLogin, Item item) {
        checkRepeatRequest(item.getId(), item.getGiver().getLogin());
        Request request = new Request();
        request.setType(RequestType.REQUEST_TO_RECEIVE);
        request.setState(RequestState.PENDING);
        request.setSentTime(ZonedDateTime.now());
        request.setExpiryTime(ZonedDateTime.now().plusSeconds(Constants.REQUEST_EXPIRY_TIME));
        userRepository
            .findOneByLogin(requesterLogin)
            .ifPresentOrElse(
                request::setRequester,
                () -> {
                    throw new BadRequestAlertException("Unknown requester", "user", "idnotfound");
                }
            );
        request.setItem(item);
        request.setRequestee(item.getGiver());
        requestRepository.save(request);
        return requestMapper.toDto(request);
    }

    public RequestDTO createGiveItemRequest(String requesterLogin, String requesteeLogin, Item item) {
        checkRepeatRequest(item.getId(), requesteeLogin);
        Request request = new Request();
        request.setType(RequestType.REQUEST_TO_GIVE);
        request.setState(RequestState.PENDING);
        request.setSentTime(ZonedDateTime.now());
        request.setExpiryTime(ZonedDateTime.now().plusSeconds(Constants.REQUEST_EXPIRY_TIME));
        userRepository
            .findOneByLogin(requesterLogin)
            .ifPresentOrElse(
                request::setRequester,
                () -> {
                    throw new BadRequestAlertException("Unknown requester", "user", "idnotfound");
                }
            );
        userRepository
            .findOneByLogin(requesteeLogin)
            .ifPresentOrElse(
                request::setRequestee,
                () -> {
                    throw new BadRequestAlertException("requestee not found", "user", "idnotfound");
                }
            );
        request.setItem(item);
        requestRepository.save(request);
        return requestMapper.toDto(request);
    }

    public RequestDTO responseRequest(Long id, boolean isAccept) {
        RequestDTO requestDTO = requestMapper.toDto(requestRepository.getReferenceById(id));
        if (isAccept) {
            requestDTO.setState(RequestState.ACCEPTED);
        } else {
            requestDTO.setState(RequestState.REJECTED);
        }
        requestRepository.save(requestMapper.toEntity(requestDTO));
        return requestDTO;
    }

    @Transactional(readOnly = true)
    public List<RequestDTO> receiveRequest() {
        return requestRepository.findByRequesteeIsCurrentUserAndPending().stream().map(requestMapper::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RequestDTO> getAllRequest() {
        return requestRepository.findByRequesterOrRequesteeIsCurrentUser().stream().map(requestMapper::toDto).collect(Collectors.toList());
    }

    public void checkRepeatRequest(Long itemId, String requesteeLogin) {
        requestRepository
            .findByItemIdAndRequesteeLoginAndStateEquals(itemId, requesteeLogin, RequestState.PENDING)
            .ifPresent(request -> {
                throw new BadRequestAlertException("repeat request", "request", "repeat");
            });
    }
}
