import { NextResponse } from "next/server";
import { parseJobDescription } from "@/lib/ai/tailor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rawJd, url } = body;

    let contentToParse = rawJd;

    // If only URL is provided without JD text, simulate web agent fetching the content
    if (!contentToParse && url) {
      const urlLower = url.toLowerCase();
      if (urlLower.includes("linkedin")) {
        contentToParse = `Senior Full Stack Engineer at TechCorp Global - Bengaluru / Remote
About the job:
TechCorp is seeking an experienced Senior Full Stack Engineer to lead the architecture of our cloud microservices and high-throughput web portals.
Requirements:
- 5+ years of software engineering experience with TypeScript, React.js, Next.js, and Node.js.
- Strong hands-on experience designing REST & GraphQL APIs and caching architectures with Redis.
- Proven experience with cloud infrastructure (AWS ECS, S3, Docker, Kubernetes) and CI/CD pipelines.
- Solid background in SQL (PostgreSQL) and database performance tuning.
- Experience with AI integrations or automated data workflows is a plus.
Benefits:
- Competitive Salary: ₹32,00,000 - ₹45,00,000 PA + Stock Options.
- Comprehensive Health Coverage and Flexible Remote Policy.`;
      } else if (urlLower.includes("naukri")) {
        contentToParse = `Lead Full Stack Developer - Razorpay / Bengaluru (Hybrid)
Role Overview:
We are looking for a passionate Lead Full Stack Developer to scale our merchant checkout checkout workflows.
Key Responsibilities:
- Build fault-tolerant, high-concurrency payment interfaces using Next.js, React, and Node.js.
- Work closely with security teams to ensure compliance and zero-defect deployments.
- Mentor junior engineers and conduct rigorous architectural reviews.
Must-Have Skills:
- React.js, Next.js, TypeScript, Node.js, PostgreSQL, Docker, AWS, System Design.
- Notice period: 30 days or immediate preferred.
Salary: ₹35,00,000 - ₹48,00,000 PA`;
      } else {
        contentToParse = `Full Stack Engineer at Modern Scale Systems
Location: Remote (Global)
Tech Stack: TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS.
Role Description:
We are hiring a Full Stack Engineer to build scalable customer-facing products and internal operational tooling.
Requirements:
- Proven experience building web applications in production with React/Next.js and Node.js.
- Experience with database design and query optimization.
- Ability to own projects from conception to production deployment.`;
      }
    }

    if (!contentToParse || contentToParse.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Job Description or Job Link URL" },
        { status: 400 }
      );
    }

    const jobDetails = await parseJobDescription(contentToParse, url);
    return NextResponse.json({ success: true, jobDetails });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
