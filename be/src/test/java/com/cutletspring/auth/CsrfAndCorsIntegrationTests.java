package com.cutletspring.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
public class CsrfAndCorsIntegrationTests {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public CsrfAndCorsIntegrationTests(WebApplicationContext context) {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    @DisplayName("GET /auth/csrf without authentication returns 200 OK and valid CSRF token")
    void testGetAuthCsrfWithoutAuthentication() throws Exception {
        MvcResult result = mockMvc.perform(get("/auth/csrf")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isString())
                .andExpect(jsonPath("$.data.headerName").value("X-XSRF-TOKEN"))
                .andReturn();

        // Verify CSRF cookie is set
        assertNotNull(result.getResponse().getCookie("XSRF-TOKEN"));
        // Verify response header is set
        assertNotNull(result.getResponse().getHeader("X-XSRF-TOKEN"));
    }

    @Test
    @DisplayName("GET /api/auth/csrf without authentication returns 200 OK and valid CSRF token")
    void testGetApiAuthCsrfWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/auth/csrf")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.headerName").value("X-XSRF-TOKEN"));
    }

    @Test
    @DisplayName("GET /auth/csrf with Vercel origin returns correct CORS headers")
    void testCsrfCorsWithVercelOrigin() throws Exception {
        mockMvc.perform(get("/auth/csrf")
                        .header("Origin", "https://cutletspring.vercel.app")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://cutletspring.vercel.app"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }

    @Test
    @DisplayName("OPTIONS /auth/csrf preflight with Vercel origin returns 200 and CORS headers")
    void testCsrfPreflightWithVercelOrigin() throws Exception {
        mockMvc.perform(options("/auth/csrf")
                        .header("Origin", "https://cutletspring.vercel.app")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Content-Type,X-XSRF-TOKEN"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://cutletspring.vercel.app"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }

    @Test
    @DisplayName("OPTIONS preflight from unauthorized origin is rejected with 403 Forbidden")
    void testPreflightFromUnauthorizedOriginRejected() throws Exception {
        mockMvc.perform(options("/auth/csrf")
                        .header("Origin", "https://malicious-unauthorized-site.com")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /auth/csrf from unauthorized origin does not return Access-Control-Allow-Origin")
    void testGetFromUnauthorizedOriginNoCorsHeader() throws Exception {
        mockMvc.perform(get("/auth/csrf")
                        .header("Origin", "https://malicious-unauthorized-site.com"))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @Test
    @DisplayName("POST /auth/login without prior CSRF token works (ignored from CSRF) and returns session")
    void testLoginWithoutPriorCsrfToken() throws Exception {
        Map<String, String> credentials = Map.of(
                "email", "admin@cutletspring.com",
                "password", "admin123"
        );

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("admin@cutletspring.com"))
                .andReturn();

        assertNotNull(result.getRequest().getSession(false), "Session must be created upon login");
    }

    @Test
    @DisplayName("POST /api/auth/login without prior CSRF token works (ignored from CSRF)")
    void testApiLoginWithoutPriorCsrfToken() throws Exception {
        Map<String, String> credentials = Map.of(
                "email", "admin@cutletspring.com",
                "password", "admin123"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Public CMS and catalog endpoints without /api work without authentication")
    void testPublicEndpointsWithoutApiPrefix() throws Exception {
        mockMvc.perform(get("/public/header-footer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/public/homepage"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/restaurant/settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Admin logs in and updates menu item via PUT /api/admin/menu/{id}")
    void testAdminUpdateMenuItemWithSession() throws Exception {
        Map<String, String> credentials = Map.of(
                "email", "admin@cutletspring.com",
                "password", "admin123"
        );

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertNotNull(session, "Session must exist after login");

        var csrfCookie = loginResult.getResponse().getCookie("XSRF-TOKEN");
        String csrfToken = csrfCookie != null ? csrfCookie.getValue() : "test-token";

        // Fetch existing dish to construct valid update payload
        MvcResult dishResult = mockMvc.perform(get("/api/admin/menu/spring-signature-set")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn();

        String dishJson = dishResult.getResponse().getContentAsString();
        Map<String, Object> dishResponse = objectMapper.readValue(dishJson, Map.class);
        Map<String, Object> dishData = (Map<String, Object>) dishResponse.get("data");

        Map<String, Object> updatePayload = new java.util.HashMap<>(dishData);
        updatePayload.put("categoryId", "japanese");
        updatePayload.put("basePrice", 280);

        mockMvc.perform(put("/api/admin/menu/spring-signature-set")
                        .session(session)
                        .cookie(new jakarta.servlet.http.Cookie("XSRF-TOKEN", csrfToken))
                        .header("X-XSRF-TOKEN", csrfToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isOk());
    }

    private Map<String, Object> createSampleDishPayload(String id) {
        Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("id", id);
        payload.put("categoryId", "japanese");
        payload.put("basePrice", 220);
        payload.put("nameEn", "Truffle Tenderloin Katsu");
        payload.put("nameKr", "트러플 안심카츠");
        payload.put("nameVi", "Katsu Thăn Nội Truffle");
        payload.put("nameJp", "トリュフヒレカツ");
        payload.put("descriptionEn", "Special seasonal tonkatsu with real black truffle oil.");
        payload.put("descriptionKr", "신선한 블랙 트러플 오일을 곁들인 프리미엄 안심카츠.");
        payload.put("descriptionVi", "Món tonkatsu theo mùa đặc biệt cùng dầu nấm truffle đen thượng hạng.");
        payload.put("descriptionJp", "本物の黒トリュフオイルを添えた季節限定のプレミアムヒレカツ。");
        payload.put("portionEn", "1 serving (6 pieces)");
        payload.put("portionKr", "1인분 (6조각)");
        payload.put("portionVi", "1 phần (6 miếng)");
        payload.put("portionJp", "1人前 (6切)");
        payload.put("prepTimeMinutes", 15);
        payload.put("active", true);
        return payload;
    }

    @Test
    @DisplayName("Admin creates menu item via POST /api/admin/menu with valid session and CSRF token")
    void testAdminCreateMenuItemWithSession() throws Exception {
        Map<String, String> credentials = Map.of(
                "email", "admin@cutletspring.com",
                "password", "admin123"
        );

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertNotNull(session, "Session must exist after login");

        var csrfCookie = loginResult.getResponse().getCookie("XSRF-TOKEN");
        String csrfToken = csrfCookie != null ? csrfCookie.getValue() : "test-token";

        Map<String, Object> newDishPayload = createSampleDishPayload("test-crispy-cutlet-" + System.currentTimeMillis());

        mockMvc.perform(post("/api/admin/menu")
                        .session(session)
                        .header("X-XSRF-TOKEN", csrfToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newDishPayload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Admin updates menu item in cross-site context where XSRF-TOKEN cookie is omitted but session exists")
    void testAdminUpdateMenuItemCrossSiteWithoutCookie() throws Exception {
        Map<String, String> credentials = Map.of(
                "email", "admin@cutletspring.com",
                "password", "admin123"
        );

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertNotNull(session, "Session must exist after login");

        var csrfCookie = loginResult.getResponse().getCookie("XSRF-TOKEN");
        String csrfToken = csrfCookie != null ? csrfCookie.getValue() : "test-token";

        // Fetch existing dish to construct valid update payload
        MvcResult dishResult = mockMvc.perform(get("/api/admin/menu/spring-signature-set")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn();

        String dishJson = dishResult.getResponse().getContentAsString();
        Map<String, Object> dishResponse = objectMapper.readValue(dishJson, Map.class);
        Map<String, Object> dishData = (Map<String, Object>) dishResponse.get("data");

        Map<String, Object> updatePayload = new java.util.HashMap<>(dishData);
        updatePayload.put("categoryId", "japanese");
        updatePayload.put("basePrice", 295);

        // Perform PUT with session and X-XSRF-TOKEN header WITHOUT cookie (the production cross-site scenario)
        mockMvc.perform(put("/api/admin/menu/spring-signature-set")
                        .session(session)
                        .header("X-XSRF-TOKEN", csrfToken)
                        .header("Origin", "https://cutletspring.vercel.app")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Customer role session is rejected with 403 Forbidden on POST and PUT /api/admin/menu")
    void testCustomerRoleForbiddenOnAdminMenu() throws Exception {
        Map<String, Object> payload = createSampleDishPayload("customer-attempt-" + System.currentTimeMillis());

        mockMvc.perform(post("/api/admin/menu")
                        .with(user("customer@example.com").roles("CUSTOMER"))
                        .header("X-XSRF-TOKEN", "dummy-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));

        mockMvc.perform(put("/api/admin/menu/spring-signature-set")
                        .with(user("customer@example.com").roles("CUSTOMER"))
                        .header("X-XSRF-TOKEN", "dummy-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));
    }

    @Test
    @DisplayName("Unauthenticated request to POST or PUT /api/admin/menu is rejected")
    void testUnauthenticatedRequestToAdminMenuRejected() throws Exception {
        Map<String, Object> payload = Map.of("basePrice", 200);

        mockMvc.perform(post("/api/admin/menu")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isForbidden()); // CSRF or Auth entry point

        mockMvc.perform(put("/api/admin/menu/spring-signature-set")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin session with invalid CSRF token is rejected with 403 Forbidden")
    void testAdminSessionWithInvalidCsrfTokenRejected() throws Exception {
        Map<String, String> credentials = Map.of(
                "email", "admin@cutletspring.com",
                "password", "admin123"
        );

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertNotNull(session, "Session must exist after login");

        Map<String, Object> payload = createSampleDishPayload("invalid-csrf-test-" + System.currentTimeMillis());

        mockMvc.perform(post("/api/admin/menu")
                        .session(session)
                        .header("X-XSRF-TOKEN", "completely-wrong-csrf-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"))
                .andExpect(jsonPath("$.message").value("Invalid or missing CSRF token"));
    }
}

