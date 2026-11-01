package com.cutletspring.restaurant.service;

import com.cutletspring.account.service.AccountAuditLogService;
import com.cutletspring.cloudinary.dto.CloudinaryUploadResult;
import com.cutletspring.cloudinary.service.CloudinaryService;
import com.cutletspring.restaurant.dto.RestaurantSettingsDto;
import com.cutletspring.restaurant.dto.UpdateRestaurantSettingsRequest;
import com.cutletspring.restaurant.entity.RestaurantSettings;
import com.cutletspring.restaurant.mapper.RestaurantSettingsMapper;
import com.cutletspring.restaurant.repository.RestaurantSettingsRepository;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantSettingsService {

    private final RestaurantSettingsRepository settingsRepository;
    private final RestaurantSettingsMapper settingsMapper;
    private final CloudinaryService cloudinaryService;
    private final AccountAuditLogService auditLogService;

    @Transactional(readOnly = true)
    public RestaurantSettingsDto getSettings() {
        RestaurantSettings settings = settingsRepository.findDefault()
                .orElseGet(this::createFallbackSettings);
        return settingsMapper.toDto(settings);
    }

    @Transactional
    public RestaurantSettingsDto updateSettings(UpdateRestaurantSettingsRequest request, String adminEmail) {
        RestaurantSettings settings = settingsRepository.findDefault()
                .orElseGet(this::createFallbackSettings);

        settings.setNameEn(request.getNameEn().trim());
        settings.setNameKr(request.getNameKr().trim());
        settings.setNameVi(request.getNameVi().trim());
        settings.setNameJp(request.getNameJp().trim());

        settings.setSloganEn(request.getSloganEn());
        settings.setSloganKr(request.getSloganKr());
        settings.setSloganVi(request.getSloganVi());
        settings.setSloganJp(request.getSloganJp());

        settings.setDescriptionEn(request.getDescriptionEn());
        settings.setDescriptionKr(request.getDescriptionKr());
        settings.setDescriptionVi(request.getDescriptionVi());
        settings.setDescriptionJp(request.getDescriptionJp());

        settings.setAddressEn(request.getAddressEn().trim());
        settings.setAddressKr(request.getAddressKr().trim());
        settings.setAddressVi(request.getAddressVi().trim());
        settings.setAddressJp(request.getAddressJp().trim());

        settings.setPhoneNumber(request.getPhoneNumber().trim());
        settings.setEmail(request.getEmail().trim());

        settings.setOpeningHourLunchStart(request.getOpeningHourLunchStart().trim());
        settings.setOpeningHourLunchEnd(request.getOpeningHourLunchEnd().trim());
        settings.setOpeningHourDinnerStart(request.getOpeningHourDinnerStart().trim());
        settings.setOpeningHourDinnerEnd(request.getOpeningHourDinnerEnd().trim());
        settings.setLastOrderTime(request.getLastOrderTime().trim());

        settings.setClosedDaysEn(request.getClosedDaysEn());
        settings.setClosedDaysKr(request.getClosedDaysKr());
        settings.setClosedDaysVi(request.getClosedDaysVi());
        settings.setClosedDaysJp(request.getClosedDaysJp());

        settings.setHolidayNoticeEn(request.getHolidayNoticeEn());
        settings.setHolidayNoticeKr(request.getHolidayNoticeKr());
        settings.setHolidayNoticeVi(request.getHolidayNoticeVi());
        settings.setHolidayNoticeJp(request.getHolidayNoticeJp());

        settings.setPolicyOneDishEn(request.getPolicyOneDishEn());
        settings.setPolicyOneDishKr(request.getPolicyOneDishKr());
        settings.setPolicyOneDishVi(request.getPolicyOneDishVi());
        settings.setPolicyOneDishJp(request.getPolicyOneDishJp());

        settings.setPolicyVatEn(request.getPolicyVatEn());
        settings.setPolicyVatKr(request.getPolicyVatKr());
        settings.setPolicyVatVi(request.getPolicyVatVi());
        settings.setPolicyVatJp(request.getPolicyVatJp());

        settings.setPolicyTakeoutEn(request.getPolicyTakeoutEn());
        settings.setPolicyTakeoutKr(request.getPolicyTakeoutKr());
        settings.setPolicyTakeoutVi(request.getPolicyTakeoutVi());
        settings.setPolicyTakeoutJp(request.getPolicyTakeoutJp());

        if (request.getVatRate() != null) settings.setVatRate(request.getVatRate());
        if (request.getDefaultPrepMinutes() != null) settings.setDefaultPrepMinutes(request.getDefaultPrepMinutes());
        if (request.getCapacityHall() != null) settings.setCapacityHall(request.getCapacityHall());
        if (request.getCapacityCounter() != null) settings.setCapacityCounter(request.getCapacityCounter());

        if (request.getGoogleRating() != null) settings.setGoogleRating(request.getGoogleRating());
        if (request.getGoogleReviewCount() != null) settings.setGoogleReviewCount(request.getGoogleReviewCount());
        if (request.getGoogleMapsUrl() != null) settings.setGoogleMapsUrl(request.getGoogleMapsUrl().trim());
        if (request.getGoogleMapsEmbedUrl() != null) settings.setGoogleMapsEmbedUrl(request.getGoogleMapsEmbedUrl().trim());
        if (request.getEstablishedYear() != null) settings.setEstablishedYear(request.getEstablishedYear().trim());
        if (request.getCopyrightTextEn() != null) settings.setCopyrightTextEn(request.getCopyrightTextEn());
        if (request.getCopyrightTextKr() != null) settings.setCopyrightTextKr(request.getCopyrightTextKr());
        if (request.getCopyrightTextVi() != null) settings.setCopyrightTextVi(request.getCopyrightTextVi());
        if (request.getCopyrightTextJp() != null) settings.setCopyrightTextJp(request.getCopyrightTextJp());
        if (request.getHotlineVisible() != null) settings.setHotlineVisible(request.getHotlineVisible());

        settings.setUpdatedAt(Instant.now());
        settings.setUpdatedBy(adminEmail);

        RestaurantSettings saved = settingsRepository.save(settings);

        auditLogService.record(
                adminEmail,
                null,
                "UPDATE_RESTAURANT_SETTINGS",
                "RESTAURANT_SETTINGS",
                "default",
                "Updated Cutlet Spring restaurant profile, service hours, and dining policies",
                null
        );

        return settingsMapper.toDto(saved);
    }

    @Transactional
    public RestaurantSettingsDto uploadLogo(MultipartFile file, String adminEmail) {
        RestaurantSettings settings = settingsRepository.findDefault()
                .orElseGet(this::createFallbackSettings);

        if (settings.getLogoPublicId() != null && !settings.getLogoPublicId().isBlank()) {
            cloudinaryService.deleteImage(settings.getLogoPublicId());
        }

        CloudinaryUploadResult result = cloudinaryService.uploadImage(file);
        settings.setLogoUrl(result.getSecureUrl());
        settings.setLogoPublicId(result.getPublicId());
        settings.setUpdatedAt(Instant.now());
        settings.setUpdatedBy(adminEmail);

        RestaurantSettings saved = settingsRepository.save(settings);

        auditLogService.record(
                adminEmail,
                null,
                "UPLOAD_LOGO",
                "RESTAURANT_SETTINGS",
                "default",
                "Uploaded new atelier logo: " + result.getSecureUrl(),
                null
        );

        return settingsMapper.toDto(saved);
    }

    @Transactional
    public RestaurantSettingsDto uploadBanner(MultipartFile file, String adminEmail) {
        RestaurantSettings settings = settingsRepository.findDefault()
                .orElseGet(this::createFallbackSettings);

        if (settings.getBannerPublicId() != null && !settings.getBannerPublicId().isBlank()) {
            cloudinaryService.deleteImage(settings.getBannerPublicId());
        }

        CloudinaryUploadResult result = cloudinaryService.uploadImage(file);
        settings.setBannerUrl(result.getSecureUrl());
        settings.setBannerPublicId(result.getPublicId());
        settings.setUpdatedAt(Instant.now());
        settings.setUpdatedBy(adminEmail);

        RestaurantSettings saved = settingsRepository.save(settings);

        auditLogService.record(
                adminEmail,
                null,
                "UPLOAD_BANNER",
                "RESTAURANT_SETTINGS",
                "default",
                "Uploaded new atelier hero banner: " + result.getSecureUrl(),
                null
        );

        return settingsMapper.toDto(saved);
    }

    private RestaurantSettings createFallbackSettings() {
        RestaurantSettings fallback = RestaurantSettings.builder()
                .id("default")
                .nameEn("CUTLET SPRING")
                .nameKr("봄돈까스")
                .nameVi("CUTLET SPRING")
                .nameJp("カツスプリング")
                .sloganEn("Artisanal Tonkatsu Atelier")
                .sloganKr("프리미엄 수제 돈카츠 아틀리에")
                .sloganVi("Xưởng Nghệ Thuật Tonkatsu Thủ Công")
                .sloganJp("職人技が光る手作りとんかつアトリエ")
                .descriptionEn("An artisanal Japanese-Korean Tonkatsu atelier crafting precision-fried golden cutlets with heritage culinary discipline.")
                .descriptionKr("타협 없는 정통 기법과 엄선된 원육으로 빚어내는 프리미엄 일식-경양식 수제 돈카츠 아틀리에입니다.")
                .descriptionVi("Nhà hàng Tonkatsu phong cách Nhật-Hàn thủ công, kết hợp tinh hoa ẩm thực truyền thống với tiêu chuẩn chiên giòn đỉnh cao.")
                .descriptionJp("厳選された豚肉と職人技のパン粉づけで揚げる、日韓フュージョン本格手作りとんかつ専門店です。")
                .addressEn("6A Street 9, Thao Dien Ward, Thu Duc City, Ho Chi Minh City")
                .addressKr("호치민시 투득시 타오디엔 9번가 6A")
                .addressVi("6A Đường số 9, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh")
                .addressJp("ホーチミン市トゥードゥック市タオディエン9番通り6A")
                .phoneNumber("039 376 2717")
                .email("contact@cutletspring.com")
                .openingHourLunchStart("11:00")
                .openingHourLunchEnd("15:00")
                .openingHourDinnerStart("17:00")
                .openingHourDinnerEnd("21:00")
                .lastOrderTime("20:30")
                .closedDaysEn("Open Daily (No Regular Closing Days)")
                .closedDaysKr("연중무휴")
                .closedDaysVi("Mở cửa cả tuần (Không ngày nghỉ)")
                .closedDaysJp("年中無休")
                .policyOneDishEn("One main dish requirement per seated guest")
                .policyOneDishKr("1인 1메뉴 주문 필수")
                .policyOneDishVi("Mỗi thực khách dùng bữa tại chỗ vui lòng gọi tối thiểu một món chính")
                .policyOneDishJp("ご着席のお客様1名様につきメインディッシュ1品のご注文をお願いしております")
                .policyVatEn("8% VAT is not included in list prices")
                .policyVatKr("메뉴 가격에 8% 부가세(VAT) 미포함")
                .policyVatVi("Giá niêm yết chưa bao gồm 8% thuế GTGT (VAT)")
                .policyVatJp("表示価格には8%の付加価値税(VAT)は含まれておりません")
                .policyTakeoutEn("Takeout packaging retains crispness up to 30 mins")
                .policyTakeoutKr("포장 주문 시 30분 동안 바삭한 식감이 유지됩니다")
                .policyTakeoutVi("Bao bì mang về giữ độ giòn tối ưu trong 30 phút")
                .policyTakeoutJp("テイクアウト包装は30分間サクサクの食感を保ちます")
                .vatRate(new BigDecimal("8.00"))
                .defaultPrepMinutes(18)
                .capacityHall(30)
                .capacityCounter(10)
                .googleRating(new BigDecimal("4.8"))
                .googleReviewCount(562)
                .googleMapsUrl("https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h")
                .googleMapsEmbedUrl("https://maps.google.com/maps?q=10.8037915,106.7449356+(%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring)&t=&z=17&ie=UTF8&iwloc=B&output=embed")
                .establishedYear("2023")
                .copyrightTextEn("© 2025 CUTLET SPRING Atelier. All Rights Reserved.")
                .copyrightTextKr("© 2025 CUTLET SPRING 아틀리에. All Rights Reserved.")
                .copyrightTextVi("© 2025 Xưởng CUTLET SPRING. Bảo lưu mọi quyền.")
                .copyrightTextJp("© 2025 CUTLET SPRING アトリエ. 無断転載を禁じます。")
                .hotlineVisible(true)
                .updatedAt(Instant.now())
                .updatedBy("SYSTEM")
                .build();
        return settingsRepository.save(fallback);
    }
}
