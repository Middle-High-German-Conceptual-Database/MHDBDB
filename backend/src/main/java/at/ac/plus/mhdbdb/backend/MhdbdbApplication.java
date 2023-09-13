package at.ac.plus.mhdbdb.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("at.ac.plus.mhdbdb.backend") // Replace with your base package
public class MhdbdbApplication {

	public static void main(String[] args) {
		SpringApplication.run(MhdbdbApplication.class, args);
	}

}
