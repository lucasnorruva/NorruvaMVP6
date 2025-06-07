
"use client";

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info as InfoIcon, ExternalLink, TrendingUp, TrendingDown, Minus, LucideIcon, CalendarDays, MapPin, FileText, ListChecks, User, Link as LinkIconLucide } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';

interface Metric {
  name: string;
  status?: 'compliant' | 'non_compliant' | 'pending_review' | 'not_applicable';
  value?: string | number;
  unit?: string;
  targetValue?: number;
  reportLink?: string;
}

interface KeyDocument {
  name: string;
  type: 'PDF' | 'Link';
  url: string;
}

interface SubEvent {
  name: string;
  timestamp: string;
  status?: 'completed' | 'in_progress' | 'pending';
}

export interface LifecyclePhase {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'issue' | 'upcoming';
  icon: LucideIcon;
  timestamp?: string;
  location?: string;
  details?: string;
  complianceMetrics?: Metric[];
  sustainabilityMetrics?: Metric[];
  keyDocuments?: KeyDocument[];
  subEvents?: SubEvent[];
  responsibleParty?: string;
}

interface ProductLifecycleFlowchartProps {
  phases: LifecyclePhase[];
  currentPhaseIndex: number;
}

const getStatusClasses = (status: LifecyclePhase['status'], isCurrent: boolean) => {
  let bgColor = 'bg-muted dark:bg-muted/50';
  let textColor = 'text-muted-foreground';
  let borderColor = 'border-border';

  if (status === 'completed') {
    bgColor = 'bg-green-100 dark:bg-green-900/30';
    textColor = 'text-green-700 dark:text-green-300';
    borderColor = 'border-green-500/70';
  } else if (status === 'in_progress') {
    bgColor = 'bg-blue-100 dark:bg-blue-900/30';
    textColor = 'text-blue-700 dark:text-blue-300';
    borderColor = 'border-blue-500/70';
  } else if (status === 'issue') {
    bgColor = 'bg-red-100 dark:bg-red-900/30';
    textColor = 'text-red-700 dark:text-red-300';
    borderColor = 'border-red-500/70';
  } else if (status === 'pending' || status === 'upcoming') {
    bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
    textColor = 'text-yellow-700 dark:text-yellow-300';
    borderColor = 'border-yellow-500/70';
  }

  if (isCurrent) {
    borderColor = 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-background';
    bgColor = status === 'in_progress' ? 'bg-primary/20 dark:bg-primary/30' : bgColor;
  }
  return { bgColor, textColor, borderColor };
};

const MetricStatusIcon = ({ status }: { status: Metric['status'] }) => {
  if (status === 'compliant') return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === 'non_compliant') return <AlertCircle className="h-4 w-4 text-red-500" />;
  if (status === 'pending_review') return <InfoIcon className="h-4 w-4 text-yellow-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const SustainabilityMetricChart = ({ metric }: { metric: Metric }) => {
  if (typeof metric.value !== 'number') {
    return null;
  }

  const data = [{ name: metric.name, value: metric.value, target: metric.targetValue }];

  return (
    <div className="my-1 h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis type="number" hide={true} />
          <YAxis type="category" dataKey="name" hide={true} />
          <RechartsTooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            formatter={(value: number, name: string, props) => {
              const currentMetric = (props.payload && (props.payload as any).metric) ? (props.payload as any).metric as Metric : metric;
              const valStr = `${value}${currentMetric.unit || ''}`;
              const nameStr = name === 'target' ? 'Target' : currentMetric.name;
              return [valStr, nameStr];
            }}
          />
          {metric.targetValue !== undefined && (
            <Bar dataKey="target" fill="hsl(var(--muted))" background={{ fill: 'hsl(var(--background))' }} radius={[4, 4, 4, 4]} barSize={12} />
          )}
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ProductLifecycleFlowchart: React.FC<ProductLifecycleFlowchartProps> = ({ phases, currentPhaseIndex }) => {
  if (!phases || phases.length === 0) {
    return <p className="text-muted-foreground">No lifecycle phases defined for this product.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-headline">Product Journey</CardTitle>
        <CardDescription>Track the product's progress through its lifecycle stages.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start space-x-2 min-w-max">
            {phases.map((phase, index) => {
              const isCurrent = index === currentPhaseIndex;
              const { bgColor, textColor, borderColor } = getStatusClasses(phase.status, isCurrent);
              const IconComponent = phase.icon;

              return (
                <React.Fragment key={phase.id}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex flex-col items-center justify-center h-auto p-3 rounded-lg shadow-sm text-center min-w-[120px] max-w-[150px] transition-all hover:shadow-md",
                          bgColor, textColor, `border-2 ${borderColor}`,
                          isCurrent && "scale-105 shadow-lg"
                        )}
                      >
                        <IconComponent className={cn("h-8 w-8 mb-2", textColor)} />
                        <span className="text-xs font-semibold truncate w-full">{phase.name}</span>
                        <Badge variant="secondary" className={cn("mt-1 text-xs capitalize", bgColor, textColor, borderColor)}>
                          {phase.status.replace('_', ' ')}
                        </Badge>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 shadow-xl z-50 bg-card" side="bottom" align="center">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-md text-primary mb-2">{phase.name}</h4>

                        {phase.timestamp && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3 mr-1.5 text-muted-foreground/80"/>
                            {(new Date(phase.timestamp)).toLocaleDateString()}
                          </div>
                        )}
                        {phase.location && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1.5 text-muted-foreground/80"/>
                            {phase.location}
                          </div>
                        )}

                        {phase.details && <p className="text-sm text-foreground mt-1.5">{phase.details}</p>}

                        {phase.responsibleParty && (
                          <div className="pt-2 mt-2 border-t border-border/50">
                            <h5 className="text-xs font-semibold mb-0.5 text-muted-foreground uppercase tracking-wider flex items-center">
                              <User className="h-3.5 w-3.5 mr-1.5" />Responsible Party
                            </h5>
                            <p className="text-sm text-foreground">{phase.responsibleParty}</p>
                          </div>
                        )}

                        {phase.keyDocuments && phase.keyDocuments.length > 0 && (
                          <div className="pt-2 mt-2 border-t border-border/50">
                            <h5 className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider flex items-center">
                              <FileText className="h-3.5 w-3.5 mr-1.5" />Key Documents
                            </h5>
                            <ul className="space-y-1 text-xs">
                              {phase.keyDocuments.map(doc => {
                                const DocIcon = doc.type === 'PDF' ? FileText : LinkIconLucide;
                                return (
                                  <li key={doc.name} className="flex items-center justify-between p-1.5 bg-muted/30 rounded-sm">
                                    <span className="truncate pr-2 text-foreground/90 flex items-center">
                                      <DocIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                      {doc.name}
                                    </span>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {phase.subEvents && phase.subEvents.length > 0 && (
                           <div className="pt-2 mt-2 border-t border-border/50">
                            <h5 className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider flex items-center">
                              <ListChecks className="h-3.5 w-3.5 mr-1.5" />Sub-Events
                            </h5>
                            <ul className="space-y-1 text-xs">
                              {phase.subEvents.map(event => (
                                <li key={event.name} className="flex items-center justify-between p-1.5 bg-muted/30 rounded-sm">
                                  <span className="text-foreground/90">{event.name} <span className="text-muted-foreground/70">({new Date(event.timestamp).toLocaleDateString()})</span></span>
                                  {event.status && <Badge variant={event.status === 'completed' ? 'default' : 'outline'} className={`text-[0.6rem] px-1.5 py-0.5 ${event.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{event.status}</Badge>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {phase.complianceMetrics && phase.complianceMetrics.length > 0 && (
                          <div className="pt-2 mt-2 border-t border-border/50">
                            <h5 className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Compliance Checks:</h5>
                            <ul className="space-y-1 text-xs">
                              {phase.complianceMetrics.map(metric => (
                                <li key={metric.name} className="flex items-center justify-between p-1.5 bg-muted/50 rounded-sm">
                                  <span className="flex items-center text-foreground/90">
                                    <MetricStatusIcon status={metric.status} />
                                    <span className="ml-1.5">{metric.name}</span>
                                  </span>
                                  {metric.reportLink && (
                                    <a href={metric.reportLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {phase.sustainabilityMetrics && phase.sustainabilityMetrics.length > 0 && (
                          <div className="pt-2 mt-2 border-t border-border/50">
                            <h5 className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Sustainability Metrics:</h5>
                            <div className="space-y-1 text-xs">
                              {phase.sustainabilityMetrics.map(metric => (
                                <div key={metric.name} className="py-1 p-1.5 bg-muted/50 rounded-sm">
                                  <div className="flex justify-between items-center mb-0.5 text-foreground/90">
                                     <span className="font-medium">{metric.name}:</span>
                                     <span>{metric.value}{metric.unit && ` ${metric.unit}`}
                                      {typeof metric.value === 'number' && metric.targetValue !== undefined && (
                                        <span className={cn("ml-1 text-xs", metric.value <= metric.targetValue ? 'text-green-500' : 'text-red-500')}>
                                          ({metric.value <= metric.targetValue ? <TrendingUp className="inline h-3 w-3"/> : <TrendingDown className="inline h-3 w-3"/>} vs {metric.targetValue}{metric.unit && ` ${metric.unit}`})
                                        </span>
                                      )}
                                     </span>
                                  </div>
                                  {typeof metric.value === 'number' && <SustainabilityMetricChart metric={metric} />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {index < phases.length - 1 && (
                    <div className="flex-shrink-0 self-center w-8 h-1 bg-border rounded-full mx-1 md:mx-2" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductLifecycleFlowchart;

