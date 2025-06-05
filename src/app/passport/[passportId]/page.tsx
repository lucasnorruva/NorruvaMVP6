
"use client"; // Converted to client component for state management

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, ShieldCheck, Cpu, ExternalLink, Building, Zap, ChevronDown, ChevronUp } from 'lucide-react';
// Removed Metadata and ResolvingMetadata imports as they are for Server Components
// import type { Metadata, ResolvingMetadata } from 'next'; 
import { Logo } from '@/components/icons/Logo';
import React, { useState, useEffect } from 'react'; // Added useState and useEffect

// Define a type for icon mapping
type IconName = "Leaf" | "Recycle" | "ShieldCheck" | "Cpu" | "Zap";

const iconMap: Record<IconName, React.ElementType> = {
  Leaf,
  Recycle,
  ShieldCheck,
  Cpu,
  Zap,
};

interface SustainabilityHighlight {
  iconName: IconName;
  text: string;
}

interface PublicProductInfo {
  passportId: string;
  productName: string;
  tagline: string;
  imageUrl: string;
  imageHint: string;
  productStory: string;
  sustainabilityHighlights: SustainabilityHighlight[];
  manufacturerName: string;
  manufacturerWebsite?: string;
  brandLogoUrl?: string;
  learnMoreLink?: string;
  complianceSummary: string;
  category: string;
  modelNumber: string;
}

// Mock data for public passports - in a real app, this would come from an API
const MOCK_PUBLIC_PASSPORTS: Record<string, PublicProductInfo> = {
  "PROD001": {
    passportId: "PROD001",
    productName: "EcoFriendly Refrigerator X2000",
    tagline: "Sustainable Cooling, Smart Living.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "modern refrigerator kitchen",
    productStory: "Experience the future of refrigeration with the EcoFriendly Refrigerator X2000. Designed with both the planet and your lifestyle in mind, this appliance combines cutting-edge cooling technology with sustainable materials. Its spacious interior, smart energy management, and sleek design make it a perfect addition to any modern, eco-conscious home. We believe in transparency, and this Digital Product Passport gives you insight into its journey and impact. Built to last and designed for efficiency, the X2000 helps you reduce your environmental footprint without compromising on performance or style. More details include advanced frost-free systems, optimized airflow for even temperature distribution, and compartments designed for specific food types to prolong freshness. The user interface is intuitive, allowing easy control over temperature settings and special modes like vacation mode or quick cool.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "Energy Star Certified A+++" },
      { iconName: "Recycle", text: "Made with 70% recycled steel" },
      { iconName: "Recycle", text: "95% recyclable at end-of-life" },
      { iconName: "Zap", text: "Smart energy consumption features" }
    ],
    manufacturerName: "GreenTech Appliances",
    manufacturerWebsite: "#", // Placeholder link
    brandLogoUrl: "https://placehold.co/150x50.png?text=GreenTech",
    learnMoreLink: "#", // Placeholder link
    complianceSummary: "Fully compliant with EU Ecodesign and Energy Labelling regulations.",
    category: "Home Appliances",
    modelNumber: "X2000-ECO",
  },
  "PROD002": {
    passportId: "PROD002",
    productName: "Smart LED Bulb (4-Pack)",
    tagline: "Illuminate Your World, Sustainably.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "led bulbs packaging",
    productStory: "Brighten your home responsibly with our Smart LED Bulb pack. These energy-efficient bulbs offer customizable lighting while consuming significantly less power than traditional bulbs. Connect them to your smart home system for voice control and scheduling. Each bulb is designed for a long lifespan, reducing waste and replacement frequency. This passport details their energy savings and material composition. Furthermore, these bulbs support a wide range of colors and tunable white light, from warm to cool, allowing you to create the perfect ambiance for any occasion. Firmware updates are delivered over-the-air to enhance features and security.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "Uses 85% less energy than incandescent bulbs" },
      { iconName: "Recycle", text: "Recyclable packaging materials" },
      { iconName: "Leaf", text: "Mercury-free design" },
    ],
    manufacturerName: "BrightSpark Electronics",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=BrightSpark",
    learnMoreLink: "#",
    complianceSummary: "Complies with EU energy efficiency and hazardous substance directives.",
    category: "Electronics",
    modelNumber: "BS-LED-S04",
  }
};

