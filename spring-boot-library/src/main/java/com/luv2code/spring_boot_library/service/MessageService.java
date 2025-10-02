package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.MessageRepository;
import com.luv2code.spring_boot_library.entity.Message;
import com.luv2code.spring_boot_library.requestmodel.AdminQuestionRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class MessageService {

    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail){
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        messageRepository.save(message);
    }

    public void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception{
        Optional<Message> foundMessage = messageRepository.findById(adminQuestionRequest.getId());

        if(!foundMessage.isPresent()){
            throw new Exception("Message not found");
        }

        foundMessage.get().setAdminEmail(userEmail);
        foundMessage.get().setResponse(adminQuestionRequest.getResponse());
        foundMessage.get().setClosed(true);

        messageRepository.save(foundMessage.get());
    }
}
