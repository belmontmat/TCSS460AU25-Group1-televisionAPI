# Overview: Google Cloud

# Does it work with our stack?

**Google Cloud Run**, part of Google Cloud, is part of the Google Cloud platform that can allow us to run front end and back end applications. It is described as a “fully managed” platform to run code. Languages/platforms include Go, Node.JS, Python, Java, .NET Core, and Ruby. It is considered “serverless.”

# How much does it cost?

[https://cloud.google.com/free/docs/free-cloud-features](https://cloud.google.com/free/docs/free-cloud-features)  
First **240,000 vCPU-seconds free per month** and the first **450,000 GiB-seconds free**. Beyond that, it costs **$0.00001800 / vCPU-second and $0.00000200 / GiB-second** should the free tier be exceeded. **New customers get $300 in free credits (for 90 days)**.

**Payment information is required for “identity verification” reasons.** Won’t be charged automatically.

Pricing is pay-per-usage, which could make pricing complicated if we wanted to scale up, though depending on usage, it could be cheaper. I don’t know exactly how it works though, though there is a calculator available.

“Cloud Run charges you only for the resources you use, rounded up to the nearest 100 millisecond”

# How to deploy?

[https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service)

# Pros

* It’s fully managed (PaaS I think) and serverless (no need to manage servers)  
* Integration with other Google Cloud services if desired (not really important for our use in my opinion)  
* $300 in free credits for 90 days, free tier available

# Cons

* “When your trial ends, either due to you depleting your credits or due to your account running out of 90 days of trialing time, your workloads get shut down.”  
  * However, there is a free tier, apparently  
* Credit card required.  
* Does not appear to be available as part of the GitHub student developer pack  
* Deploying involves a console-based application. Some might consider this a barrier due to a potential learning curve. Looking at the documentation however, it seems relatively simple.  
  * There at least appears to be a web based interface for managing Cloud Run apps

# Google Cloud SQL for PostgreSQL

* Also fully managed  
* New customers get $300 in free credits.  
* Does not appear to be included in the free tier, lowest cost would be about $10 a month.