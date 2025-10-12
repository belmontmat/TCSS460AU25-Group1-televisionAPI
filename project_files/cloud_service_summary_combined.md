## Web API Hosting Options in the Cloud: Technical Overview

This is an AI generated (Microsoft Copilot) summary of Group 1\'s
research. Each group member did research on 1 of 4 cloud platforms and
wrote their findings in separate documents. This document is a
convenient summary of that research.

This document summarizes the pros and cons of four major cloud platforms
for hosting a Web API, with emphasis on cost, scalability, and
operational complexity.

### **1. AWS (Lambda + API Gateway, App Runner, Fargate)**

#### ****Options:****

-   **AWS Lambda + API Gateway** (Serverless)
-   **App Runner** (PaaS)
-   **Fargate / ECS** (Container-based)

#### **Pros:**

-   **Free tier** available (only for new accounts)
-   **No server management** with Lambda and App Runner
-   **Pay-per-use** pricing model
-   **App Runner** simplifies deployment of containerized Express.js
    APIs
-   **Scales automatically**

#### **Cons:**

-   Requires **AWS ecosystem knowledge**
-   **Free tier limitations**
-   **Fargate** may be overkill for simple APIs
-   Pricing can be **complex to estimate** with scaling

#### **Cost Notes:**

-   Lambda and API Gateway are **pay-per-request** and **compute time**
-   App Runner charges based on **CPU/memory usage and active time**
-   Free tier helps reduce initial costs, but long-term usage needs
    careful monitoring

### **2. Google Cloud (Cloud Run + Cloud SQL)**

#### **Options:**

-   **Cloud Run** (Serverless container hosting)
-   **Cloud SQL** (Managed PostgreSQL)

#### **Pros:**

-   **Fully managed and serverless**

-   **Supports Node.js, Express, and other common stacks**

-   **\$300 in free credits for 90 days**

-   **Free tier** includes:

    -   240,000 vCPU-seconds/month
    -   450,000 GiB-seconds/month

-   **Simple deployment** via CLI or web console

#### **Cons:**

-   **Credit card required** for identity verification
-   **Trial ends after 90 days or credit depletion**
-   **Cloud SQL** not included in free tier (starts at \~\$10/month)
-   **Pricing complexity** due to granular billing
-   **Learning curve** for CLI-based deployment

#### **Cost Notes:**

-   After free tier, pricing is **\$0.000018/vCPU-second** and
    **\$0.000002/GiB-second**
-   **Cloud SQL** adds extra cost
-   **Good for low-traffic apps**, but scaling requires cost modeling

### **3. Microsoft Azure (Functions, App Service, API Management)**

#### **Options:**

-   **Azure Functions** (Serverless)
-   **App Service** (PaaS)
-   **API Management** (Gateway features)
-   **AKS / Container Instances** (Advanced container hosting)

#### **Pros:**

-   **Scalable and elastic** services
-   **Rich API features**: routing, versioning, throttling, JWT,
    analytics
-   **Strong integration** with Microsoft stack
-   **Security features**: VNETs, WAFs, private endpoints
-   **Global availability** and redundancy
-   **Multiple hosting models** to suit different needs

#### **Cons:**

-   **Pricing complexity** and potential for high costs
-   **Cold starts** in serverless plans
-   **Security risks** if not configured properly
-   **Operational overhead** with advanced setups
-   **Vendor lock-in** risk
-   **Tier limitations** (e.g., static IPs, VNETs only in premium tiers)

#### **Cost Notes:**

-   **Functions consumption plan** is cost-effective but has cold start
    latency
-   **App Service** and **API Management** can get expensive in premium
    tiers
-   **Monitoring and networking features** may incur additional charges

### **4. Heroku (Dynos + Postgres)**

#### **Options:**

-   **Dynos** (Container-like units for hosting apps)
-   **Heroku Postgres** (Managed database)

#### **Pros:**

-   **Simple pricing**: fixed monthly tiers
-   **Student developer pack** offers \$13/month credit for 24 months
-   **Easy to use**, popular among students and small teams

#### **Cons:**

-   **No free tier** since \~3 years ago
-   **Credit card required**
-   **No rollover** of unused student credits
-   **Limited scalability** compared to other platforms

#### **Cost Notes:**

-   **Eco Dyno**: \$5/month (sleeps after 30 min inactivity)
-   **Basic Dyno**: \$7/month (always on)
-   **Postgres Essential Tier**: \$5/month (1GB storage, 20 connections)

## Cost Comparison Summary

  ------------------ --------------------- ----------------------- ------------- ------------------------------------
  **AWS**            | Free tier                   Free → Pay-per-use      Automatic     App Runner is simpler than Fargate

  **Google Cloud**   | Free tier + \$300 credits   Free → Usage-based      Automatic     Cloud SQL adds cost

  **Azure**          | Free tier                   Free → Tiered pricing   Elastic       Complex pricing, rich features

  **Heroku**         | **No** free tier                    \$5--\$7/month          Fixed tiers   Simple, but limited
  ------------------ --------------------- ----------------------- ------------- ------------------------------------

## Recommendation Guidelines

-   **Low traffic, low budget**: Google Cloud Run or AWS Lambda (with
    free tier)
-   **Mid-scale apps with container needs**: AWS App Runner or Azure App
    Service
-   **Enterprise-grade features**: Azure (API Management, VNETs)
-   **Simple student projects**: Heroku (with GitHub credits)
