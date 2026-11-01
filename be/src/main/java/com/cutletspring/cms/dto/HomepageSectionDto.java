package com.cutletspring.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomepageSectionDto {
    private String id;
    private String sectionKey;
    private String titleEn;
    private String titleKr;
    private String titleVi;
    private String titleJp;
    private String subtitleEn;
    private String subtitleKr;
    private String subtitleVi;
    private String subtitleJp;
    private Integer displayOrder;
    private Boolean isActive;
    private Instant updatedAt;
}

