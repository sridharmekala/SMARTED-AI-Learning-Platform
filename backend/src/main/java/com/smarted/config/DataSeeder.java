package com.smarted.config;

import com.smarted.entity.Course;
import com.smarted.entity.QuizQuestion;
import com.smarted.entity.Topic;
import com.smarted.entity.User;
import com.smarted.repository.CourseRepository;
import com.smarted.repository.QuizQuestionRepository;
import com.smarted.repository.TopicRepository;
import com.smarted.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin.enabled}")
    private boolean adminSeedEnabled;

    @Value("${app.seed.admin.name}")
    private String adminSeedName;

    @Value("${app.seed.admin.email}")
    private String adminSeedEmail;

    @Value("${app.seed.admin.password}")
    private String adminSeedPassword;

    public DataSeeder(
            TopicRepository topicRepository,
            QuizQuestionRepository quizQuestionRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.topicRepository = topicRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        migrateMissingRoles();
        seedAdmin();
        Course javaFullStackCourse = seedCourse();

        Topic javaBasics = seedTopic(
                javaFullStackCourse,
                "Java Basics",
                "Start the Java Full Stack path with syntax, variables, methods, and control flow.",
                "Java Basics covers program structure, data types, variables, operators, conditional statements, loops, methods, arrays, and simple console programs. This module builds the foundation for backend development.",
                "Beginner",
                60
        );

        Topic oop = seedTopic(
                javaFullStackCourse,
                "OOP Concepts",
                "Understand classes, objects, inheritance, abstraction, polymorphism, and encapsulation.",
                "Object-Oriented Programming helps organize code using classes and objects. Important concepts include inheritance, polymorphism, encapsulation, abstraction, interfaces, constructors, and method overriding.",
                "Beginner",
                75
        );

        Topic collections = seedTopic(
                javaFullStackCourse,
                "Collections",
                "Learn List, Set, Map, generics, iteration, and common collection use cases.",
                "Java Collections are used to store and process groups of data. This module covers ArrayList, LinkedList, HashSet, HashMap, generics, sorting, iteration, and choosing the right collection.",
                "Intermediate",
                60
        );

        Topic exceptions = seedTopic(
                javaFullStackCourse,
                "Exception Handling",
                "Handle runtime errors using try-catch, finally, throw, throws, and custom exceptions.",
                "Exception Handling makes Java applications reliable. Learn checked exceptions, unchecked exceptions, try-catch-finally blocks, throw, throws, custom exceptions, and best practices.",
                "Intermediate",
                45
        );

        Topic mysql = seedTopic(
                javaFullStackCourse,
                "SQL & MySQL",
                "Work with databases using SQL queries, joins, keys, and MySQL tables.",
                "SQL and MySQL are core full stack skills. Learn tables, primary keys, foreign keys, SELECT, INSERT, UPDATE, DELETE, joins, constraints, normalization, and basic database design.",
                "Beginner",
                75
        );

        Topic jdbc = seedTopic(
                javaFullStackCourse,
                "JDBC",
                "Connect Java applications to MySQL using JDBC drivers, statements, and result sets.",
                "JDBC allows Java code to communicate with databases. This module covers DriverManager, Connection, PreparedStatement, ResultSet, CRUD operations, and safe query handling.",
                "Intermediate",
                60
        );

        Topic springBoot = seedTopic(
                javaFullStackCourse,
                "Spring Boot",
                "Build Java backend applications using Spring Boot, REST APIs, and JPA.",
                "Spring Boot simplifies Java backend development. It provides auto-configuration, embedded servers, starter dependencies, REST controller support, dependency injection, Spring Data JPA, validation, and security integration.",
                "Intermediate",
                90
        );

        Topic restApi = seedTopic(
                javaFullStackCourse,
                "REST API",
                "Design backend endpoints using controllers, HTTP methods, status codes, and JSON.",
                "REST APIs connect frontend and backend applications. Learn GET, POST, PUT, DELETE, request bodies, path variables, response entities, validation, and clean API design.",
                "Intermediate",
                60
        );

        Topic jwt = seedTopic(
                javaFullStackCourse,
                "JWT Authentication",
                "Secure full stack applications using login, JWT tokens, roles, and protected routes.",
                "JWT Authentication protects APIs and frontend routes. Learn token generation, validation, Authorization headers, Spring Security filters, roles, and user session handling.",
                "Advanced",
                75
        );

        Topic reactBasics = seedTopic(
                javaFullStackCourse,
                "React Basics",
                "Build frontend screens using JSX, components, props, state, and events.",
                "React Basics introduces reusable UI components, JSX, props, state, hooks, events, conditional rendering, lists, and form handling.",
                "Beginner",
                75
        );

        Topic reactRouter = seedTopic(
                javaFullStackCourse,
                "React Router",
                "Create multi-page frontend navigation using routes, links, and protected pages.",
                "React Router helps build SPA navigation. Learn BrowserRouter, Routes, Route, Link, NavLink, params, redirects, and protected route patterns.",
                "Intermediate",
                45
        );

        Topic axios = seedTopic(
                javaFullStackCourse,
                "Axios API Integration",
                "Connect React frontend with Spring Boot backend using Axios and JWT headers.",
                "Axios API Integration covers API services, GET/POST requests, interceptors, error handling, loading states, and sending JWT tokens to protected endpoints.",
                "Intermediate",
                60
        );

        Topic fullStackProject = seedTopic(
                javaFullStackCourse,
                "Full Stack Project",
                "Combine Java, Spring Boot, MySQL, JWT, React, and Axios into one complete project.",
                "The Full Stack Project module brings the whole Java Full Stack Development course together. Build end-to-end features, connect frontend and backend, secure APIs, and polish the final application.",
                "Advanced",
                120
        );

        migrateExistingTopicsToCourse(javaFullStackCourse);

        seedQuizQuestions(javaBasics, new String[][]{
                {"Which feature makes Java platform independent?", "Pointers", "JVM and bytecode", "Manual memory allocation", "Header files", "B"},
                {"Which concept hides internal data and exposes methods?", "Inheritance", "Polymorphism", "Encapsulation", "Compilation", "C"},
                {"Which keyword is used to inherit a class in Java?", "implements", "extends", "inherits", "super", "B"}
        });

        seedQuizQuestions(mysql, new String[][]{
                {"Which key uniquely identifies a row in a table?", "Foreign key", "Primary key", "Candidate lock", "Index key", "B"},
                {"Which SQL command is used to fetch data?", "GET", "OPEN", "SELECT", "FETCHALL", "C"},
                {"What does ACID stand for in DBMS?", "Atomicity Consistency Isolation Durability", "Access Control Index Data", "Array Class Interface Data", "Automatic Commit Internal Database", "A"}
        });

        seedQuizQuestions(springBoot, new String[][]{
                {"Which annotation marks the main Spring Boot class?", "@SpringBootApplication", "@MainClass", "@BootServer", "@JavaApplication", "A"},
                {"What does Spring Boot use to simplify configuration?", "Manual XML only", "Auto-configuration", "Assembly code", "Servlet files only", "B"},
                {"Which annotation creates a REST controller?", "@Service", "@Repository", "@RestController", "@Entity", "C"}
        });

        seedQuizQuestions(reactBasics, new String[][]{
                {"What is React mainly used for?", "Database design", "Building user interfaces", "Operating systems", "Network routing", "B"},
                {"Which React feature stores component data that can change?", "Props", "State", "Package", "Route", "B"},
                {"Which library is commonly used for API calls in this project?", "Axios", "Hibernate", "Maven", "BCrypt", "A"}
        });
    }

    private void seedAdmin() {
        if (!adminSeedEnabled || isBlank(adminSeedEmail)) {
            return;
        }

        String adminEmail = adminSeedEmail.trim();

        userRepository.findByEmail(adminEmail).ifPresentOrElse(admin -> {
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }, () -> {
            if (isBlank(adminSeedPassword)) {
                return;
            }

            userRepository.save(new User(
                    isBlank(adminSeedName) ? "SMARTED Admin" : adminSeedName.trim(),
                    adminEmail,
                    passwordEncoder.encode(adminSeedPassword),
                    "ADMIN"
            ));
        });
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private void migrateMissingRoles() {
        userRepository.findAll().forEach(user -> {
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("STUDENT");
                userRepository.save(user);
            }
        });
    }

    private Course seedCourse() {
        return courseRepository.findByNameIgnoreCase("Java Full Stack Development")
                .orElseGet(() -> courseRepository.save(new Course(
                        "Java Full Stack Development",
                        "A complete learning path covering Java, MySQL, Spring Boot, REST APIs, JWT security, React, Axios, and a final full stack project."
                )));
    }

    private Topic seedTopic(Course course, String title, String description, String content, String difficulty, Integer estimatedTimeMinutes) {
        return topicRepository.findByTitleIgnoreCase(title)
                .map(topic -> {
                    topic.setCourse(course);
                    topic.setDifficulty(difficulty);
                    topic.setEstimatedTimeMinutes(estimatedTimeMinutes);
                    return topicRepository.save(topic);
                })
                .orElseGet(() -> topicRepository.save(new Topic(title, description, content, course, difficulty, estimatedTimeMinutes)));
    }

    private void migrateExistingTopicsToCourse(Course course) {
        topicRepository.findAll().forEach(topic -> {
            if (topic.getCourse() == null) {
                topic.setCourse(course);
            }
            if (topic.getDifficulty() == null || topic.getDifficulty().isBlank()) {
                topic.setDifficulty("Beginner");
            }
            if (topic.getEstimatedTimeMinutes() == null || topic.getEstimatedTimeMinutes() <= 0) {
                topic.setEstimatedTimeMinutes(45);
            }
            topicRepository.save(topic);
        });
    }

    private void seedQuizQuestions(Topic topic, String[][] questions) {
        if (!quizQuestionRepository.findByTopicId(topic.getId()).isEmpty()) {
            return;
        }

        for (String[] question : questions) {
            quizQuestionRepository.save(new QuizQuestion(
                    topic,
                    question[0],
                    question[1],
                    question[2],
                    question[3],
                    question[4],
                    question[5]
            ));
        }
    }
}
