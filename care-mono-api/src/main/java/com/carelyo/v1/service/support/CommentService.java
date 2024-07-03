package com.carelyo.v1.service.support;

import com.carelyo.v1.model.support.SupportComments;
import com.carelyo.v1.repos.support.CommentsRepository;
import java.util.Optional;
// import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
// @Slf4j
public class CommentService {

  private final CommentsRepository commentsRepository;

  public CommentService(CommentsRepository commentsRepository) {
    this.commentsRepository = commentsRepository;
  }


  public void createComment(Long userId, Long ticketId, String message) {
    if (commentExists(ticketId, userId, message)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate comment");
    }
    SupportComments comment = new SupportComments();
    comment.setUserId(userId);
    comment.setTicketId(ticketId);
    comment.setMessage(message);
    commentsRepository.save(comment);
  }


  public void updateComment(Long id, String message) {
    Optional<SupportComments> comment = getCommentById(id);
    if (comment.isPresent()) {
      comment.get().setMessage(message);
      commentsRepository.save(comment.get());
      return;
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
  }

  public void permanentlyDeleteComment(Long id) {
    Optional<SupportComments> comment = getCommentById(id);
    if (comment.isPresent()) {
      commentsRepository.delete(comment.get());
      return;
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
  }


  public Page<SupportComments> getCommentsByUserId(Long id, Pageable pageable) {
    return commentsRepository.findAllByUserId(id, pageable);
  }

  public void toggleCommentVisibility(Long id) {
    Optional<SupportComments> comment = getCommentById(id);
    if (comment.isPresent()) {
      comment.get().setHidden(!comment.get().getHidden());
      commentsRepository.save(comment.get());
    }
  }

  private Optional<SupportComments> getCommentById(Long id) {
    return commentsRepository.findById(id);
  }

  private Boolean commentExists(Long ticketId, Long userId, String message) {
    return commentsRepository.findByTicketIdAndUserIdAndMessage(ticketId, userId, message).isPresent();
  }

}
