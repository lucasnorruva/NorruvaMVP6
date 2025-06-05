
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Globe, Info } from "lucide-react";
import Image from "next/image";

export default function DppGlobalTrackerPage() {
  const conceptDescription = `
Core Idea:
Create an interactive 3D globe centered around the European Union that dynamically displays data from the Digital Product Passports (DPPs) across different regions. This globe could act as a “Digital Pulse” of product movement, ownership, lifecycle, certifications, and compliance in real-time.

Key Features of the DPP Global Tracker:
1. 3D EU Globe Visualization:
   - The globe would have a rotating, interactive European Union at its center.
   - As the user interacts with the globe (using the mouse, touchpad, or via VR/AR devices), they can spin, zoom in, and out, and hover over countries or specific regions within the EU.

2. Dynamic Product Data Points:
   - Instead of just numbers or linear graphs, each product tracked via the DPP can have its own floating 3D icon (e.g., a small spinning product, a digital passport icon, or a product box).
   - These product icons would move around the globe based on factors like product lifecycle stages (e.g., “created”, “shipped”, “sold”, “recycled”).
   - Products that are part of the same supply chain or from the same manufacturer could be grouped together with a glowing, colorful halo around them, indicating relationships or certifications.

3. Color-Coded Regions and Data Layers:
   - The globe could be color-coded to show different compliance statuses or certifications (e.g., eco-friendly, sustainability, safety).
   - Green for fully compliant products, yellow for pending or under review, and red for products with issues or flagged for non-compliance.
   - Users can toggle between layers of data such as:
     - Environmental impact: Show carbon footprint of products in each country with animated heatmaps.
     - Product lifecycle stage: Show the percentage of products in the creation phase, transportation, or end of life.
     - Compliance with EU regulations: Show certification statuses and compliance metrics like ESPR, EPREL, or EBSI.

4. Interactive Data Pop-ups & Info Cards:
   - When a user hovers over a country or clicks on a specific product, an info card would pop up, showing detailed product passport data such as:
     - Product origin, lifecycle, certifications, and product category.
     - Blockchain verification status, linking back to the specific product’s blockchain record and providing a direct link to the product’s digital passport.
     - Traceability information, showing product movement history, ownership, and compliance with EU regulations.

5. Tracking Product Movement in Real-Time:
   - Animated lines or beams could dynamically represent product flows across Europe, showing products being shipped, transferred, or tracked in real-time.
   - This could look like a flowing pulse of energy, lighting up the path the product is taking from one region to another, representing its movement throughout its lifecycle.
   - The speed and brightness of the pulse could be adjusted based on factors like product urgency, shipment speed, or market demand.

6. Dynamic Data Animation:
   - Instead of just showing static data, each product's data point could have movement that represents the product’s life cycle.
   - For example, when a product is in transit, a moving dashed line or animated path could show its movement across the globe.
   - As a product goes from “manufactured” to “shipped” to “sold,” it could transition through animated visual stages (e.g., product icons turning from grey to color, growing larger as it reaches its final destination).

7. Country/Region-Specific Hotspots:
   - Hotspot Indicators could highlight regions where a significant amount of DPP data is being generated or tracked.
   - For example, countries with heavy product movement or large manufacturing centers (e.g., Germany, France, or Italy) could pulse or glow, drawing attention to areas with high activity.
   - Clicking on these hotspots could give insights into the most popular products, certification compliance rates, or blockchain activity in that region.

8. User Interaction & Personalization:
   - Users can filter by product type, regulatory compliance, or certification to see the flow and status of specific kinds of products.
   - Allow users to set alerts or notifications for specific products or regions (e.g., "Notify me when a product reaches EBSI compliance" or "Track product lifecycle for sustainable goods").
   - The globe could have an augmented reality (AR) mode where users could scan QR codes on physical products and see the global tracker for that specific item, visually represented on the globe.

9. Real-Time Data Updates:
   - The tracker could be connected to real-time data feeds for updated product movements, new certifications, and compliance statuses, ensuring that the system stays accurate and dynamic.
   - This would allow users to watch live changes on the globe (e.g., products being certified, moving across borders, entering markets).

10. Geographical & Blockchain Layers Toggle:
    - Users can toggle between geographical data layers (e.g., EU-wide product flows, country-by-country data) and blockchain-related data (e.g., smart contract status, verification results).
    - Visual transitions between these data sets can include zooming in/out on the globe or transforming the globe’s surface to display the appropriate data dynamically.

Technical Implementation Ideas:
- 3D Globe Technology: Use technologies like WebGL, Three.js, or Babylon.js to build the interactive globe. These technologies support 3D rendering and complex animations, which are essential for a smooth user experience.
- Data Visualization: Implement D3.js for creating dynamic and interactive visualizations (e.g., product movement paths, heatmaps) overlaid on the globe.
- Real-time Data Integration: Use APIs to pull live data from the blockchain and EBSI systems, updating the visualizations in real-time.
- User Interface: Create an intuitive, interactive dashboard where users can filter by product type, compliance status, and lifecycle stage. The dashboard should be embedded alongside the globe or act as an overlay.

Conclusion:
The DPP Global Tracker with an interactive 3D EU globe would be a visually engaging and immersive tool for tracking digital product passports, lifecycle data, and compliance across Europe. This concept moves beyond traditional numbers and tables, leveraging dynamic visuals and real-time interactivity to create a compelling and user-friendly experience. By combining real-time data, geographical visualization, and blockchain integration, you’ll have an engaging tool that shows the full scope of product movements and compliance statuses in a highly dynamic, intuitive way.
  `;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Globe className="mr-3 h-8 w-8 text-primary" />
          DPP Global Tracker – "The EU Digital Pulse" (Conceptual)
        </h1>
      </div>

      <Alert variant="default" className="bg-info/10 border-info/50 text-info-foreground">
        <Info className="h-5 w-5 text-info" />
        <AlertTitle className="font-semibold text-info">Conceptual Feature</AlertTitle>
        <AlertDescription>
          The following describes an advanced concept for a DPP Global Tracker. The full implementation of an interactive 3D globe with real-time data is a significant undertaking beyond the current prototyping scope. This page serves as a placeholder for this vision.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Visualizing the EU Digital Pulse</CardTitle>
          <CardDescription>A dynamic and interactive way to track Digital Product Passports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
            <Image
              src="https://placehold.co/800x450.png?text=Interactive+EU+Globe+Concept"
              alt="Conceptual EU Globe Tracker"
              width={800}
              height={450}
              className="object-contain"
              data-ai-hint="globe europe data"
            />
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {conceptDescription.trim().split('\n\n').map((paragraphBlock, index) => {
              const lines = paragraphBlock.split('\n');
              const firstLine = lines[0].trim();

              const mainHeaders = ["Core Idea:", "Key Features of the DPP Global Tracker:", "Technical Implementation Ideas:", "Conclusion:"];
              const isMainHeader = mainHeaders.some(header => firstLine.startsWith(header));
              const isNumberedFeature = firstLine.match(/^(\d+)\.\s+.+/);

              if (isMainHeader) {
                return (
                  <div key={index} className="pt-2">
                    <h2 className="text-xl font-headline text-primary mt-6 mb-3 !no-underline">{firstLine}</h2>
                    {lines.slice(1).map((line, lineIdx) => <p key={lineIdx} className="my-1">{line}</p>)}
                  </div>
                );
              } else if (isNumberedFeature) {
                return (
                  <div key={index} className="mt-1">
                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2 !no-underline">{firstLine}</h3>
                    {lines.slice(1).map((line, lineIdx) => {
                      const trimmedLine = line.trim();
                      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                        // This basic list detection might not be perfect with Tailwind Prose
                        return <p key={lineIdx} className="my-1 ml-4 before:content-['•_'] before:mr-2">{trimmedLine.substring(2)}</p>;
                      }
                       // Render sub-bullet points if line starts with multiple spaces then a dash/bullet
                      if (trimmedLine.match(/^(\s{2,}-\s|\s{2,}\u2022\s)/)) {
                        return <p key={lineIdx} className="my-1 ml-8 before:content-['\25E6_'] before:mr-2">{trimmedLine.replace(/^(\s{2,}[-\u2022]\s)/, '')}</p>;
                      }
                      if (trimmedLine) {
                        return <p key={lineIdx} className="my-1">{trimmedLine}</p>;
                      }
                      return null;
                    })}
                  </div>
                );
              }
              if (paragraphBlock.trim()) {
                return <p key={index} className="my-2">{paragraphBlock}</p>;
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
