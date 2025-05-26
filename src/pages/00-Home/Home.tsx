// "use client"
// import {
//   Bell,
//   ChevronDown,
//   Home,
//   Package,
//   Search,
//   Settings,
//   ShoppingCart,
//   TrendingUp,
//   Users,
//   BarChart3,
//   DollarSign,
//   Eye,
//   MoreHorizontal,
//   Plus,
//   Filter,
// } from "lucide-react"
// import Image from "next/image"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarInset,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const navigation = [
//   {
//     title: "Dashboard",
//     url: "#",
//     icon: Home,
//     isActive: true,
//   },
//   {
//     title: "Users",
//     url: "#",
//     icon: Users,
//   },
//   {
//     title: "Orders",
//     url: "#",
//     icon: ShoppingCart,
//   },
//   {
//     title: "Products",
//     url: "#",
//     icon: Package,
//   },
//   {
//     title: "Analytics",
//     url: "#",
//     icon: BarChart3,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ]

// const recentOrders = [
//   {
//     id: "ORD-001",
//     customer: "John Doe",
//     email: "john@example.com",
//     amount: "$299.00",
//     status: "completed",
//     date: "2024-01-15",
//   },
//   {
//     id: "ORD-002",
//     customer: "Jane Smith",
//     email: "jane@example.com",
//     amount: "$149.00",
//     status: "pending",
//     date: "2024-01-15",
//   },
//   {
//     id: "ORD-003",
//     customer: "Mike Johnson",
//     email: "mike@example.com",
//     amount: "$399.00",
//     status: "completed",
//     date: "2024-01-14",
//   },
//   {
//     id: "ORD-004",
//     customer: "Sarah Wilson",
//     email: "sarah@example.com",
//     amount: "$199.00",
//     status: "cancelled",
//     date: "2024-01-14",
//   },
//   {
//     id: "ORD-005",
//     customer: "Tom Brown",
//     email: "tom@example.com",
//     amount: "$599.00",
//     status: "completed",
//     date: "2024-01-13",
//   },
// ]

// const recentUsers = [
//   {
//     id: "USR-001",
//     name: "Alice Cooper",
//     email: "alice@example.com",
//     role: "Customer",
//     status: "active",
//     joinDate: "2024-01-15",
//   },
//   {
//     id: "USR-002",
//     name: "Bob Wilson",
//     email: "bob@example.com",
//     role: "Admin",
//     status: "active",
//     joinDate: "2024-01-14",
//   },
//   {
//     id: "USR-003",
//     name: "Carol Davis",
//     email: "carol@example.com",
//     role: "Customer",
//     status: "inactive",
//     joinDate: "2024-01-13",
//   },
// ]

// function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton size="lg" asChild>
//               <a href="#" className="flex items-center gap-2">
//                 <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//                   <BarChart3 className="size-4" />
//                 </div>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">AdminPanel</span>
//                   <span className="truncate text-xs">Dashboard</span>
//                 </div>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Navigation</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {navigation.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild isActive={item.isActive}>
//                     <a href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton>
//                   <Image
//                     src="/placeholder.svg?height=32&width=32"
//                     alt="Admin"
//                     width={32}
//                     height={32}
//                     className="rounded-full"
//                   />
//                   <span>Admin User</span>
//                   <ChevronDown className="ml-auto" />
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Profile</DropdownMenuItem>
//                 <DropdownMenuItem>Settings</DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Sign out</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   )
// }

// export function AdminDashboard() {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//           <SidebarTrigger className="-ml-1" />
//           <div className="flex flex-1 items-center gap-2">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input type="search" placeholder="Search..." className="pl-8" />
//             </div>
//             <Button variant="outline" size="icon">
//               <Bell className="h-4 w-4" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="icon">
//                   <Image
//                     src="/placeholder.svg?height=32&width=32"
//                     alt="Admin"
//                     width={32}
//                     height={32}
//                     className="rounded-full"
//                   />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Profile</DropdownMenuItem>
//                 <DropdownMenuItem>Settings</DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Sign out</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4">
//           <div className="grid gap-4">
//             <div className="flex items-center justify-between">
//               <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add New
//               </Button>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//                   <DollarSign className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">$45,231.89</div>
//                   <p className="text-xs text-muted-foreground">+20.1% from last month</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//                   <Users className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">2,350</div>
//                   <p className="text-xs text-muted-foreground">+180 new users this month</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
//                   <ShoppingCart className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">12,234</div>
//                   <p className="text-xs text-muted-foreground">+19% from last month</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Active Now</CardTitle>
//                   <TrendingUp className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">573</div>
//                   <p className="text-xs text-muted-foreground">+201 since last hour</p>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Main Content Tabs */}
//             <Tabs defaultValue="overview" className="space-y-4">
//               <TabsList>
//                 <TabsTrigger value="overview">Overview</TabsTrigger>
//                 <TabsTrigger value="orders">Recent Orders</TabsTrigger>
//                 <TabsTrigger value="users">Users</TabsTrigger>
//                 <TabsTrigger value="analytics">Analytics</TabsTrigger>
//               </TabsList>

