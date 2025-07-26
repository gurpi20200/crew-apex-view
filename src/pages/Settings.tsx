import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Shield, 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Database,
  Key,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  TestTube,
  Smartphone,
  Mail,
  MessageSquare
} from "lucide-react";

function AccountSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Security</h3>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input 
                  id="currentPassword" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TradingConfiguration() {
  const [defaultPositionSize, setDefaultPositionSize] = useState([10000]);
  const [maxPositionSize, setMaxPositionSize] = useState([50000]);
  const [globalStopLoss, setGlobalStopLoss] = useState([5]);
  const [maxDailyLoss, setMaxDailyLoss] = useState([2000]);

  return (
    <div className="space-y-6">
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Position Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Default Position Size</Label>
                <span className="text-sm font-medium">${defaultPositionSize[0].toLocaleString()}</span>
              </div>
              <Slider
                value={defaultPositionSize}
                onValueChange={setDefaultPositionSize}
                max={100000}
                min={1000}
                step={1000}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label>Maximum Position Size</Label>
                <span className="text-sm font-medium">${maxPositionSize[0].toLocaleString()}</span>
              </div>
              <Slider
                value={maxPositionSize}
                onValueChange={setMaxPositionSize}
                max={200000}
                min={10000}
                step={5000}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position Size Method</Label>
                <Select defaultValue="fixed">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Dollar Amount</SelectItem>
                    <SelectItem value="percentage">Percentage of Portfolio</SelectItem>
                    <SelectItem value="volatility">Volatility Adjusted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Maximum Positions</Label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 positions</SelectItem>
                    <SelectItem value="10">10 positions</SelectItem>
                    <SelectItem value="15">15 positions</SelectItem>
                    <SelectItem value="20">20 positions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Global Stop Loss</Label>
              <span className="text-sm font-medium">{globalStopLoss[0]}%</span>
            </div>
            <Slider
              value={globalStopLoss}
              onValueChange={setGlobalStopLoss}
              max={20}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Maximum Daily Loss</Label>
              <span className="text-sm font-medium">${maxDailyLoss[0].toLocaleString()}</span>
            </div>
            <Slider
              value={maxDailyLoss}
              onValueChange={setMaxDailyLoss}
              max={10000}
              min={500}
              step={250}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Order Type</Label>
              <Select defaultValue="market">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Order Timeout (minutes)</Label>
              <Input type="number" defaultValue="5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function APIConfiguration() {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Broker API (Alpaca)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                defaultValue="PK1234567890ABCDEF"
                className="font-mono"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Secret Key</Label>
            <Input
              type="password"
              placeholder="Enter secret key"
              className="font-mono"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Paper Trading Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use sandbox environment for testing
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <TestTube className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Button>Save Configuration</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Providers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Data Source</Label>
            <Select defaultValue="alpaca">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alpaca">Alpaca Markets</SelectItem>
                <SelectItem value="polygon">Polygon.io</SelectItem>
                <SelectItem value="iex">IEX Cloud</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>News & Sentiment Provider</Label>
            <Select defaultValue="newsapi">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newsapi">NewsAPI</SelectItem>
                <SelectItem value="finnhub">Finnhub</SelectItem>
                <SelectItem value="alpha">Alpha Vantage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Refresh Interval</Label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 second</SelectItem>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Historical Data Retention</Label>
              <Select defaultValue="1y">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 months</SelectItem>
                  <SelectItem value="6m">6 months</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                  <SelectItem value="2y">2 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    trades: true,
    riskAlerts: true,
    systemErrors: true,
    dailyReports: false,
    weeklyReports: true
  });

  const [smsNotifications, setSmsNotifications] = useState({
    criticalAlerts: true,
    systemDown: true,
    riskBreaches: true
  });

  return (
    <div className="space-y-6">
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(emailNotifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {key === 'trades' && 'Get notified when trades are executed'}
                  {key === 'riskAlerts' && 'Receive alerts when risk limits are breached'}
                  {key === 'systemErrors' && 'Get notified of system errors and issues'}
                  {key === 'dailyReports' && 'Daily performance and portfolio summary'}
                  {key === 'weeklyReports' && 'Weekly performance analysis'}
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) =>
                  setEmailNotifications(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(smsNotifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {key === 'criticalAlerts' && 'Critical system and trading alerts only'}
                  {key === 'systemDown' && 'Notifications when system goes offline'}
                  {key === 'riskBreaches' && 'Major risk limit violations'}
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) =>
                  setSmsNotifications(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show browser notifications when app is in background
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Sound Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Play sound for important notifications
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DisplayPreferences() {
  return (
    <div className="space-y-6">
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select defaultValue="dark">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Page</Label>
            <Select defaultValue="dashboard">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
                <SelectItem value="signals">Trading Signals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Currency Format</Label>
            <Select defaultValue="usd">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price Decimal Places</Label>
              <Select defaultValue="2">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 decimals</SelectItem>
                  <SelectItem value="3">3 decimals</SelectItem>
                  <SelectItem value="4">4 decimals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Table Rows Per Page</Label>
              <Select defaultValue="25">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                  <SelectItem value="100">100 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DataManagement() {
  return (
    <div className="space-y-6">
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Export Portfolio Data
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Export Trading History
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Export Strategy Config
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Export Performance Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Clear Cache</Label>
                <p className="text-sm text-muted-foreground">
                  Clear stored data and refresh from servers
                </p>
              </div>
              <Button variant="outline">Clear</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Reset Settings</Label>
                <p className="text-sm text-muted-foreground">
                  Reset all settings to default values
                </p>
              </div>
              <Button variant="outline">Reset</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-destructive">Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete account and all associated data
                </p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, trading preferences, and system configuration
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="trading">
          <TradingConfiguration />
        </TabsContent>

        <TabsContent value="api">
          <APIConfiguration />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="display">
          <DisplayPreferences />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}