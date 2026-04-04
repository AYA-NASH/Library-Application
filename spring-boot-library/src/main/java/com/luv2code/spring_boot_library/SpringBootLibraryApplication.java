package com.luv2code.spring_boot_library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class SpringBootLibraryApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootLibraryApplication.class, args);
	}

}
