Project Title: Secure Bank Portal - A Microservices Implementation

This repository contains the source code for a demonstration bank portal built with a microservices architecture. The core infrastructure challenges of a distributed system—specifically authentication and centralized configuration—are solved using dedicated Spring Boot microservices.

Architecture Overview:

The system is composed of several independent services:

Auth Service: A dedicated service for JWT-based authentication and authorization, securing access to all other microservices.
Config Service: A centralized configuration server that provides environment-specific properties to all other services at runtime.
API Gateway (Optional but recommended to mention): (If you have one) A single entry point for handling routing, cross-cutting concerns, and load balancing.
Core Business Services (e.g., Account Service, Transaction Service): (If you have them) Services that handle the specific business logic of the bank portal.
Technology Stack:

Backend Framework: Spring Boot
Security: Spring Security, JWT
Configuration: Spring Cloud Config
Service Discovery: (If used, e.g., Eureka, Consul)
API Gateway: (If used, e.g., Spring Cloud Gateway)
Build Tool: Maven / Gradle
Why this architecture?

Scalability: Individual services can be scaled independently based on load.
Resilience: The failure of one service does not necessarily bring down the entire system.
Maintainability: Smaller, focused codebases are easier to understand and develop.
Flexibility: Allows for polyglot persistence and technology choices per service.
