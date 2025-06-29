import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Server,
  Cloud,
  Shield,
  Settings,
  Globe,
  Eye,
  Activity,
  TrendingUp,
  DatabaseZap,
} from "lucide-react";
import DocsPageLayout from "@/components/developer/DocsPageLayout";

export default function DeploymentMonitoringPage() {
  return (
    <DocsPageLayout
      pageTitle="Deployment & Monitoring (Conceptual)"
      pageIcon="Server"
      alertTitle="Conceptual Documentation"
      alertDescription="This document provides conceptual strategies for deploying and monitoring the Norruva DPP platform. Actual implementation will require detailed planning and specific infrastructure choices."
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="mr-2 h-5 w-5 text-primary" />
            Deployment Considerations (Conceptual)
          </CardTitle>
          <CardDescription>
            Key aspects to consider when planning the deployment of the Digital
            Product Passport system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Globe className="mr-2 h-4 w-4 text-accent" />
              DPP Viewer (Frontend - Next.js Application)
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Hosting:</strong> Leverage platforms like Firebase App
                Hosting, Vercel, or Netlify for easy deployment, global CDN, and
                CI/CD integration.
              </li>
              <li>
                <strong>CDN:</strong> Ensure a Content Delivery Network is used
                to serve static assets quickly to users globally, reducing
                latency for the public passport viewer.
              </li>
              <li>
                <strong>Custom Domain:</strong> Configure a custom domain (e.g.,
                `passport.yourbrand.com`) for the public viewer.
              </li>
              <li>
                <strong>Performance:</strong> Optimize build sizes, leverage
                Next.js SSR/SSG/ISR capabilities, and implement image
                optimization.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Server className="mr-2 h-4 w-4 text-accent" />
              Backend API (Conceptual)
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              For functionalities like QR code validation, secure data retrieval
              beyond static mock data, and potential interactions with external
              systems.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Architecture:</strong> Consider serverless functions
                (e.g., Google Cloud Functions, AWS Lambda) for scalability and
                cost-efficiency, or containerized services (e.g., Google Cloud
                Run, AWS Fargate).
              </li>
              <li>
                <strong>Database:</strong> If moving beyond mock data, select a
                scalable database (e.g., Firestore, PostgreSQL on Cloud SQL/RDS)
                for storing DPP data, user information, etc. Consider data
                residency requirements.
              </li>
              <li>
                <strong>API Gateway:</strong> Use an API Gateway (e.g., Google
                Cloud API Gateway, Amazon API Gateway) for managing, securing,
                and monitoring API endpoints.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Settings className="mr-2 h-4 w-4 text-accent" />
              (Mock) Blockchain Nodes (Conceptual)
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              If simulating a private or consortium blockchain for enhanced data
              integrity or EBSI interaction:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Hosting:</strong> Conceptual nodes could be simulated as
                services running on cloud VMs or container platforms. For real
                scenarios, managed blockchain services (e.g., Google Cloud
                Blockchain Node Engine, AWS Managed Blockchain) or self-hosted
                nodes would be considered.
              </li>
              <li>
                <strong>Interconnection:</strong> Secure networking between
                nodes and between the API/application layer and the nodes.
              </li>
              <li>
                <strong>Consensus Mechanism:</strong> Choice of consensus (e.g.,
                PoA for permissioned chains) impacts performance and security.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Shield className="mr-2 h-4 w-4 text-accent" />
              Cross-Cutting Deployment Concerns
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Environment Management:</strong> Maintain separate
                environments for development, staging, and production with
                distinct configurations and data.
              </li>
              <li>
                <strong>Scalability:</strong> Design for scalability from the
                outset. Utilize auto-scaling features of cloud platforms for
                frontend and backend components.
              </li>
              <li>
                <strong>Security:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Implement HTTPS for all communications.</li>
                  <li>
                    Securely manage API keys, secrets, and environment variables
                    (e.g., Google Secret Manager, HashiCorp Vault).
                  </li>
                  <li>
                    Configure firewalls, network policies, and DDoS protection.
                  </li>
                  <li>
                    Conduct regular security audits and penetration testing.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Accessibility:</strong> Ensure the public-facing DPP
                viewer adheres to WCAG or similar accessibility standards.
              </li>
              <li>
                <strong>CI/CD:</strong> Implement Continuous
                Integration/Continuous Deployment pipelines for automated
                testing and deployments.
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5 text-primary" />
            Monitoring & Optimization (Conceptual)
          </CardTitle>
          <CardDescription>
            Strategies for monitoring system health and optimizing performance
            for the DPP platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Activity className="mr-2 h-4 w-4 text-accent" />
              Key Metrics to Monitor
            </h3>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <strong>DPP Viewer (Frontend):</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>
                    Page Load Times (e.g., Largest Contentful Paint, First Input
                    Delay).
                  </li>
                  <li>Client-side Error Rates (JavaScript errors).</li>
                  <li>
                    User Engagement: QR scan success rate (leading to viewer),
                    bounce rate, session duration.
                  </li>
                  <li>
                    API Call Latency (from frontend to backend for DPP data).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Backend API (Conceptual):</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>
                    Request Latency (average, p95, p99 for DPP retrieval, QR
                    validation).
                  </li>
                  <li>Error Rates (4xx, 5xx errors per endpoint).</li>
                  <li>Throughput (requests per second/minute).</li>
                  <li>Database Query Performance (if applicable).</li>
                </ul>
              </li>
              <li>
                <strong>(Mock) Blockchain Interactions (Conceptual):</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>
                    Transaction "Confirmation" Times (simulation of how long it
                    takes for a conceptual transaction to be "final").
                  </li>
                  <li>
                    Node Health/Availability (if simulating multiple nodes).
                  </li>
                  <li>
                    Smart Contract Execution Gas/Fees (conceptual, if
                    applicable).
                  </li>
                  <li>
                    Rate of data anchoring/retrieval from the mock blockchain.
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-accent" />
              Monitoring Tools (Conceptual)
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>Cloud Provider Monitoring:</strong> Services like Google
                Cloud Monitoring, AWS CloudWatch for infrastructure and
                service-level metrics.
              </li>
              <li>
                <strong>Application Performance Monitoring (APM):</strong> Tools
                like Sentry, Datadog, New Relic for detailed application
                tracing, error tracking, and performance insights.
              </li>
              <li>
                <strong>Logging Services:</strong> Centralized logging solutions
                (e.g., ELK Stack, Splunk, Grafana Loki) for aggregating and
                analyzing logs from all components.
              </li>
              <li>
                <strong>Frontend Monitoring:</strong> Tools that specialize in
                Real User Monitoring (RUM) and frontend error tracking.
              </li>
              <li>
                <strong>Analytics Platforms:</strong> For tracking user
                engagement and QR scan effectiveness (e.g., Google Analytics,
                Plausible).
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <DatabaseZap className="mr-2 h-4 w-4 text-accent" />
              Optimization Strategies (Conceptual)
            </h3>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <strong>Caching:</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>CDN caching for static assets of the DPP Viewer.</li>
                  <li>Server-side caching for frequently accessed DPP data.</li>
                  <li>
                    Client-side caching (browser cache, service workers) for the
                    DPP Viewer.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Data & API Optimization:</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>
                    Optimize database queries for speed and efficiency (if using
                    a real database).
                  </li>
                  <li>
                    Use pagination for API endpoints returning lists of DPPs or
                    events.
                  </li>
                  <li>Compress API responses (e.g., Gzip).</li>
                  <li>
                    Consider GraphQL if flexible data fetching becomes a strong
                    requirement.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Frontend Performance:</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>
                    Code splitting and lazy loading for JavaScript bundles.
                  </li>
                  <li>
                    Image optimization (using `next/image`, appropriate formats
                    and compression).
                  </li>
                  <li>Minimizing render-blocking resources.</li>
                  <li>Efficient state management in React components.</li>
                </ul>
              </li>
              <li>
                <strong>Scalability:</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>
                    Utilize auto-scaling capabilities of cloud platforms for
                    backend services and databases.
                  </li>
                  <li>
                    Design stateless backend services where possible to simplify
                    scaling.
                  </li>
                </ul>
              </li>
              <li>
                <strong>User Feedback & Iteration:</strong>
                <ul className="list-disc list-inside ml-5 text-xs text-muted-foreground">
                  <li>
                    Regularly collect user feedback on the DPP Viewer and
                    platform usability.
                  </li>
                  <li>
                    Use analytics and monitoring data to identify pain points
                    and areas for improvement.
                  </li>
                  <li>Iteratively refine UI/UX based on feedback and data.</li>
                </ul>
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </DocsPageLayout>
  );
}
