package com.voting;

import redis.clients.jedis.Jedis;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Worker {
    private static final Logger logger = LoggerFactory.getLogger(Worker.class);
    
    private String redisHost;
    private int redisPort;
    private String dbUrl;
    private String dbUser;
    private String dbPassword;
    
    public Worker() {
        this.redisHost = System.getenv("REDIS_HOST") != null ? System.getenv("REDIS_HOST") : "localhost";
        this.redisPort = System.getenv("REDIS_PORT") != null ? Integer.parseInt(System.getenv("REDIS_PORT")) : 6379;
        
        String postgresHost = System.getenv("POSTGRES_HOST") != null ? System.getenv("POSTGRES_HOST") : "localhost";
        String postgresPort = System.getenv("POSTGRES_PORT") != null ? System.getenv("POSTGRES_PORT") : "5432";
        String postgresDb = System.getenv("POSTGRES_DB") != null ? System.getenv("POSTGRES_DB") : "voting_db";
        
        this.dbUrl = String.format("jdbc:postgresql://%s:%s/%s", postgresHost, postgresPort, postgresDb);
        this.dbUser = System.getenv("POSTGRES_USER") != null ? System.getenv("POSTGRES_USER") : "postgres";
        this.dbPassword = System.getenv("POSTGRES_PASSWORD") != null ? System.getenv("POSTGRES_PASSWORD") : "postgres123";
    }
    
    public void start() {
        logger.info("✓ Worker started");
        logger.info("Redis: {}:{}", redisHost, redisPort);
        logger.info("Database: {}", dbUrl);
        
        while (true) {
            processVotes();
            
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                logger.error("Worker interrupted", e);
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
    
    private void processVotes() {
        Jedis jedis = null;
        
        try {
            jedis = new Jedis(redisHost, redisPort);
            String vote = jedis.rpop("votes");
            
            if (vote != null && !vote.isEmpty()) {
                updateDatabase(vote);
                logger.info("Vote processed: {}", vote);
            }
        } catch (Exception e) {
            logger.error("Error processing votes", e);
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }
    
    private void updateDatabase(String vote) {
        try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {
            String sql = "UPDATE results SET count = count + 1 WHERE option = ?";
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, vote.toLowerCase());
                stmt.executeUpdate();
            }
        } catch (SQLException e) {
            logger.error("Database error", e);
        }
    }
    
    public static void main(String[] args) {
        Worker worker = new Worker();
        worker.start();
    }
}
