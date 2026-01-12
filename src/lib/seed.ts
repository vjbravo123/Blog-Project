import 'dotenv/config';
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/Users";

const seedData = [
  {
    title: "The Death of the Perimeter: Implementing Zero Trust",
    content: `In 2026, the traditional concept of a 'secure corporate network' is officially obsolete. With the total shift to distributed cloud environments, Zero Trust Architecture (ZTA) has become the mandatory standard for any scalable backend.

    Zero Trust operates on a simple but brutal principle: 'Never trust, always verify.' It assumes that the network is already compromised. Every request—whether it comes from inside the office or a remote coffee shop—must be authenticated, authorized, and encrypted.
    
    For developers, this means moving away from IP-based security and toward Identity-Based security. We must implement micro-segmentation at the API level, ensuring that a breach in one service doesn't grant lateral movement across the entire infrastructure.`,
    isFeatured: true,
    published: true,
    tags: ["CyberSecurity", "Zero Trust", "Backend"],
  },
  {
    title: "GraphQL vs. REST: Why Not Both?",
    content: `The war between GraphQL and REST has finally cooled down as developers realize that the best architecture often involves 'Federated Graphs' sitting on top of legacy RESTful microservices.

    GraphQL excels at providing a flexible, type-safe entry point for frontends, preventing over-fetching and under-fetching. However, REST remains the king of simplicity for service-to-service communication where complex query capabilities aren't needed. 
    
    The most successful engineering teams are now using GraphQL as a 'BFF' (Backend for Frontend) layer. This allows frontends to request exactly what they need in one trip, while the backend remains modular and easier to cache using standard HTTP protocols at the REST layer.`,
    isFeatured: false,
    published: true,
    tags: ["API Design", "GraphQL", "REST"],
  },
  {
    title: "Mastering MLOps: Taking Models to Production",
    content: `The biggest bottleneck in AI today isn't training models—it's deploying them. MLOps is the bridge that brings DevOps discipline to the chaotic world of Machine Learning.

    A true MLOps pipeline handles versioning for both code AND data. If you can't reproduce a model's output because the training dataset changed, you don't have a production-ready system. 
    
    We are seeing a massive shift toward 'Feature Stores' and automated model monitoring. In a world where models 'drift' over time as real-world data changes, having automated retraining loops and 'Canary Deployments' for AI models is what separates the winners from the experimenters.`,
    isFeatured: true,
    published: true,
    tags: ["MLOps", "AI", "DevOps"],
  },
  {
    title: "Distributed Systems: The Cost of Eventual Consistency",
    content: `In a globally distributed application, you cannot have high availability and strong consistency at the same time. This is the 'CAP Theorem' in action, and in 2026, we've largely chosen Availability.

    Eventual Consistency is a powerful tool, but it introduces 'Race Conditions' that can haunt your database logic. Developers must learn to build 'Idempotent' operations—actions that can be performed multiple times without changing the result.
    
    Whether you are using MongoDB's change streams or Apache Kafka for event sourcing, the secret is to design your UI to handle 'Optimistic Updates.' Tell the user the action succeeded immediately, and handle the background sync failures gracefully.`,
    isFeatured: false,
    published: true,
    tags: ["Distributed Systems", "Backend", "Architecture"],
  },
  {
    title: "The Serverless Hype Cycle: A Reality Check",
    content: `Serverless promised a world where developers never have to think about infrastructure. While 'Function-as-a-Service' (FaaS) is great for bursty workloads, many companies are finding that the 'Cold Start' latency and hidden costs at scale are making them reconsider.

    We are seeing a move toward 'Stateful Serverless' and 'Managed Containers.' The goal is to keep the developer experience of serverless—simple deployments and auto-scaling—without the limitations of short-lived execution environments. 
    
    The key is to use Serverless for what it's good for: background tasks, image processing, and webhooks. For your core, high-traffic API, a long-running containerized service still offers better performance and more predictable pricing.`,
    isFeatured: false,
    published: true,
    tags: ["Serverless", "Cloud", "Cost Optimization"],
  },
  {
    title: "Software Testing: Why TDD is Your Best Investment",
    content: `Test-Driven Development (TDD) often feels slow in the first week, but it is the only way to move fast in the first year. Writing tests before you write code forces you to think about the 'Interface' and the 'User' before you worry about the implementation.

    A robust test suite acts as a 'Safety Net.' It allows your team to refactor large portions of the codebase with total confidence. If the tests pass, the business logic is preserved. 
    
    Focus on the 'Testing Pyramid.' You want thousands of fast Unit Tests, hundreds of Integration Tests, and only a handful of slow, expensive End-to-End (E2E) tests. Testing isn't about finding bugs; it's about enabling change without fear.`,
    isFeatured: true,
    published: true,
    tags: ["TDD", "Testing", "Quality Assurance"],
  },
  {
    title: "Accessibility: Beyond Compliance to Inclusion",
    content: `Web accessibility (a11y) is often treated as a legal chore, but in 2026, it is a hallmark of high-quality software. An accessible site is better for everyone, including those on mobile devices or slow networks.

    Semantic HTML is the foundation. Using the correct tags (main, section, nav) provides a roadmap for screen readers. But we must go further, ensuring our 'Focus Management' is handled correctly in complex JavaScript single-page applications.
    
    Inclusion also means 'Internationalization' (i18n). A truly accessible app respects the user's language, their reduced-motion preferences, and their need for high-contrast themes. High-quality code is inclusive code.`,
    isFeatured: false,
    published: true,
    tags: ["A11y", "UI/UX", "Frontend"],
  },
  {
    title: "Containerization: Moving Beyond Basic Docker",
    content: `Docker was just the beginning. Today, the focus has shifted to 'Container Orchestration' with Kubernetes and the 'Service Mesh' layer. 

    Standardizing your development environment is no longer optional. Using 'Dev Containers,' every developer on your team can work in a bit-for-bit identical environment to production, eliminating the 'It works on my machine' excuse forever. 
    
    The next step is 'Distroless' images—containers that contain ONLY your application and its dependencies, with no shell or package manager. This reduces the attack surface and makes your deployments lightning-fast and highly secure.`,
    isFeatured: false,
    published: true,
    tags: ["Docker", "Kubernetes", "DevOps"],
  },
  {
    title: "The Power of Caching: Solving the N+1 Problem",
    content: `The fastest database query is the one you never have to make. Caching strategies using Redis or Memcached are the primary way we scale applications to handle millions of requests.

    The 'N+1 Query Problem' is the most common performance killer in modern ORMs. By using 'Eager Loading' and 'Query Batching,' we can reduce hundreds of database calls into a single, efficient trip. 
    
    However, 'Cache Invalidation' remains one of the two hardest problems in computer science. Implementing 'Write-Through' or 'Cache-Aside' patterns correctly ensures that your users never see stale data while your database remains cool and responsive under heavy load.`,
    isFeatured: false,
    published: true,
    tags: ["Redis", "Caching", "Performance"],
  },
  {
    title: "Deep Work: The Engineer's Secret Weapon",
    content: `In an age of Slack notifications and constant meetings, the ability to focus without distraction on a cognitively demanding task—'Deep Work'—is becoming increasingly rare and valuable.

    As software engineers, our value is in the complexity we can navigate. You cannot solve a complex architectural bug or design a distributed system in 15-minute increments between meetings. 
    
    Protect your 'Flow State.' Block off four-hour chunks on your calendar, turn off notifications, and dive deep into the code. The most productive developers aren't the ones who type the fastest; they are the ones who think the most clearly.`,
    isFeatured: true,
    published: true,
    tags: ["Career", "Productivity", "Soft Skills"],
  },
];

async function seed() {
  try {
    console.log("🚀 Initializing Database Seed...");
    await dbConnect();

    let author = await User.findOne();
    if (!author) {
      author = await User.create({
        name: "Lead Developer",
        email: "engineering@example.com",
        password: "securepassword123",
      });
      console.log("👤 Created new Admin Author.");
    }

    // Optional: await Blog.deleteMany({}); 

    const blogsWithAuthor = seedData.map((blog, index) => ({
      ...blog,
      author: author._id,
      coverImage: `https://images.unsplash.com/photo-${[
        '1498050108023-c5249f4df085',
        '1555066931-4365d14bab8c',
        '1517694712202-14dd9538aa97',
        '1587620962725-abab7fe55159',
        '1550745165-9bc0b252726f',
        '1551033406-611cf9a28f67',
        '1451187580459-43490279c0fa',
        '1460925895917-afdab827c52f',
        '1563986768609-322da13575f3',
        '1639762681459-4f1d58705957'
      ][index]}?auto=format&fit=crop&w=1200&q=80`,
    }));

    await Blog.insertMany(blogsWithAuthor);
    
    console.log(`✅ Success: 10 Full-Length Articles added to the database.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
}

seed();