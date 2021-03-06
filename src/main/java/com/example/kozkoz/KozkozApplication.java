package com.example.kozkoz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@EnableAutoConfiguration
@SpringBootApplication
public class KozkozApplication {
	@RequestMapping("/")
	@ResponseBody
	String index() {
		return "Web service Kozkoz Application";
	}

	public static void main(String[] args) {
		SpringApplication.run(KozkozApplication.class, args);
	}
}
