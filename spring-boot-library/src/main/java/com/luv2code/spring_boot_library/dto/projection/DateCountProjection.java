package com.luv2code.spring_boot_library.dto.projection;

import java.time.LocalDate;

public interface DateCountProjection {
    LocalDate getDate();
    Long getCount();
}