type Props = {
  params: { passportId: string }
}

// generateMetadata needs to be removed or handled differently for client components if dynamic,
// or moved to a parent Server Component layout. For now, removing it.
// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> { ... }

const STORY_TRUNCATE_LENGTH = 250;

export default function PublicPassportPage({ params }: Props) {
  const [product, setProduct] = useState<PublicProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    const fetchedProduct = MOCK_PUBLIC_PASSPORTS[params.passportId];
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    }
    setIsLoading(false);
  }, [params.passportId]);

  if (isLoading) {
    // Basic loading state, can be replaced with a skeleton loader
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product passport...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const toggleStoryExpansion = () => {
    setIsStoryExpanded(!isStoryExpanded);
  };

  const displayProductStory = isStoryExpanded 
    ? product.productStory 
    : `${product.productStory.substring(0, STORY_TRUNCATE_LENGTH)}...`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 bg-card shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" passHref>
            <Logo className="h-10 w-auto text-primary" />
          </Link>
          <Badge variant="outline" className="border-primary text-primary text-sm">Digital Product Passport</Badge>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
          {/* Product Header Section */}
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-2">
              {product.productName}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">{product.tagline}</p>
            <div className="mt-3 text-sm text-muted-foreground">
                <span>Category: {product.category}</span> | <span>Model: {product.modelNumber}</span>
            </div>
          </div>

          {/* Main Content: Image and Details */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="w-full">
              <Image
                src={product.imageUrl}
                alt={product.productName}
                width={800}
                height={600}
                className="rounded-lg object-cover shadow-md aspect-[4/3]"
                data-ai-hint={product.imageHint}
                priority
              />
            </div>
            <div className="space-y-6">
              <Card className="bg-muted border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Product Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{displayProductStory}</p>
                  {product.productStory.length > STORY_TRUNCATE_LENGTH && (
                    <Button 
                      variant="link" 
                      onClick={toggleStoryExpansion} 
                      className="p-0 h-auto mt-2 text-primary hover:text-primary/80"
                    >
                      {isStoryExpanded ? "Read Less" : "Read More"}
                      {isStoryExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="border-accent/50">
                <CardHeader>
                  <CardTitle className="text-xl text-accent flex items-center">
                    <Leaf className="mr-2 h-6 w-6" /> Sustainability Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.sustainabilityHighlights.map((highlight, index) => {
                      const IconComponent = iconMap[highlight.iconName];
                      return (
                        <li key={index} className="flex items-center text-foreground">
                          <IconComponent className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                          <span>{highlight.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Manufacturer & Compliance Section */}
          <div className="mt-10 pt-8 border-t border-border">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Building className="mr-2 h-6 w-6" /> Manufacturer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{product.manufacturerName}</h3>
                  {product.brandLogoUrl && (
                     <div className="my-3">
                        <Image src={product.brandLogoUrl} alt={`${product.manufacturerName} Logo`} width={150} height={50} className="object-contain" data-ai-hint="brand logo" />
                     </div>
                  )}
                  {product.manufacturerWebsite && (
                    <Link href={product.manufacturerWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                      Visit Website <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{product.complianceSummary}</p>
                  {product.learnMoreLink && (
                    <Link href={product.learnMoreLink} passHref className="mt-3 inline-block">
                       <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        Learn More About Our Standards
                       </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-foreground text-background text-center mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Norruva. All rights reserved.</p>
          <p className="text-sm text-muted-foreground mt-1">Empowering Transparent & Sustainable Commerce.</p>
        </div>
      </footer>
    </div>
  );
}
