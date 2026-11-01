package com.cutletspring.email.service;

import com.cutletspring.email.dto.EmailConfigResponse;
import com.cutletspring.email.dto.UpdateEmailConfigRequest;
import com.cutletspring.email.entity.EmailConfiguration;

public interface EmailConfigurationService {

    EmailConfiguration getConfiguration();

    EmailConfigResponse getConfigResponse();

    EmailConfigResponse updateConfiguration(UpdateEmailConfigRequest request);

    String getDecryptedPassword(EmailConfiguration config);

    void testConnection();
}
