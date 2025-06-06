
"use client"; // Converted to client component for state management

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, ShieldCheck, Cpu, ExternalLink, Building, Zap, ChevronDown, ChevronUp, Fingerprint, ServerIcon, AlertCircle, Info as InfoIcon, ListChecks, History as HistoryIcon, Award } from 'lucide-react'; // Added Award icon
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

interface LifecycleHighlight {
  stage: string;
  date: string;
  details?: string;
  isEbsiVerified?: boolean;
}

interface PublicCertification {
  name: string;
  authority: string;
  expiryDate?: string;
  link?: string;
  isVerified?: boolean; // General verification status for UI
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
  anchorTransactionHash?: string;
  blockchainPlatform?: string;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified';
  ebsiVerificationId?: string;
  lifecycleHighlights?: LifecycleHighlight[];
  certifications?: PublicCertification[]; // Added for certifications
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
    lifecycleHighlights: [
      { stage: "Manufactured", date: "2024-01-15", details: "Production batch #PB789 at EcoFactory, Germany.", isEbsiVerified: true },
      { stage: "Shipped to Distributor", date: "2024-01-20", details: "Container #C0N741N3R.", isEbsiVerified: true },
      { stage: "Sold to Consumer", date: "2024-02-10", details: "Retail Store, Paris. Warranty activated.", isEbsiVerified: false },
      { stage: "Scheduled Maintenance", date: "2025-02-15", details: "Filter replacement complete.", isEbsiVerified: false },
    ],
    certifications: [
      { name: "EU Energy Label", authority: "European Commission", expiryDate: "N/A", link: "#", isVerified: true },
      { name: "CE Marking", authority: "Self-Certified (Manufacturer)", expiryDate: "N/A", isVerified: true },
      { name: "ISO 9001:2015", authority: "TUV SUD", expiryDate: "2026-05-20", link: "#", isVerified: false },
    ]
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
    lifecycleHighlights: [
      { stage: "Manufactured", date: "2024-03-01", details: "Batch #LEDB456, Shenzhen.", isEbsiVerified: true },
      { stage: "Imported to EU", date: "2024-03-15", details: "Rotterdam Port, Netherlands.", isEbsiVerified: false },
      { stage: "Firmware Update v1.2", date: "2024-08-01", details: "Improved energy efficiency algorithm.", isEbsiVerified: true },
    ],
    certifications: [
      { name: "RoHS Compliance", authority: "Self-Certified", expiryDate: "N/A", isVerified: true },
      { name: "CE Marking", authority: "Self-Certified", expiryDate: "N/A", isVerified: true },
    ]
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
    // Simulate API call
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
                priority={product.imageUrl ? !product.imageUrl.startsWith("data:") : true}
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
                  <CardTitle className="text-xl text-primary flex items-center">
                     <HistoryIcon className="mr-2 h-6 w-6" /> Product Journey Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.lifecycleHighlights && product.lifecycleHighlights.length > 0 ? (
                    <ul className="space-y-2">
                      {product.lifecycleHighlights.map((event, index) => (
                        <li key={index} className="text-sm text-foreground border-b border-border/50 pb-1.5 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{event.stage}</span>
                            <span className="text-xs text-muted-foreground">{event.date}</span>
                          </div>
                          {event.details && <p className="text-xs text-muted-foreground mt-0.5">{event.details}</p>}
                          {event.isEbsiVerified && (
                            <Badge variant="default" className="mt-1 text-xs bg-green-100 text-green-700 border-green-300">
                              <ShieldCheck className="mr-1 h-3 w-3" /> EBSI Verified
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No key lifecycle events available.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Award className="mr-2 h-6 w-6" /> Product Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.certifications && product.certifications.length > 0 ? (
                    <ul className="space-y-2">
                      {product.certifications.map((cert, index) => (
                        <li key={index} className="text-sm text-foreground border-b border-border/50 pb-1.5 last:border-b-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{cert.name}</span>
                            {cert.isVerified && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help">
                                      <ShieldCheck className="h-4 w-4 text-green-500" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Verified Certification</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">Authority: {cert.authority}</p>
                          {cert.expiryDate && <p className="text-xs text-muted-foreground">Expires: {cert.expiryDate}</p>}
                          {cert.link && (
                            <Link href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center">
                              View Details <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No certifications listed for this product.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
                 <Card className="md:col-span-2 lg:col-span-1 border-0 shadow-none">
                    <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary flex items-center">
                        <Fingerprint className="mr-2 h-6 w-6" /> Blockchain &amp; EBSI Verification
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm px-0 pb-0">
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
             <div className="mt-8 pt-6 border-t border-border">
                <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-xl text-primary">Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                    <p className="text-foreground">{product.complianceSummary}</p>
                    {product.learnMoreLink && (
                        <Link href={product.learnMoreLink} passHref className="mt-3 inline-block">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            Learn More About Our Standards
                        </Button>
                        </Link>
                    )}
                </CardContent>
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
