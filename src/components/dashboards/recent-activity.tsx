import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentActivity() {
  // In a real app, this data would come from your API
  const activities = [
    {
      id: 1,
      user: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JS",
      },
      action: "completed",
      subject: "Self Assessment",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
      action: "submitted",
      subject: "Peer Review for Alex Johnson",
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
      action: "started",
      subject: "Manager Review for Emily Davis",
      timestamp: "Yesterday at 3:45 PM",
    },
    {
      id: 4,
      user: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "ED",
      },
      action: "updated",
      subject: "Development Goals",
      timestamp: "Yesterday at 1:30 PM",
    },
    {
      id: 5,
      user: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DW",
      },
      action: "commented",
      subject: "on Sarah Johnson's review",
      timestamp: "2 days ago",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions and updates in the review process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={activity.user.avatar}
                  alt={activity.user.name}
                />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  {activity.subject}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