//               <TabsContent value="overview" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//                   <Card className="col-span-4">
//                     <CardHeader>
//                       <CardTitle>Revenue Overview</CardTitle>
//                       <CardDescription>Monthly revenue for the last 6 months</CardDescription>
//                     </CardHeader>
//                     <CardContent className="pl-2">
//                       <div className="h-[200px] flex items-end justify-between gap-2">
//                         {[40, 60, 80, 45, 70, 90].map((height, i) => (
//                           <div key={i} className="bg-primary rounded-t flex-1" style={{ height: `${height}%` }} />
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card className="col-span-3">
//                     <CardHeader>
//                       <CardTitle>Recent Activity</CardTitle>
//                       <CardDescription>Latest activities in your dashboard</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <div className="flex items-center space-x-4">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full" />
//                           <div className="space-y-1">
//                             <p className="text-sm font-medium leading-none">New user registered</p>
//                             <p className="text-sm text-muted-foreground">2 minutes ago</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <div className="w-2 h-2 bg-green-500 rounded-full" />
//                           <div className="space-y-1">
//                             <p className="text-sm font-medium leading-none">Order completed</p>
//                             <p className="text-sm text-muted-foreground">5 minutes ago</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <div className="w-2 h-2 bg-orange-500 rounded-full" />
//                           <div className="space-y-1">
//                             <p className="text-sm font-medium leading-none">Payment received</p>
//                             <p className="text-sm text-muted-foreground">10 minutes ago</p>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>

//               <TabsContent value="orders" className="space-y-4">
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <div>
//                       <CardTitle>Recent Orders</CardTitle>
//                       <CardDescription>Manage and track your recent orders</CardDescription>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Button variant="outline" size="sm">
//                         <Filter className="mr-2 h-4 w-4" />
//                         Filter
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         Export
//                       </Button>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Order ID</TableHead>
//                           <TableHead>Customer</TableHead>
//                           <TableHead>Amount</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead>Date</TableHead>
//                           <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {recentOrders.map((order) => (
//                           <TableRow key={order.id}>
//                             <TableCell className="font-medium">{order.id}</TableCell>
//                             <TableCell>
//                               <div>
//                                 <div className="font-medium">{order.customer}</div>
//                                 <div className="text-sm text-muted-foreground">{order.email}</div>
//                               </div>
//                             </TableCell>
//                             <TableCell>{order.amount}</TableCell>
//                             <TableCell>
//                               <Badge
//                                 variant={
//                                   order.status === "completed"
//                                     ? "default"
//                                     : order.status === "pending"
//                                       ? "secondary"
//                                       : "destructive"
//                                 }
//                               >
//                                 {order.status}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>{order.date}</TableCell>
//                             <TableCell className="text-right">
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button variant="ghost" className="h-8 w-8 p-0">
//                                     <MoreHorizontal className="h-4 w-4" />
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                   <DropdownMenuItem>
//                                     <Eye className="mr-2 h-4 w-4" />
//                                     View details
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem>Edit</DropdownMenuItem>
//                                   <DropdownMenuSeparator />
//                                   <DropdownMenuItem className="text-red-600">Cancel order</DropdownMenuItem>
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="users" className="space-y-4">
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <div>
//                       <CardTitle>User Management</CardTitle>
//                       <CardDescription>Manage user accounts and permissions</CardDescription>
//                     </div>
//                     <Button>
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add User
//                     </Button>
//                   </CardHeader>
//                   <CardContent>
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>User ID</TableHead>
//                           <TableHead>Name</TableHead>
//                           <TableHead>Role</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead>Join Date</TableHead>
//                           <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {recentUsers.map((user) => (
//                           <TableRow key={user.id}>
//                             <TableCell className="font-medium">{user.id}</TableCell>
//                             <TableCell>
//                               <div>
//                                 <div className="font-medium">{user.name}</div>
//                                 <div className="text-sm text-muted-foreground">{user.email}</div>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant="outline">{user.role}</Badge>
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
//                             </TableCell>
//                             <TableCell>{user.joinDate}</TableCell>
//                             <TableCell className="text-right">
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button variant="ghost" className="h-8 w-8 p-0">
//                                     <MoreHorizontal className="h-4 w-4" />
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                   <DropdownMenuItem>View profile</DropdownMenuItem>
//                                   <DropdownMenuItem>Edit user</DropdownMenuItem>
//                                   <DropdownMenuSeparator />
//                                   <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="analytics" className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Traffic Sources</CardTitle>
//                       <CardDescription>Where your visitors are coming from</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm">Direct</span>
//                           <span className="text-sm font-medium">45%</span>
//                         </div>
//                         <div className="w-full bg-secondary rounded-full h-2">
//                           <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }} />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm">Search Engines</span>
//                           <span className="text-sm font-medium">30%</span>
//                         </div>
//                         <div className="w-full bg-secondary rounded-full h-2">
//                           <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }} />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm">Social Media</span>
//                           <span className="text-sm font-medium">25%</span>
//                         </div>
//                         <div className="w-full bg-secondary rounded-full h-2">
//                           <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }} />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Performance Metrics</CardTitle>
//                       <CardDescription>Key performance indicators</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm">Conversion Rate</span>
//                           <span className="text-sm font-medium text-green-600">+2.5%</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm">Bounce Rate</span>
//                           <span className="text-sm font-medium text-red-600">-1.2%</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm">Page Views</span>
//                           <span className="text-sm font-medium text-green-600">+15.3%</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm">Session Duration</span>
//                           <span className="text-sm font-medium text-green-600">+8.7%</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }
