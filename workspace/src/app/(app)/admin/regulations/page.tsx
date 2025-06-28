// --- File: src/app/(app)/admin/regulations/page.tsx ---
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Scale as ScaleIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Regulation {
  id: string;
  name: string;
  description: string;
  jurisdiction: 'EU' | 'USA' | 'Global' | 'Other';
  applicableCategories: string[];
  status: 'Active' | 'Draft' | 'Archived';
  lastUpdated: string;
}

const initialRegulations: Regulation[] = [
    { id: 'reg_001', name: 'EU Battery Regulation (2023/1542)', description: 'Comprehensive rules for the entire life cycle of batteries, from production to reuse and recycling.', jurisdiction: 'EU', applicableCategories: ['Automotive Parts', 'Electronics'], status: 'Active', lastUpdated: '2024-07-15T10:00:00Z' },
    { id: 'reg_002', name: 'Ecodesign for Sustainable Products Regulation (ESPR)', description: 'Framework to set ecodesign requirements for specific product groups to make them more durable, reliable, reusable, and recyclable.', jurisdiction: 'EU', applicableCategories: ['Appliances', 'Textiles', 'Furniture', 'Electronics'], status: 'Active', lastUpdated: '2024-06-28T14:30:00Z' },
    { id: 'reg_003', name: 'RoHS Directive (2011/65/EU)', description: 'Restricts the use of specific hazardous materials found in electrical and electronic products.', jurisdiction: 'EU', applicableCategories: ['Electronics', 'Appliances'], status: 'Active', lastUpdated: '2024-05-10T11:00:00Z' },
    { id: 'reg_004', name: 'US California Proposition 65', description: 'Requires businesses to provide warnings about significant exposures to chemicals that cause cancer, birth defects or other reproductive harm.', jurisdiction: 'USA', applicableCategories: ['All'], status: 'Draft', lastUpdated: '2024-07-20T09:00:00Z' },
    { id: 'reg_005', name: 'Construction Products Regulation (CPR)', description: 'Harmonised rules for the marketing of construction products in the EU.', jurisdiction: 'EU', applicableCategories: ['Construction Materials'], status: 'Active', lastUpdated: '2024-07-05T16:00:00Z' },
];

const defaultRegulationState: Omit<Regulation, 'id' | 'lastUpdated'> = {
  name: '',
  description: '',
  jurisdiction: 'EU',
  applicableCategories: [],
  status: 'Draft',
};

export default function RegulationManagementPage() {
  const { toast } = useToast();
  const [regulations, setRegulations] = useState<Regulation[]>(initialRegulations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegulation, setEditingRegulation] = useState<Regulation | null>(null);
  const [formData, setFormData] = useState<Omit<Regulation, 'id' | 'lastUpdated'>>(defaultRegulationState);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'jurisdiction' | 'status', value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, applicableCategories: value.split(',').map(c => c.trim()).filter(c => c) }));
  };

  const handleOpenDialog = (regulation?: Regulation) => {
    if (regulation) {
      setEditingRegulation(regulation);
      setFormData({
        ...regulation,
        applicableCategories: [...regulation.applicableCategories],
      });
    } else {
      setEditingRegulation(null);
      setFormData(defaultRegulationState);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast({ title: "Validation Error", description: "Name and Description are required.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editingRegulation) {
        setRegulations(prev => prev.map(reg => reg.id === editingRegulation.id ? { ...editingRegulation, ...formData, lastUpdated: new Date().toISOString() } : reg));
        toast({ title: "Regulation Updated", description: `"${formData.name}" has been updated.` });
      } else {
        const newRegulation: Regulation = {
          id: `reg_${Date.now().toString().slice(-5)}`,
          ...formData,
          lastUpdated: new Date().toISOString()
        };
        setRegulations(prev => [...prev, newRegulation]);
        toast({ title: "Regulation Added", description: `"${formData.name}" has been added.` });
      }
      setIsLoading(false);
      setIsDialogOpen(false);
    }, 500);
  };
  
  const handleDelete = (regId: string) => {
    setRegulations(prev => prev.filter(reg => reg.id !== regId));
    toast({ title: "Regulation Deleted (Mock)", description: `The regulation has been removed from this session.`, variant: "destructive" });
  };

  const getStatusBadgeStyle = (status: Regulation['status']) => {
    switch(status) {
      case 'Active': return "bg-green-100 text-green-700 border-green-300";
      case 'Draft': return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case 'Archived': return "bg-muted text-muted-foreground";
      default: return "bg-secondary";
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <ScaleIcon className="mr-3 h-7 w-7 text-primary" /> Regulation Management
        </h1>
        <Button onClick={() => handleOpenDialog()} variant="default">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Regulation
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Regulation Directory</CardTitle>
          <CardDescription>Manage compliance regulations and their applicability to product categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Regulation Name</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead>Applicable Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regulations.map(reg => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.name}</TableCell>
                  <TableCell>{reg.jurisdiction}</TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {reg.applicableCategories.map(cat => <Badge key={cat} variant="secondary" className="bg-blue-500/10 text-blue-700 border-blue-500/20">{cat}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(getStatusBadgeStyle(reg.status))}>{reg.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(reg)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(reg.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRegulation ? "Edit Regulation" : "Add New Regulation"}</DialogTitle>
            <DialogDescription>
              Define the regulation details. This is a conceptual tool to manage compliance logic.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="name">Regulation Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., EU Battery Regulation 2023/1542" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Briefly describe the regulation's purpose."/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select name="jurisdiction" onValueChange={(val) => handleSelectChange('jurisdiction', val)} value={formData.jurisdiction}>
                  <SelectTrigger id="jurisdiction"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EU">EU</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" onValueChange={(val) => handleSelectChange('status', val)} value={formData.status}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="applicableCategories">Applicable Product Categories (comma-separated)</Label>
              <Input id="applicableCategories" name="applicableCategories" value={formData.applicableCategories.join(', ')} onChange={handleCategoriesChange} placeholder="e.g., Electronics, Apparel, Furniture"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              {isLoading ? "Saving..." : "Save Regulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

