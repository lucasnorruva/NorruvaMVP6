
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserCircle, Bell, Lock, Briefcase, FileCog } from "lucide-react"; // Added FileCog

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Settings</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><UserCircle className="mr-3 h-6 w-6 text-primary" /> Profile Settings</CardTitle>
          <CardDescription>Manage your personal information and account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" type="tel" defaultValue="+1 (555) 123-4567" />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Update Profile</Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Bell className="mr-3 h-6 w-6 text-primary" /> Notification Settings</CardTitle>
          <CardDescription>Control how you receive notifications from the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive important updates and alerts via email.
              </span>
            </Label>
            <Switch id="emailNotifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get real-time alerts directly on your device. (Requires app installation)
              </span>
            </Label>
            <Switch id="pushNotifications" />
          </div>
          <Button variant="outline">Save Notification Preferences</Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Lock className="mr-3 h-6 w-6 text-primary" /> Security Settings</CardTitle>
          <CardDescription>Manage your account security options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="outline">Enable Two-Factor Authentication</Button>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Briefcase className="mr-3 h-6 w-6 text-primary" /> Organization Settings</CardTitle>
          <CardDescription>Manage settings related to your organization (Admin only).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orgName">Organization Name</Label>
            <Input id="orgName" defaultValue="Acme Corp" />
          </div>
           <Button variant="outline">Manage Users</Button>
           <Button variant="outline">API Keys</Button>
           <Button variant="outline">
            <FileCog className="mr-2 h-4 w-4" />
            Customize Compliance Profile (Mock)
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
