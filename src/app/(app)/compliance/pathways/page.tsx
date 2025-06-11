
"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { isEuCountry } from '@/lib/euCountryCodes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, BatteryCharging, Recycle, ShieldAlert, Construction, Database } from 'lucide-react'; // Added Database icon

interface Pathway {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  status: 'active' | 'coming_soon';
  euSpecific?: boolean;
}

const pathways: Pathway[] = [
  {
    id: 'battery-regulation',
    title: 'EU Battery Regulation Pathway',
    description: 'Prepare your Digital Battery Passport. Detail battery composition, carbon footprint, performance, due diligence, and end-of-life management as per EU 2023/1542.',
    icon: BatteryCharging,
    href: '/compliance/pathways/battery-regulation',
    status: 'active',
    euSpecific: true,
  },
  {
    id: 'espr',
    title: 'EU ESPR Pathway',
    description: 'Navigate the Ecodesign for Sustainable Products Regulation. Address durability, repairability, recycled content, and information requirements for various product categories.',
    icon: Recycle,
    href: '/compliance/pathways/espr',
    status: 'active',
    euSpecific: true,
  },
  {
    id: 'csrd',
    title: 'CSRD Alignment Guide',
    description: 'Understand how DPP data can support your Corporate Sustainability Reporting Directive obligations, particularly for product-related environmental and social impacts.',
    icon: BookOpen,
    href: '/compliance/pathways/csrd',
    status: 'active',
    euSpecific: true,
  },
  {
    id: 'scip',
    title: 'SCIP Database Notification Helper',
    description: 'Streamline the process of notifying the ECHA SCIP database for products containing Substances of Very High Concern (SVHCs) on the Candidate List.',
    icon: Database, // Updated icon to Database
    href: '/compliance/pathways/scip', // Updated href
    status: 'active', // Updated status
    euSpecific: true,
  },
];

export default function CompliancePathwaysPage() {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get('country');
  const country = countryParam ? decodeURIComponent(countryParam) : null;
  const highlightEU = isEuCountry(country);
  return (
    <div className="space-y-8">
      <div className="text-center">
        <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-semibold text-primary">Compliance Pathways Navigator</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Step-by-step guidance, tools, and resources to help you meet specific EU regulations and standards for your Digital Product Passports.
        </p>
        {highlightEU && country && (
          <p className="mt-2">
            <Badge variant="outline">Guidance for {country}</Badge>
          </p>
        )}
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Understanding Compliance Pathways</CardTitle>
          <CardDescription>
            These pathways are designed to simplify the complex landscape of product compliance. Each pathway focuses on a specific regulation, breaking down the requirements into manageable steps and helping you gather the necessary data for your DPPs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            By following these pathways, you can ensure your products not only meet legal obligations but also enhance transparency and build trust with consumers and stakeholders.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center font-headline">Available & Upcoming Pathways</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {pathways.map((pathway) => {
            const linkHref = country ? `${pathway.href}?country=${encodeURIComponent(country)}` : pathway.href;
            return (
            <Card
              key={pathway.id}
              className={`shadow-lg flex flex-col ${pathway.status === 'coming_soon' ? 'opacity-70' : ''} ${highlightEU && pathway.euSpecific ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="flex-shrink-0">
                <div className="flex items-start justify-between">
                  <pathway.icon className="h-10 w-10 text-primary mb-3 flex-shrink-0" />
                  {pathway.status === 'coming_soon' && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded-full font-medium flex items-center">
                      <Construction className="h-3 w-3 mr-1" /> Coming Soon
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl font-headline">{pathway.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{pathway.description}</p>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                {pathway.status === 'active' ? (
                  <Link href={linkHref} passHref>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Start Pathway <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            </Card>
            );
          })}
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">General Compliance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Stay informed about evolving EU regulations and their deadlines.</li>
            <li>Maintain accurate and comprehensive records for all product data.</li>
            <li>Collaborate closely with your supply chain partners to ensure data consistency.</li>
            <li>When in doubt, consult with legal or compliance experts specializing in EU product law.</li>
            <li>Regularly review and update your DPPs as product information or regulations change.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

