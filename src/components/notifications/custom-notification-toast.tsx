"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BellRing, X } from "lucide-react";

interface NotificationProps {
  title: string;
  body: string;
  image?: string;
  onDismiss?: () => void;
  onAction?: () => void;
  actionText?: string;
  timestamp?: string;
}

export const CustomNotificationToast = ({
  title,
  body,
  image,
  onDismiss,
  onAction,
  actionText = "View",
  timestamp = "Just now",
}: NotificationProps) => {
  return (
    <Card className="w-full max-w-md border border-border/40 bg-background/95 backdrop-blur-sm shadow-lg animate-in slide-in-from-right-5 duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border border-border/30 shadow-sm">
            {image ? (
              <AvatarImage src={image || "/placeholder.svg"} alt={title} />
            ) : (
              <AvatarFallback className="bg-primary/10">
                <BellRing className="h-5 w-5 text-primary" />
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{title}</h4>
              <button
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{body}</p>
            <p className="text-xs text-muted-foreground/70">{timestamp}</p>
          </div>
        </div>
      </CardContent>

      {onAction && (
        <CardFooter className="px-4 py-2 border-t border-border/30 bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            className="ml-auto text-xs font-medium"
          >
            {actionText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
