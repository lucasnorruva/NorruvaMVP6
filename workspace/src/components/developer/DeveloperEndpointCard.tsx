"use client";
import React from "react";
import ApiPlaygroundEndpointCard from "./ApiPlaygroundEndpointCard"; // This import should be correct if file structure is components/developer/ApiPlaygroundEndpointCard.tsx

export interface DeveloperEndpointCardProps {
  id: string; // Add id prop
  section: string; // Add section prop
  title: string;
  description: string;
  children: React.ReactNode;
  onSendRequest: () => void;
  isLoading: boolean;
  response: string | null;
  codeSnippet: string;
  snippetLanguage: string;
  onSnippetLanguageChange: (lang: string) => void;
  codeSampleLanguages: string[];
}

export default function DeveloperEndpointCard(
  props: DeveloperEndpointCardProps,
) {
  return <ApiPlaygroundEndpointCard {...props} />;
}
