package com.luv2code.spring_boot_library.responsemodel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DigitalAccessResponse {
    private String url;
    private String source;
    private String mode;
}