
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, ShieldCheck, Cpu, ExternalLink, Building, Zap } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import { Logo } from '@/components/icons/Logo';

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
    productStory: "Experience the future of refrigeration with the EcoFriendly Refrigerator X2000. Designed with both the planet and your lifestyle in mind, this appliance combines cutting-edge cooling technology with sustainable materials. Its spacious interior, smart energy management, and sleek design make it a perfect addition to any modern, eco-conscious home. We believe in transparency, and this Digital Product Passport gives you insight into its journey and impact. Built to last and designed for efficiency, the X2000 helps you reduce your environmental footprint without compromising on performance or style.",
    sustainabilityHighlights: [
      { iconName: "Leaf", text: "Energy Star Certified A+++" },
      { iconName: "Recycle", text: "Made with 70% recycled steel" },
      { iconName: "ShieldCheck", text: "95% recyclable at end-of-life" },
      { iconName: "Cpu", text: "Smart energy consumption features" }
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
    productStory: "Brighten your home responsibly with our Smart LED Bulb pack. These energy-efficient bulbs offer customizable lighting while consuming significantly less power than traditional bulbs. Connect them to your smart home system for voice control and scheduling. Each bulb is designed for a long lifespan, reducing waste and replacement frequency. This passport details their energy savings and material composition.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "Uses 85% less energy than incandescent bulbs" },
      { iconName: "Recycle", text: "Recyclable packaging materials" },
      { iconName: "ShieldCheck", text: "Mercury-free and RoHS compliant" },
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

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const passportId = params.passportId;
  const product = MOCK_PUBLIC_PASSPORTS[passportId];

  if (!product) {
    return {
      title: 'Product Passport Not Found',
    }
  }

  return {
    title: `${product.productName} - Digital Product Passport | Norruva`,
    description: product.tagline,
    // openGraph: {
    //   images: [product.imageUrl],
    // },
  }
}

export default async function PublicPassportPage({ params }: Props) {
  const passportId = params.passportId;
  const product = MOCK_PUBLIC_PASSPORTS[passportId];

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-off-white text-grey-900 flex flex-col">
      <header className="py-6 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" passHref>
            <Logo className="h-10 w-auto text-trust-blue" />
          </Link>
          <Badge variant="outline" className="border-trust-blue text-trust-blue text-sm">Digital Product Passport</Badge>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          {/* Product Header Section */}
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl md:text-4xl font-semibold text-trust-blue mb-2">
              {product.productName}
            </h1>
            <p className="text-lg md:text-xl text-grey-700">{product.tagline}</p>
            <div className="mt-3 text-sm text-grey-500">
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
              <Card className="bg-grey-100 border-grey-300">
                <CardHeader>
                  <CardTitle className="text-xl text-trust-blue">Product Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-grey-700 leading-relaxed">{product.productStory}</p>
                </CardContent>
              </Card>

              <Card className="border-growth-green/50">
                <CardHeader>
                  <CardTitle className="text-xl text-growth-green flex items-center">
                    <Leaf className="mr-2 h-6 w-6" /> Sustainability Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.sustainabilityHighlights.map((highlight, index) => {
                      const IconComponent = iconMap[highlight.iconName];
                      return (
                        <li key={index} className="flex items-center text-grey-700">
                          <IconComponent className="h-5 w-5 mr-3 text-growth-green flex-shrink-0" />
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
          <div className="mt-10 pt-8 border-t border-grey-300">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-trust-blue flex items-center">
                    <Building className="mr-2 h-6 w-6" /> Manufacturer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="text-lg font-semibold text-grey-900">{product.manufacturerName}</h3>
                  {product.brandLogoUrl && (
                     <div className="my-3">
                        <Image src={product.brandLogoUrl} alt={`${product.manufacturerName} Logo`} width={150} height={50} className="object-contain" data-ai-hint="brand logo" />
                     </div>
                  )}
                  {product.manufacturerWebsite && (
                    <Link href={product.manufacturerWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-trust-blue hover:underline">
                      Visit Website <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-trust-blue">Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-grey-700">{product.complianceSummary}</p>
                  {product.learnMoreLink && (
                    <Link href={product.learnMoreLink} passHref className="mt-3 inline-block">
                       <Button variant="outline" className="border-trust-blue text-trust-blue hover:bg-trust-blue/10">
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

      <footer className="py-8 bg-grey-900 text-grey-100 text-center mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Norruva. All rights reserved.</p>
          <p className="text-sm text-grey-300 mt-1">Empowering Transparent & Sustainable Commerce.</p>
        </div>
      </footer>
    </div>
  );
}

    