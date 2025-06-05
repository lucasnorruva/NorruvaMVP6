
"use client"; // Converted to client component for state management

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, ShieldCheck, Cpu, ExternalLink, Building, Zap, ChevronDown, ChevronUp, Fingerprint, ServerIcon, AlertCircle, Info as InfoIcon } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import React, { useState, useEffect } from 'react'; 
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  // New fields for Blockchain & EBSI Verification
  anchorTransactionHash?: string;
  blockchainPlatform?: string;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified';
  ebsiVerificationId?: string;
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
    manufacturerWebsite: "#", 
    brandLogoUrl: "https://placehold.co/150x50.png?text=GreenTech",
    learnMoreLink: "#", 
    complianceSummary: "Fully compliant with EU Ecodesign and Energy Labelling regulations.",
    category: "Home Appliances",
    modelNumber: "X2000-ECO",
    anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef",
    blockchainPlatform: "MockChain (Ethereum Compatible)",
    ebsiStatus: 'verified',
    ebsiVerificationId: "EBSI-VC-ATTR-XYZ-00123",
  },
  "PROD002": {
    passportId: "PROD002",
    productName: "Smart LED Bulb (4-Pack)",
    tagline: "Illuminate Your World, Sustainably.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "led bulbs packaging",
    productStory: "Brighten your home responsibly with our Smart LED Bulb pack. These energy-efficient bulbs offer customizable lighting and connect to smart home systems. Designed for a long lifespan, reducing waste.", // Shortened story
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
    anchorTransactionHash: "0xdef456ghi789jkl012mno345pqr678stu901vwx234yz567abcdef012345",
    blockchainPlatform: "MockChain (Polygon Layer 2)",
    ebsiStatus: 'pending',
  }
};

type Props = {
  params: { passportId: string }
}

const STORY_TRUNCATE_LENGTH = 250;

export default function PublicPassportPage({ params }: Props) {
  const [product, setProduct] = useState<PublicProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  useEffect(() => {
    const fetchedProduct = MOCK_PUBLIC_PASSPORTS[params.passportId];
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    }
    setIsLoading(false);
  }, [params.passportId]);

  if (isLoading) {
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

  const displayProductStory = isStoryExpanded || product.productStory.length <= STORY_TRUNCATE_LENGTH
    ? product.productStory 
    : `${product.productStory.substring(0, STORY_TRUNCATE_LENGTH)}...`;

  const getEbsiStatusBadge = (status?: 'verified' | 'pending' | 'not_verified') => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30"><InfoIcon className="mr-1.5 h-3.5 w-3.5" />Pending</Badge>;
      case 'not_verified':
        return <Badge variant="destructive"><AlertCircle className="mr-1.5 h-3.5 w-3.5" />Not Verified</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

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
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-2">
              {product.productName}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">{product.tagline}</p>
            <div className="mt-3 text-sm text-muted-foreground">
                <span>Category: {product.category}</span> | <span>Model: {product.modelNumber}</span>
            </div>
          </div>

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

          <div className="mt-10 pt-8 border-t border-border">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Fingerprint className="mr-2 h-6 w-6" /> Blockchain &amp; EBSI Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {product.anchorTransactionHash && (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Product Record Hash:</span>
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <span className="font-mono text-xs break-all text-foreground truncate cursor-help">
                              {product.anchorTransactionHash}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="start">
                            <p className="max-w-xs break-all">{product.anchorTransactionHash}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  {product.blockchainPlatform && (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Platform:</span>
                      <span className="text-foreground">{product.blockchainPlatform}</span>
                    </div>
                  )}
                  {product.ebsiStatus && (
                     <div className="flex flex-col">
                        <span className="text-muted-foreground">EBSI Verification Status:</span>
                        <div className="flex items-center">
                            {getEbsiStatusBadge(product.ebsiStatus)}
                        </div>
                    </div>
                  )}
                  {product.ebsiStatus === 'verified' && product.ebsiVerificationId && (
                     <div className="flex flex-col">
                        <span className="text-muted-foreground">EBSI Verification ID:</span>
                        <span className="font-mono text-xs text-foreground break-all">{product.ebsiVerificationId}</span>
                    </div>
                  )}
                  {(!product.anchorTransactionHash && !product.ebsiStatus) && (
                     <p className="text-muted-foreground">No specific blockchain or EBSI verification details available for this product.</p>
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

