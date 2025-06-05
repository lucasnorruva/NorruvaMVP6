
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Edit, Trash2, MailWarning, UserCheck, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockUsers = [
  { id: "usr_001", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", status: "Active", lastActive: "2024-07-28" },
  { id: "usr_002", name: "Bob The Builder", email: "bob@example.com", role: "Manufacturer", status: "Active", lastActive: "2024-07-27" },
  { id: "usr_003", name: "Charlie Brown", email: "charlie@example.com", role: "Supplier", status: "Pending Invitation", lastActive: "N/A" },
  { id: "usr_004", name: "Diana Prince", email: "diana@example.com", role: "Retailer", status: "Active", lastActive: "2024-07-25" },
  { id: "usr_005", name: "Edward Scissorhands", email: "edward@example.com", role: "Recycler", status: "Deactivated", lastActive: "2024-06-15" },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">User Management</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Invite New User
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Company Users</CardTitle>
          <CardDescription>Manage users, their roles, and access to the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        user.status === "Active" ? "default" :
                        user.status === "Pending Invitation" ? "outline" :
                        "secondary" 
                      }
                      className={
                        user.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                        user.status === "Pending Invitation" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                        "bg-muted text-muted-foreground border-border" // Deactivated style
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">User Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User (Mock)
                        </DropdownMenuItem>
                        {user.status === "Pending Invitation" && (
                          <DropdownMenuItem>
                            <MailWarning className="mr-2 h-4 w-4" />
                            Resend Invitation (Mock)
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.status !== "Deactivated" ? (
                          <DropdownMenuItem className="text-orange-600 focus:text-orange-700 focus:bg-orange-500/10">
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate User (Mock)
                          </DropdownMenuItem>
                        ) : (
                           <DropdownMenuItem className="text-green-600 focus:text-green-700 focus:bg-green-500/10">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Reactivate User (Mock)
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove User (Mock)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
