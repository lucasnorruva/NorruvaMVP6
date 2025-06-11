"use client";
import React from 'react';
import ApiPlaygroundEndpointCard from './ApiPlaygroundEndpointCard';

export interface DeveloperEndpointCardProps {
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

export default function DeveloperEndpointCard(props: DeveloperEndpointCardProps) {
  return <ApiPlaygroundEndpointCard {...props} />;
}
