package at.ac.plus.mhdbdb.backend;

import java.util.function.Consumer;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLSession;

import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    private static final Logger logger = LoggerFactory.getLogger(AppConfig.class);

    @Bean
    RestTemplate restTemplate() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(100000); // 10 seconds
        return new RestTemplate(factory);
    }

    @Bean
    Consumer<HttpClientBuilder> createSslBuilderConsumer() {
        return new HttpBuilderConsumerSsl();
    }

    @Bean
    HostnameVerifier createIgnoringHostnameVerifier() {
        HostnameVerifier hostnameVerifier = new HostnameVerifier() {
            @Override
            public boolean verify(String hostname, SSLSession session) {
                logger.debug("Verifying {} against {}", hostname, session.getPeerHost());
                boolean ret = hostname.equals("localhost") || hostname.equals(session.getPeerHost());
                if (!ret) {
                    logger.warn("{} failed to verify against {}", hostname, session.getPeerHost());
                }
                return ret;
            }
        };
        return hostnameVerifier;
    }
}
