package at.ac.plus.mhdbdb.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

@Configuration
public class XmlConfig {

    @Bean
    public Jaxb2Marshaller jaxb2Marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();

        marshaller.setClassesToBeBound(TeiViewController.class);

        // Configure any additional properties as needed
        // For example:
        // marshaller.setProperty("jaxb.formatted.output", true);

        return marshaller;
    }
}
